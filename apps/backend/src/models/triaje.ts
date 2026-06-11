/**
 * GLUP — Repositorio de triajes (SQLite vía better-sqlite3)
 *
 * Diseño disociado (Ley 29733):
 *   sessionId   → UUID v4 aleatorio, no trazable al paciente
 *   semaforo    → categoría clínica (sin biométrico identificable)
 *   imc         → número sin nombre ni DNI asociado
 *   nombre_enc  → AES-256-GCM ciphertext
 *   whatsapp_enc→ AES-256-GCM ciphertext
 *   intentos    → contador de reintentos de webhook
 *   ultimo_error→ mensaje del último error (para diagnóstico)
 *
 * La tabla NO guarda peso, estatura ni las respuestas individuales del test.
 * Solo persiste lo mínimo para reintentar el webhook y auditar el estado.
 *
 * Estrategia de migración: usa PRAGMA table_info() para detectar columnas
 * faltantes y aplica ALTER TABLE de forma segura en installs existentes.
 */

import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

// ─── Types ────────────────────────────────────────────────────────────────────

export type Semaforo      = 'VERDE' | 'AMARILLA' | 'ROJA';
export type EstadoWebhook = 'PENDIENTE' | 'ENVIADO' | 'FALLIDO';

export interface TriajeRecord {
  id:             string;        // sessionId (UUID v4)
  semaforo:       Semaforo;
  imc:            number;
  nombre_enc:     string;        // AES-256-GCM ciphertext
  whatsapp_enc:   string;        // AES-256-GCM ciphertext
  estado_webhook: EstadoWebhook;
  intentos:       number;        // cantidad de intentos de webhook realizados
  ultimo_error:   string | null; // mensaje del último error (para diagnóstico)
  created_at:     string;        // ISO 8601
  webhook_at:     string | null; // ISO 8601 del último cambio de estado
}

/** Campos requeridos para insertar un registro nuevo (el resto tiene defaults). */
export type NuevoTriaje = Pick<
  TriajeRecord,
  'id' | 'semaforo' | 'imc' | 'nombre_enc' | 'whatsapp_enc' | 'estado_webhook' | 'created_at'
>;

// ─── Singleton SQLite ─────────────────────────────────────────────────────────

const DB_PATH = process.env.DB_PATH
  ?? path.resolve(process.cwd(), 'data', 'glup.db');

let _db: Database.Database | null = null;

function db(): Database.Database {
  if (_db) return _db;

  mkdirSync(path.dirname(DB_PATH), { recursive: true });

  _db = new Database(DB_PATH);
  _db.pragma('journal_mode = WAL');       // lecturas concurrentes sin bloqueo
  _db.pragma('synchronous   = NORMAL');   // durabilidad sin penalidad de fsync por write
  _db.pragma('foreign_keys  = ON');

  // ── Crear tabla con schema completo ────────────────────────────────────────
  _db.exec(`
    CREATE TABLE IF NOT EXISTS triajes (
      id              TEXT    PRIMARY KEY,
      semaforo        TEXT    NOT NULL CHECK(semaforo IN ('VERDE','AMARILLA','ROJA')),
      imc             REAL    NOT NULL CHECK(imc > 0 AND imc < 100),
      nombre_enc      TEXT    NOT NULL,
      whatsapp_enc    TEXT    NOT NULL,
      estado_webhook  TEXT    NOT NULL DEFAULT 'PENDIENTE'
                              CHECK(estado_webhook IN ('PENDIENTE','ENVIADO','FALLIDO')),
      intentos        INTEGER NOT NULL DEFAULT 0,
      ultimo_error    TEXT,
      created_at      TEXT    NOT NULL,
      webhook_at      TEXT
    );

    -- Índice compuesto para la query de reintentos: estado + intentos + fecha
    CREATE INDEX IF NOT EXISTS idx_triajes_reintento
      ON triajes (estado_webhook, intentos, created_at ASC);
  `);

  // ── Migración incremental (installs existentes sin las columnas nuevas) ────
  const cols = new Set(
    (_db.prepare('PRAGMA table_info(triajes)').all() as Array<{ name: string }>)
      .map(c => c.name),
  );

  if (!cols.has('intentos')) {
    _db.exec(`ALTER TABLE triajes ADD COLUMN intentos INTEGER NOT NULL DEFAULT 0`);
    console.info('[GLUP DB] Migración: columna "intentos" añadida a triajes.');
  }
  if (!cols.has('ultimo_error')) {
    _db.exec(`ALTER TABLE triajes ADD COLUMN ultimo_error TEXT`);
    console.info('[GLUP DB] Migración: columna "ultimo_error" añadida a triajes.');
  }

  return _db;
}

// ─── Statements preparados (compilados una sola vez por proceso) ──────────────

let _stmtInsert:          Database.Statement | null = null;
let _stmtUpdateWebhook:   Database.Statement | null = null;
let _stmtIncrementar:     Database.Statement | null = null;
let _stmtSelectReintento: Database.Statement | null = null;

const stmt = {
  insert(): Database.Statement {
    return (_stmtInsert ??= db().prepare(`
      INSERT INTO triajes
        (id, semaforo, imc, nombre_enc, whatsapp_enc, estado_webhook, created_at)
      VALUES
        (@id, @semaforo, @imc, @nombre_enc, @whatsapp_enc, @estado_webhook, @created_at)
    `));
  },

  updateWebhook(): Database.Statement {
    return (_stmtUpdateWebhook ??= db().prepare(`
      UPDATE triajes
      SET    estado_webhook = @estado,
             webhook_at     = @webhook_at
      WHERE  id = @id
    `));
  },

  incrementar(): Database.Statement {
    return (_stmtIncrementar ??= db().prepare(`
      UPDATE triajes
      SET    intentos      = intentos + 1,
             ultimo_error  = @error,
             estado_webhook = 'FALLIDO',
             webhook_at    = @webhook_at
      WHERE  id = @id
    `));
  },

  selectReintento(): Database.Statement {
    return (_stmtSelectReintento ??= db().prepare(`
      SELECT * FROM triajes
      WHERE  estado_webhook IN ('PENDIENTE', 'FALLIDO')
      AND    intentos < @max_intentos
      ORDER  BY created_at ASC
      LIMIT  200
    `));
  },
};

// ─── Repository API ───────────────────────────────────────────────────────────

/** Persiste un nuevo triaje con estado inicial PENDIENTE. */
export function guardarTriaje(record: NuevoTriaje): void {
  stmt.insert().run(record);
}

/**
 * Marca el webhook como ENVIADO o FALLIDO.
 * Registra la marca de tiempo exacta del cambio.
 */
export function actualizarEstadoWebhook(id: string, estado: EstadoWebhook): void {
  stmt.updateWebhook().run({ id, estado, webhook_at: new Date().toISOString() });
}

/**
 * Incrementa el contador de intentos y guarda el mensaje de error.
 * Fija automáticamente el estado en 'FALLIDO'.
 * El mensaje de error se trunca a 500 caracteres para no inflar la BD.
 */
export function incrementarIntentos(id: string, error: string): void {
  stmt.incrementar().run({
    id,
    error:      error.slice(0, 500),
    webhook_at: new Date().toISOString(),
  });
}

/**
 * Retorna registros candidatos para reintento (PENDIENTE o FALLIDO)
 * que aún no han alcanzado el límite de intentos.
 *
 * @param maxIntentos Umbral de intentos (excluye registros con intentos >= este valor).
 */
export function buscarParaReintento(maxIntentos = 5): TriajeRecord[] {
  return stmt.selectReintento().all({ max_intentos: maxIntentos }) as TriajeRecord[];
}
