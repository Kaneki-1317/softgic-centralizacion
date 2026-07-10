import { Trash2 } from "lucide-react";
import { DELETE_MESSAGES } from "./constants";

/**
 * Sub-modal de confirmación al eliminar un ítem de catálogo (tecnología,
 * categoría o laboratorio) desde el formulario de caso.
 */
export default function ConfirmDeleteCatalogModal({ confirmDelete, onCancel, onConfirm }) {
  if (!confirmDelete.open) return null;

  return (
    <div className="quick-create-overlay" onClick={onCancel}>
      <div
        className="confirm-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-modal-title"
      >
        <div className="confirm-icon">
          <Trash2 size={28} />
        </div>
        <h3 id="confirm-delete-modal-title">{DELETE_MESSAGES[confirmDelete.type]}</h3>
        <p>
          Se eliminará <strong>"{confirmDelete.item?.label}"</strong> de todos los casos donde aparezca.
          Esta acción no se puede deshacer.
        </p>
        <div className="confirm-actions">
          <button
            className="ghost-button"
            onClick={onCancel}
            disabled={confirmDelete.loading}
          >
            Cancelar
          </button>
          <button
            className="danger-button"
            onClick={onConfirm}
            disabled={confirmDelete.loading}
          >
            {confirmDelete.loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
