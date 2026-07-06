/**
 * Contrato de DocumentAnalysisService.
 *
 * Cualquier implementación (mock hoy, n8n/OpenAI en el futuro) debe exponer:
 *
 *   analyze(files: File[], options?: AnalyzeOptions) => Promise<AnalysisResult>
 *
 * @typedef {Object} AnalyzeOptions
 * @property {(stageKey: string) => void} [onProgress] - invocado con una de las STAGE_ORDER cada vez que el análisis avanza de etapa.
 *
 * @typedef {Object} AnalysisResult
 * @property {string} titulo
 * @property {string} sector
 * @property {string} [cliente]
 * @property {number|string} [anioImplementacion]
 * @property {string} beneficioPrincipal
 * @property {string} reto
 * @property {string} [resultados]
 * @property {string} tipoCaso - nombre del tipo de caso (se resuelve por nombre contra tiposCasos en CaseFormModal)
 * @property {string[]} tecnologias - labels (se resuelven por label contra tecnologias en CaseFormModal)
 * @property {string[]} categorias - labels (se resuelven por label contra categorias en CaseFormModal)
 * @property {string[]} laboratorios - labels (se resuelven por label contra laboratorios en CaseFormModal)
 */

export const STAGE = {
  RECEIVED: "received",
  PREPARING: "preparing",
  PROCESSING: "processing",
  GENERATING: "generating",
  FINALIZING: "finalizing",
};

export const STAGE_ORDER = [
  STAGE.RECEIVED,
  STAGE.PREPARING,
  STAGE.PROCESSING,
  STAGE.GENERATING,
  STAGE.FINALIZING,
];

export const STAGE_LABELS = {
  [STAGE.RECEIVED]: "Documento recibido",
  [STAGE.PREPARING]: "Preparando análisis...",
  [STAGE.PROCESSING]: "Procesando documento...",
  [STAGE.GENERATING]: "Generando información...",
  [STAGE.FINALIZING]: "Finalizando...",
};
