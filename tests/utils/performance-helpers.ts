export class PerformanceHelper {
  
  static calculateStats(tempos: number[]): {
    media: number;
    mediana: number;
    minimo: number;
    maximo: number;
    percentil95: number;
  } {
    const sorted = [...tempos].sort((a, b) => a - b);
    const total = sorted.length;

    const media = sorted.reduce((a, b) => a + b, 0) / total;
    const mediana = total % 2 === 0
      ? (sorted[total / 2 - 1] + sorted[total / 2]) / 2
      : sorted[Math.floor(total / 2)];
    const minimo = sorted[0];
    const maximo = sorted[total - 1];
    const percentil95 = sorted[Math.floor(total * 0.95)];

    return { media, mediana, minimo, maximo, percentil95 };
  }

  static formatTime(ms: number): string {
    if (ms < 1000) {
      return `${ms.toFixed(0)}ms`;
    }
    return `${(ms / 1000).toFixed(2)}s`;
  }

  static calculateRPS(totalRequisicoes: number, tempoTotalMs: number): number {
    return (totalRequisicoes / tempoTotalMs) * 1000;
  }

  static async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async measureTime<T>(fn: () => Promise<T>): Promise<{ result: T; time: number }> {
    const inicio = Date.now();
    const result = await fn();
    const time = Date.now() - inicio;
    return { result, time };
  }
}