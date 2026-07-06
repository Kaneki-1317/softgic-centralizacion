// Barrel del DocumentAnalysisService.
//
// Este es el ÚNICO punto de conexión que cambia según el entorno de análisis
// de documentos. Implementación activa: DocumentAnalysisService.spring.js
// (llama a POST /casos/analizar-documento, que Spring Boot reenvía a n8n).
// Ningún componente (NewCaseWizard, DocumentUploadStep, AnalysisProgressStep)
// ni AdminPage necesita cambiar.
import documentAnalysisService from "./DocumentAnalysisService.spring";

export { documentAnalysisService };

export { STAGE, STAGE_ORDER, STAGE_LABELS } from "./documentAnalysisContract";
