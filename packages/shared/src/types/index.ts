export type ResultadoSemaforo = 'VERDE' | 'AMARILLA' | 'ROJA';

export interface ResultadoTriaje {
  sessionId: string;
  semaforo: ResultadoSemaforo;
  imc: number;
  timestamp: string;
}
