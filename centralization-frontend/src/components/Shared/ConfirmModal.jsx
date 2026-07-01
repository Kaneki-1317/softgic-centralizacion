import { Trash2 } from "lucide-react";

export default function ConfirmModal({ open, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="modal-overlay confirm-overlay" onClick={onCancel}>
      <div className="confirm-panel" onClick={(e) => e.stopPropagation()}>

        <div className="confirm-icon">
          <Trash2 size={28} />
        </div>

        <h3>¿Eliminar este caso?</h3>
        <p>Esta acción no se puede deshacer.</p>

        <div className="confirm-actions">
          <button className="ghost-button" onClick={onCancel}>
            Cancelar
          </button>
          <button className="danger-button" onClick={onConfirm}>
            Sí, eliminar
          </button>
        </div>

      </div>
    </div>
  );
}
