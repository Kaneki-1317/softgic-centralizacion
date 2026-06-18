import { CalendarDays } from "lucide-react";

export default function CaseCard({ item, onOpen }) {
  return (
    <article className="case-card">
      <div className="card-topline">
        <span className="type-pill">
          {item.tipoCaso}
        </span>

        <span className="muted-date">
          <CalendarDays size={14} />
          {item.fechaCreacion}
        </span>
      </div>

      <h2>{item.titulo}</h2>

      <p>{item.descripcion}</p>

      <button
        className="primary-button"
        onClick={onOpen}
      >
        Ver Caso
      </button>
    </article>
  );
}