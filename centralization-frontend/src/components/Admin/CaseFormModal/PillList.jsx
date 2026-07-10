import { X } from "lucide-react";

// En su propio módulo (no una función interna del formulario) para que nunca
// se redefina en cada render — un componente redefinido por render pierde su
// identidad y React lo desmonta en vez de reconciliarlo, reseteando
// cualquier estado interno.
export default function PillList({ items, selectedIds, field, type, isDeleteMode, onToggle, onAskDelete }) {
  return (
    <div className="modal-tags">
      {items.map((item) => (
        <div key={item.id} className="pill-wrapper">
          <button
            type="button"
            className={`form-tag-pill ${selectedIds.includes(item.id) ? "selected" : ""} ${isDeleteMode ? "delete-mode-pill" : ""}`}
            onClick={() => !isDeleteMode && onToggle(field, item.id)}
            aria-pressed={selectedIds.includes(item.id)}
            aria-disabled={isDeleteMode}
          >
            {item.label}
          </button>
          {isDeleteMode && (
            <button
              type="button"
              className="pill-delete-x"
              onClick={() => onAskDelete(type, item)}
              title={`Eliminar "${item.label}"`}
              aria-label={`Eliminar "${item.label}"`}
            >
              <X size={9} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
