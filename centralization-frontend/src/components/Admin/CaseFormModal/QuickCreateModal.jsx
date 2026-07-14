import { useRef } from "react";
import { Loader2, X } from "lucide-react";
import { QUICK_CONFIG } from "./constants";
import { useFocusTrap } from "../../../hooks/useFocusTrap";

/**
 * Sub-modal de creación rápida de un ítem de catálogo (tecnología, categoría
 * o laboratorio) sin salir del formulario de caso.
 */
export default function QuickCreateModal({ quickCreate, onNameChange, onSubmit, onClose }) {
  const panelRef = useRef(null);

  useFocusTrap(panelRef, quickCreate.open);

  if (!quickCreate.open) return null;

  const config = QUICK_CONFIG[quickCreate.type];

  return (
    <div className="quick-create-overlay" onClick={onClose}>
      <div
        className="quick-create-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-create-modal-title"
        ref={panelRef}
      >
        <div className="quick-create-header">
          <h5 className="quick-create-title" id="quick-create-modal-title">{config.title}</h5>
          <button type="button" className="quick-create-close" onClick={onClose} aria-label="Cerrar">
            <X size={15} />
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <input
            className="form-input"
            placeholder={config.placeholder}
            aria-label={config.title}
            aria-describedby={quickCreate.error ? "quick-create-error" : undefined}
            value={quickCreate.name}
            onChange={(e) => onNameChange(e.target.value)}
            autoFocus
            required
            maxLength={100}
          />
          {quickCreate.error && (
            <p className="quick-create-error" id="quick-create-error" role="alert">{quickCreate.error}</p>
          )}
          <div className="quick-create-actions">
            <button type="button" className="ghost-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="primary-button" disabled={quickCreate.loading}>
              {quickCreate.loading && <Loader2 size={14} className="spin" />}
              {quickCreate.loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
