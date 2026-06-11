/**
 * GLUP — Cifrado simétrico AES-256-GCM
 *
 * Usa cifrado autenticado (AEAD) que garantiza simultáneamente:
 *   • Confidencialidad  — sin la clave, el contenido es ilegible
 *   • Integridad        — cualquier alteración del ciphertext lanza error en decrypt
 *   • Autenticidad      — el auth-tag verifica el origen del dato
 *
 * Ley 29733 (Perú): los datos de contacto del paciente (nombre, whatsapp)
 * se cifran antes de persistir y solo se descifran al momento de reintento
 * de webhook, nunca en la respuesta HTTP.
 *
 * Formato de salida de encrypt():
 *   "<iv_hex>:<authTag_hex>:<ciphertext_hex>"
 *
 * Generar ENCRYPTION_KEY:
 *   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */

import { createCipheriv, createDecipheriv, randomBytes, timingSafeEqual } from 'node:crypto';

const ALGORITHM = 'aes-256-gcm' as const;
const IV_BYTES  = 12;   // 96 bits — recomendado por NIST para GCM
const TAG_BYTES = 16;   // 128 bits — longitud máxima del auth-tag GCM
const SEPARATOR = ':';
const PARTS     = 3;

// ─── Resolución de clave ──────────────────────────────────────────────────────

let _cachedKey: Buffer | null = null;

function resolveKey(): Buffer {
  if (_cachedKey) return _cachedKey;

  const raw = process.env.ENCRYPTION_KEY;
  if (!raw) {
    throw new Error(
      '[GLUP Crypto] ENCRYPTION_KEY no está configurada en .env.\n' +
      'Genera una con: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"',
    );
  }

  const key = Buffer.from(raw, 'hex');
  if (key.length !== 32) {
    throw new Error(
      `[GLUP Crypto] ENCRYPTION_KEY debe ser exactamente 32 bytes (64 hex chars). ` +
      `Se recibieron ${key.length} bytes (${raw.length} chars).`,
    );
  }

  _cachedKey = key;
  return key;
}

// ─── API pública ──────────────────────────────────────────────────────────────

/**
 * Cifra `text` con AES-256-GCM.
 * Cada llamada genera un IV aleatorio único → cifrando el mismo texto
 * dos veces producirá outputs distintos (semántica IND-CPA).
 *
 * @returns Cadena en formato "<iv_hex>:<authTag_hex>:<ciphertext_hex>"
 */
export function encrypt(text: string): string {
  const key    = resolveKey();
  const iv     = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: TAG_BYTES });

  const ciphertext = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return [
    iv.toString('hex'),
    tag.toString('hex'),
    ciphertext.toString('hex'),
  ].join(SEPARATOR);
}

/**
 * Descifra un valor producido por `encrypt`.
 * Lanza `Error` si el ciphertext fue alterado (fallo de verificación GCM),
 * si el formato es inválido, o si la clave no coincide.
 *
 * @param cipherText Cadena "<iv_hex>:<authTag_hex>:<ciphertext_hex>"
 * @returns Texto plano original
 */
export function decrypt(cipherText: string): string {
  const key   = resolveKey();
  const parts = cipherText.split(SEPARATOR);

  if (parts.length !== PARTS) {
    throw new Error(
      `[GLUP Crypto] Formato de cipherText inválido. ` +
      `Se esperaban ${PARTS} segmentos separados por "${SEPARATOR}", ` +
      `se recibieron ${parts.length}.`,
    );
  }

  const [ivHex, tagHex, encHex] = parts;

  let iv: Buffer, tag: Buffer, enc: Buffer;
  try {
    iv  = Buffer.from(ivHex,  'hex');
    tag = Buffer.from(tagHex, 'hex');
    enc = Buffer.from(encHex, 'hex');
  } catch {
    throw new Error('[GLUP Crypto] Los segmentos del cipherText no son hex válido.');
  }

  if (iv.length !== IV_BYTES) {
    throw new Error(`[GLUP Crypto] IV inválido: se esperaban ${IV_BYTES} bytes, recibidos ${iv.length}.`);
  }
  if (tag.length !== TAG_BYTES) {
    throw new Error(`[GLUP Crypto] Auth-tag inválido: se esperaban ${TAG_BYTES} bytes.`);
  }

  const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: TAG_BYTES });
  decipher.setAuthTag(tag);

  try {
    return Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8');
  } catch {
    // GCM auth-tag mismatch — datos alterados o clave incorrecta
    throw new Error('[GLUP Crypto] Verificación de integridad fallida. El cipherText fue alterado o la clave es incorrecta.');
  }
}

/**
 * Compara dos strings en tiempo constante para evitar timing attacks
 * al comparar tokens o secretos.
 */
export function safeEqual(a: string, b: string): boolean {
  try {
    return timingSafeEqual(Buffer.from(a, 'utf8'), Buffer.from(b, 'utf8'));
  } catch {
    return false; // buffers de distinto largo → false sin lanzar error
  }
}
