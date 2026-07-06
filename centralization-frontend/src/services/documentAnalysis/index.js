// Barrel del DocumentAnalysisService.
//
// Este es el ÚNICO punto de conexión que debe cambiar cuando exista la
// integración real con n8n / OpenAI: reemplazar la importación de abajo por
// la implementación real (p. ej. "./DocumentAnalysisService.n8n") y mantener
// el mismo contrato (ver documentAnalysisContract.js). Ningún componente
// (NewCaseWizard, DocumentUploadStep, AnalysisProgressStep) ni AdminPage
// necesita cambiar.
import mockDocumentAnalysisService from "./DocumentAnalysisService.mock";

export const documentAnalysisService = mockDocumentAnalysisService;

export { STAGE, STAGE_ORDER, STAGE_LABELS } from "./documentAnalysisContract";
