function CardSkeleton() {
  return (
    <div className="case-card skeleton-card">
      <div className="skeleton-row">
        <span className="skeleton-block skeleton-pill" />
        <span className="skeleton-block skeleton-pill skeleton-pill-sm" />
      </div>
      <span className="skeleton-block skeleton-title" />
      <span className="skeleton-block skeleton-title skeleton-title-short" />
      <span className="skeleton-block skeleton-text" />
      <span className="skeleton-block skeleton-text" />
      <span className="skeleton-block skeleton-text skeleton-text-short" />
      <div className="skeleton-row skeleton-tags-row">
        <span className="skeleton-block skeleton-tag" />
        <span className="skeleton-block skeleton-tag" />
        <span className="skeleton-block skeleton-tag" />
      </div>
    </div>
  );
}

/**
 * Estados de carga: vista de tarjetas (grid, la que ya existía) y vista de
 * tabla (table, para que el loading coincida con el modo elegido en el
 * panel admin — ver AdminPage). El shimmer es puramente visual (::after en
 * .skeleton-card / .skeleton-table-row, ver index.css); el aria-live/
 * aria-busy es lo que le avisa a un lector de pantalla que hay contenido
 * cargando, que antes no tenía ningún anuncio.
 */
export default function CaseSkeletons({ variant = "grid" }) {
  if (variant === "table") {
    return (
      <div className="cases-table-wrap" aria-busy="true" aria-live="polite">
        <span className="sr-only">Cargando casos…</span>
        <table className="cases-table">
          <tbody>
            {[1, 2, 3, 4, 5].map((row) => (
              <tr key={row} className="skeleton-table-row">
                <td><span className="skeleton-block skeleton-checkbox" /></td>
                <td><span className="skeleton-block skeleton-text" /></td>
                <td><span className="skeleton-block skeleton-text skeleton-text-short" /></td>
                <td><span className="skeleton-block skeleton-text skeleton-text-short" /></td>
                <td><span className="skeleton-block skeleton-text skeleton-text-short" /></td>
                <td><span className="skeleton-block skeleton-text skeleton-text-xs" /></td>
                <td><span className="skeleton-block skeleton-text skeleton-text-xs" /></td>
                <td><span className="skeleton-block skeleton-actions" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="case-grid" aria-busy="true" aria-live="polite">
      <span className="sr-only">Cargando casos…</span>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <CardSkeleton key={item} />
      ))}
    </div>
  );
}
