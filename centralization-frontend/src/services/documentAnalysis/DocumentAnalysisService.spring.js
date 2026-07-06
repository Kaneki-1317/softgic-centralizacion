import api from "../api";
import { STAGE } from "./documentAnalysisContract";

/**
 * Implementación real del contrato DocumentAnalysisService (ver documentAnalysisContract.js).
 * Envía el PDF como binario puro (Blob crudo en el body), sin FormData y sin
 * Base64, a POST /casos/analizar-documento (Spring Boot -> n8n).
 *
 * El backend hoy solo admite un archivo por análisis, por lo que si el
 * usuario adjuntó varios, solo se envía el primero.
 *
 * @param {File[]} files
 * @param {{ onProgress?: (stageKey: string) => void }} [options]
 * @returns {Promise<import("./documentAnalysisContract").AnalysisResult>}
 */
async function analyze(files, { onProgress } = {}) {
  if (!files || files.length === 0) {
    throw new Error("No hay documentos para analizar.");
  }

  const file = files[0];

  onProgress?.(STAGE.RECEIVED);
  onProgress?.(STAGE.PREPARING);
  onProgress?.(STAGE.PROCESSING);

  let response;
  try {
    response = await api.post("/casos/analizar-documento", file, {
      headers: {
        "Content-Type": "application/pdf",
        "X-Filename": encodeURIComponent(file.name),
      },
    });
  } catch (err) {
    const message = err.response?.data?.message || "Error al analizar el documento. Intenta de nuevo.";
    throw new Error(message);
  }

  onProgress?.(STAGE.GENERATING);
  onProgress?.(STAGE.FINALIZING);

  return response.data;
}

export default { analyze };
