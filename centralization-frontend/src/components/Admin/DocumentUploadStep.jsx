import { useRef, useState } from "react";
import { AlertTriangle, ArrowLeft, CheckCircle2, UploadCloud, X } from "lucide-react";
import {
  ACCEPTED_EXTENSIONS,
  MAX_FILE_SIZE_BYTES,
  getExtension,
  validateFile,
} from "../../services/documentAnalysis/fileValidation";

const ACCEPT_ATTR = ACCEPTED_EXTENSIONS.map((ext) => `.${ext}`).join(",");
const MAX_FILE_SIZE_LABEL = `${Math.round(MAX_FILE_SIZE_BYTES / (1024 * 1024))}MB`;

const ERROR_LABELS = {
  unsupported_type: "Tipo no admitido",
  too_large: `Archivo muy grande (máx. ${MAX_FILE_SIZE_LABEL})`,
};

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function buildEntry(file) {
  return {
    id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
    file,
    validation: validateFile(file),
  };
}

/**
 * Paso 2 del wizard: dropzone + tabla de archivos + botón "Analizar Documento".
 * Controlado desde NewCaseWizard vía entries/onEntriesChange para que la
 * selección de archivos sobreviva si el usuario vuelve a este paso tras un
 * fallo de análisis.
 */
export default function DocumentUploadStep({ entries, onEntriesChange, onAnalyze, onBack }) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const validEntries = entries.filter((e) => e.validation.valid);
  const canAnalyze = validEntries.length > 0;

  function addFiles(fileList) {
    const newEntries = Array.from(fileList).map(buildEntry);
    if (newEntries.length === 0) return;
    onEntriesChange([...entries, ...newEntries]);
  }

  function removeEntry(id) {
    onEntriesChange(entries.filter((e) => e.id !== id));
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files);
  }

  function handleInputChange(e) {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = ""; // permite volver a seleccionar el mismo archivo
  }

  return (
    <div className="upload-step-wrap">
      <p className="form-modal-eyebrow">Crear desde Documento</p>
      <h4 className="modal-section-label">
        <UploadCloud size={13} /> Documentos del caso
      </h4>

      <div
        className={`upload-dropzone ${dragActive ? "drag-active" : ""}`}
        onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <UploadCloud size={30} className="upload-dropzone-icon" />
        <p className="upload-dropzone-text">Arrastra tus archivos aquí o haz clic para seleccionarlos</p>
        <p className="upload-dropzone-hint">
          PDF, Word, Excel, PowerPoint, TXT u OpenDocument · máx. {MAX_FILE_SIZE_LABEL} por archivo
        </p>
        <input
          ref={inputRef}
          type="file"
          className="upload-input-hidden"
          multiple
          accept={ACCEPT_ATTR}
          onChange={handleInputChange}
        />
      </div>

      {entries.length > 0 && (
        <div className="upload-file-table">
          <div className="upload-file-row upload-file-row-header">
            <span>Nombre</span>
            <span>Tamaño</span>
            <span>Tipo</span>
            <span>Estado</span>
            <span />
          </div>
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`upload-file-row ${entry.validation.valid ? "status-ready" : "status-error"}`}
            >
              <span className="upload-file-name">{entry.file.name}</span>
              <span className="upload-file-size">{formatFileSize(entry.file.size)}</span>
              <span className="upload-file-type">{getExtension(entry.file.name).toUpperCase()}</span>
              <span className="upload-file-status-pill">
                {entry.validation.valid ? (
                  <><CheckCircle2 size={12} /> Listo</>
                ) : (
                  <><AlertTriangle size={12} /> {ERROR_LABELS[entry.validation.reason]}</>
                )}
              </span>
              <button
                type="button"
                className="upload-file-remove-btn"
                onClick={() => removeEntry(entry.id)}
                title="Quitar archivo"
                aria-label="Quitar archivo"
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="form-actions">
        <button type="button" className="ghost-button" onClick={onBack}>
          <ArrowLeft size={14} /> Atrás
        </button>
        <button type="button" className="primary-button" disabled={!canAnalyze} onClick={onAnalyze}>
          Analizar Documento
        </button>
      </div>
    </div>
  );
}
