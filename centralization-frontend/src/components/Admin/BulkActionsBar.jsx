import { Trash2, X } from "lucide-react";

/**
 * Barra de acciones masivas — aparece en la vista tabla cuando hay al menos
 * un caso seleccionado. El backend solo expone DELETE /casos/{id} (sin
 * endpoint de borrado masivo), así que "eliminar seleccionados" hace una
 * petición por caso; ver AdminPage.handleBulkDelete.
 */
export default function BulkActionsBar({ count, onClear, onDeleteSelected }) {
  if (count === 0) return null;

  return (
    <div className="bulk-actions-bar" role="toolbar" aria-label="Acciones masivas">
      <span className="bulk-actions-count">{count} caso{count !== 1 ? "s" : ""} seleccionado{count !== 1 ? "s" : ""}</span>
      <div className="bulk-actions-buttons">
        <button type="button" className="danger-button" onClick={onDeleteSelected}>
          <Trash2 size={14} /> Eliminar seleccionados
        </button>
        <button type="button" className="ghost-button" onClick={onClear}>
          <X size={14} /> Cancelar selección
        </button>
      </div>
    </div>
  );
}
