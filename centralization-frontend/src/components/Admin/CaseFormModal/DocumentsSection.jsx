import { FileText, Paperclip, Plus, X } from "lucide-react";
import { DOC_TYPES } from "./constants";

/**
 * Sección "Documentos del caso" — lista editable de recursos (tipo, nombre,
 * URL) adjuntos al caso.
 */
export default function DocumentsSection({ recursos, onAdd, onRemove, onUpdate }) {
  return (
    <section className="modal-section docs-section">
      <div className="docs-section-header">
        <h4 className="modal-section-label docs-section-label">
          <Paperclip size={13} /> Documentos del caso
        </h4>
        <button type="button" className="docs-add-btn" onClick={onAdd}>
          <Plus size={13} /> Agregar
        </button>
      </div>
      <p className="docs-hint">PDF, Word, Excel o PowerPoint. Solo admite links a documentos.</p>

      {recursos.length === 0 ? (
        <div className="docs-empty">
          <FileText size={26} />
          <span>Sin documentos adjuntos</span>
        </div>
      ) : (
        <div className="docs-list">
          {recursos.map((doc, i) => (
            <div key={i} className="doc-item">
              <div className="doc-item-top">
                <div className="doc-type-pills">
                  {DOC_TYPES.map((dt) => (
                    <button
                      key={dt.value}
                      type="button"
                      className="doc-type-pill"
                      style={doc.tipo === dt.value
                        ? { background: dt.bg, color: dt.color, borderColor: dt.color }
                        : {}}
                      onClick={() => onUpdate(i, "tipo", dt.value)}
                      aria-pressed={doc.tipo === dt.value}
                    >
                      {dt.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="doc-remove-btn"
                  onClick={() => onRemove(i)}
                  aria-label="Quitar documento"
                >
                  <X size={13} />
                </button>
              </div>
              <div className="doc-item-fields">
                <input
                  className="form-input"
                  placeholder="Nombre del documento..."
                  aria-label="Nombre del documento"
                  value={doc.nombre}
                  onChange={(e) => onUpdate(i, "nombre", e.target.value)}
                />
                <input
                  className="form-input"
                  type="url"
                  placeholder="https://..."
                  aria-label="URL del documento"
                  value={doc.url}
                  onChange={(e) => onUpdate(i, "url", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
