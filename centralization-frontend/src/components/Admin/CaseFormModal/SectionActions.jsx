import { Plus, Trash2 } from "lucide-react";

export default function SectionActions({ type, createLabel, isDeleteMode, onQuickCreate, onToggleDeleteMode }) {
  return (
    <div className="section-label-actions">
      <button type="button" className="quick-create-btn" onClick={() => onQuickCreate(type)}>
        <Plus size={12} /> {createLabel}
      </button>
      <button
        type="button"
        className={`delete-mode-btn ${isDeleteMode ? "active" : ""}`}
        onClick={() => onToggleDeleteMode(type)}
        aria-pressed={isDeleteMode}
      >
        <Trash2 size={12} /> Eliminar
      </button>
    </div>
  );
}
