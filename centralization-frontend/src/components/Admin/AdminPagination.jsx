import { useState } from "react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

/**
 * Paginación del panel admin: agrega selector de tamaño de página, salto
 * directo a página y primera/última — más capaz que components/Shared/
 * Pagination.jsx (que se deja intacto, sigue usándolo PublicPage tal cual).
 * El tope de 100 coincide con el máximo que el backend acepta
 * (@Max(100) en CasoController).
 */
export default function AdminPagination({
  paginaActual,
  totalPaginas,
  totalElementos,
  pageSize,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  onPageChange,
  onPageSizeChange,
}) {
  const [pageInput, setPageInput] = useState(String(paginaActual + 1));
  // Ajuste de estado durante el render (no en un efecto) cuando la página
  // cambia desde afuera (ej. clic en "Siguiente") — patrón recomendado por
  // React para sincronizar estado con un prop sin el round-trip de un efecto.
  const [syncedPage, setSyncedPage] = useState(paginaActual);
  if (paginaActual !== syncedPage) {
    setSyncedPage(paginaActual);
    setPageInput(String(paginaActual + 1));
  }

  function submitPageJump(e) {
    e.preventDefault();
    const n = Number(pageInput);
    if (!Number.isInteger(n) || n < 1 || n > totalPaginas) {
      setPageInput(String(paginaActual + 1));
      return;
    }
    if (n - 1 !== paginaActual) onPageChange(n - 1);
  }

  return (
    <div className="admin-pagination">
      <label className="admin-page-size">
        Mostrar
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          aria-label="Casos por página"
        >
          {pageSizeOptions.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        por página · {totalElementos} en total
      </label>

      {totalPaginas > 1 && (
        <div className="admin-pagination-controls">
          <button
            type="button"
            className="ghost-button admin-pagination-edge-btn"
            onClick={() => onPageChange(0)}
            disabled={paginaActual === 0}
            aria-label="Primera página"
            title="Primera página"
          >
            <ChevronsLeft size={15} />
          </button>
          <button
            type="button"
            className="ghost-button"
            onClick={() => onPageChange(paginaActual - 1)}
            disabled={paginaActual === 0}
          >
            Anterior
          </button>

          <form className="admin-page-jump" onSubmit={submitPageJump}>
            <span>Página</span>
            <input
              type="number"
              min="1"
              max={totalPaginas}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onBlur={submitPageJump}
              aria-label="Ir a la página"
            />
            <span>de {totalPaginas}</span>
          </form>

          <button
            type="button"
            className="ghost-button"
            onClick={() => onPageChange(paginaActual + 1)}
            disabled={paginaActual >= totalPaginas - 1}
          >
            Siguiente
          </button>
          <button
            type="button"
            className="ghost-button admin-pagination-edge-btn"
            onClick={() => onPageChange(totalPaginas - 1)}
            disabled={paginaActual >= totalPaginas - 1}
            aria-label="Última página"
            title="Última página"
          >
            <ChevronsRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
