/**
 * Validación pura de archivos para el flujo "Crear desde Documento".
 * Sin dependencias de red ni de React — reutilizable desde DocumentUploadStep
 * y, más adelante, desde la implementación real del servicio si la necesita.
 */

export const ACCEPTED_EXTENSIONS = [
  "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "odt", "ods", "odp",
];

export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB por archivo

// Los pills de "Documentos del caso" en CaseFormModal solo entienden estos 4 tipos.
const EXTENSION_TO_DOC_TYPE = {
  pdf: "PDF",
  doc: "DOCX",
  docx: "DOCX",
  xls: "XLSX",
  xlsx: "XLSX",
  ppt: "PPTX",
  pptx: "PPTX",
  odt: "DOCX",
  ods: "XLSX",
  odp: "PPTX",
  txt: "PDF",
};

export function getExtension(fileName) {
  const dotIndex = fileName.lastIndexOf(".");
  if (dotIndex === -1) return "";
  return fileName.slice(dotIndex + 1).toLowerCase();
}

export function isAcceptedExtension(fileName) {
  return ACCEPTED_EXTENSIONS.includes(getExtension(fileName));
}

/**
 * @param {File} file
 * @returns {{ valid: true } | { valid: false, reason: "unsupported_type" | "too_large" }}
 */
export function validateFile(file) {
  if (!isAcceptedExtension(file.name)) {
    return { valid: false, reason: "unsupported_type" };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, reason: "too_large" };
  }
  return { valid: true };
}

/**
 * Mapea la extensión del archivo a uno de los 4 valores de DOC_TYPES
 * que ya usa CaseFormModal (PDF | DOCX | XLSX | PPTX).
 */
export function inferTipoFromExtension(fileName) {
  return EXTENSION_TO_DOC_TYPE[getExtension(fileName)] || "PDF";
}
