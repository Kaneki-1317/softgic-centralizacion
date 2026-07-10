/**
 * Controles Anterior/Página X de Y/Siguiente — antes duplicados casi
 * verbatim en AdminPage.jsx y PublicPage.jsx.
 */
export default function Pagination({ paginaActual, totalPaginas, onPageChange }) {
  if (totalPaginas <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="ghost-button"
        onClick={() => onPageChange(paginaActual - 1)}
        disabled={paginaActual === 0}
      >
        Anterior
      </button>
      <span className="pagination-info">
        Página {paginaActual + 1} de {totalPaginas}
      </span>
      <button
        className="ghost-button"
        onClick={() => onPageChange(paginaActual + 1)}
        disabled={paginaActual >= totalPaginas - 1}
      >
        Siguiente
      </button>
    </div>
  );
}
