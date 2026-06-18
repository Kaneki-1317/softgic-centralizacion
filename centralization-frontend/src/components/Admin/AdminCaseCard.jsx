import {
  Pencil,
  Trash2,
} from "lucide-react";

export default function AdminCaseCard({
  item,
  onEdit,
  onDelete,
}) {
  return (
    <article className="admin-case-card">

      <div className="admin-card-header">

        <h3>{item.titulo}</h3>

        <div className="card-actions">

          <button
            className="icon-button"
            onClick={() => onEdit(item)}
          >
            <Pencil size={16} />
          </button>

          <button
            className="icon-button danger"
            onClick={() =>
              onDelete(item.id)
            }
          >
            <Trash2 size={16} />
          </button>

        </div>

      </div>

      <p>{item.descripcion}</p>

      <span className="type-pill">
        {item.tipoCaso}
      </span>

    </article>
  );
}