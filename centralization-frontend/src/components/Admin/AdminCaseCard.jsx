import { Pencil, Trash2, Building2, CalendarCheck } from "lucide-react";

export default function AdminCaseCard({ item, onOpen, onEdit, onDelete }) {
  const tags = [
    ...(item.tecnologias || []),
    ...(item.categorias  || []),
  ].slice(0, 4);

  return (
    <article className="case-card">
      <div className="card-meta-row">
        {item.tipoCaso && (
          <span className="type-pill">{item.tipoCaso}</span>
        )}
        <div className="card-meta-right">
          {item.sector && (
            <span className="card-sector">
              <Building2 size={12} />
              {item.sector}
            </span>
          )}
          {item.anioImplementacion && (
            <span className="card-date">
              <CalendarCheck size={12} />
              {item.anioImplementacion}
            </span>
          )}
        </div>
      </div>

      <div className="card-title-block">
        <h2>{item.titulo}</h2>
        <div className="card-title-accent" />
      </div>

      {item.beneficioPrincipal && (
        <p className="card-benefit">&ldquo;{item.beneficioPrincipal}&rdquo;</p>
      )}

      <p className="card-description">{item.reto}</p>

      {tags.length > 0 && (
        <div className="card-tags">
          {tags.map((tag) => (
            <span key={tag} className="tag-pill">{tag}</span>
          ))}
        </div>
      )}

      <div className="card-actions-row">
        <button className="card-action-btn" onClick={onOpen}>
          Ver caso
        </button>
        <button className="card-edit-btn" onClick={() => onEdit(item)}>
          <Pencil size={14} /> Editar
        </button>
        <button className="card-delete-btn" onClick={() => onDelete(item.id)}>
          <Trash2 size={14} /> Eliminar
        </button>
      </div>
    </article>
  );
}
