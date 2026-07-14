import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";

export default function ConfirmModal({
  open,
  onConfirm,
  onCancel,
  title = "¿Eliminar este caso?",
  message = "Esta acción no se puede deshacer.",
}) {
  const cancelButtonRef = useRef(null);
  const previouslyFocusedRef = useRef(null);
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    if (deleting) return;
    setDeleting(true);
    try {
      await onConfirm();
    } finally {
      setDeleting(false);
    }
  }

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e) {
      if (e.key === "Escape") onCancel();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  // Al abrir, foco en "Cancelar" (opción no destructiva por defecto) y se
  // recuerda qué elemento lo abrió; al cerrar, el foco vuelve ahí.
  useEffect(() => {
    if (!open) return;

    previouslyFocusedRef.current = document.activeElement;
    cancelButtonRef.current?.focus();

    return () => {
      previouslyFocusedRef.current?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-overlay confirm-overlay" onClick={onCancel}>
      <div
        className="confirm-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >

        <div className="confirm-icon">
          <Trash2 size={28} />
        </div>

        <h3 id="confirm-modal-title">{title}</h3>
        <p>{message}</p>

        <div className="confirm-actions">
          <button className="ghost-button" onClick={onCancel} ref={cancelButtonRef}>
            Cancelar
          </button>
          <button className="danger-button" onClick={handleConfirm} disabled={deleting}>
            {deleting ? "Eliminando..." : "Sí, eliminar"}
          </button>
        </div>

      </div>
    </div>
  );
}
