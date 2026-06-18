export default function CaseDetailModal({
  item,
  onClose,
}) {
  if (!item) return null;

  return (
    <div className="modal-layer">
      <div className="case-detail">

        <button
          className="icon-button"
          onClick={onClose}
        >
          Cerrar
        </button>

        <h2>{item.titulo}</h2>

        <p>{item.descripcion}</p>

        <h3>Tecnologías</h3>

        <ul>
          {item.tecnologias?.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>

        <h3>Categorías</h3>

        <ul>
          {item.categorias?.map((cat) => (
            <li key={cat}>{cat}</li>
          ))}
        </ul>

      </div>
    </div>
  );
}