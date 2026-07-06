import { STAGE, STAGE_ORDER } from "./documentAnalysisContract";

// Duración simulada por etapa (ms). Total ≈ 4.9s: visible pero no tedioso.
const STAGE_DELAYS_MS = {
  [STAGE.RECEIVED]: 400,
  [STAGE.PREPARING]: 900,
  [STAGE.PROCESSING]: 1600,
  [STAGE.GENERATING]: 1400,
  [STAGE.FINALIZING]: 600,
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function prettifyFileName(fileName) {
  const withoutExtension = fileName.replace(/\.[^./\\]+$/, "");
  const spaced = withoutExtension.replace(/[_-]+/g, " ").trim();
  if (!spaced) return "Caso sin título";
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/**
 * Genera un resultado ficticio pero plausible a partir de los archivos subidos.
 *
 * tipoCaso/tecnologias/categorias/laboratorios se dejan vacíos deliberadamente:
 * adivinar nombres que podrían no existir en la metadata real (tiposCasos,
 * tecnologias, etc. de esta instalación) dejaría los pills sin seleccionar de
 * todos modos, pero con una apariencia engañosa de haberlo intentado. Los
 * campos de texto libre sí pueden fabricarse sin ese riesgo.
 */
function buildFakeResult(files) {
  const primaryName = files[0]?.name ?? "documento";
  return {
    titulo: prettifyFileName(primaryName),
    sector: "Salud",
    cliente: "Cliente de ejemplo S.A.S.",
    anioImplementacion: new Date().getFullYear(),
    beneficioPrincipal: "Reducción del 40% en tiempos de gestión gracias a la automatización del proceso.",
    reto: "El cliente necesitaba centralizar información dispersa en múltiples documentos y sistemas manuales.",
    resultados: "Se automatizó el flujo completo, mejorando la trazabilidad y reduciendo errores manuales.",
    tipoCaso: "",
    tecnologias: [],
    categorias: [],
    laboratorios: [],
  };
}

/**
 * Implementación mock del contrato DocumentAnalysisService (ver documentAnalysisContract.js).
 * @param {File[]} files
 * @param {{ onProgress?: (stageKey: string) => void }} [options]
 * @returns {Promise<import("./documentAnalysisContract").AnalysisResult>}
 */
async function analyze(files, { onProgress } = {}) {
  if (!files || files.length === 0) {
    throw new Error("No hay documentos para analizar.");
  }

  for (const stage of STAGE_ORDER) {
    onProgress?.(stage);
    await delay(STAGE_DELAYS_MS[stage]);
  }

  return buildFakeResult(files);
}

export default { analyze };
