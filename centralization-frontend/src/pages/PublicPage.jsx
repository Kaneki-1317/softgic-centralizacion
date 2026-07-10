import { useState } from "react";
import { SearchX, WifiOff, ServerCrash } from "lucide-react";

import PublicNavbar from "../components/Navbar/PublicNavbar";
import FilterPanel from "../components/Filters/FilterPanel";
import CaseCard from "../components/Cases/CaseCard";
import CaseDetailModal from "../components/Cases/CaseDetailModal";
import CaseSkeletons from "../components/Cases/CaseSkeletons";
import Footer from "../components/Shared/Footer";

import { useCaseFeed } from "../hooks/useCaseFeed";

export default function PublicPage() {
  const [selectedCase, setSelectedCase] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    cases,
    loading,
    feedError,
    metadata,
    pagination,
    searchInput,
    setSearchInput,
    filters,
    activeFilterCount,
    handleSearchSubmit,
    handleFilterChange,
    handlePageChange,
    handleClear,
    reload,
  } = useCaseFeed({
    loadCasesErrorMessage: "Error al cargar los datos",
    loadMetadataErrorMessage: "Error al cargar los datos",
  });

  return (
    <>
      <PublicNavbar />

      <main className="public-layout" id="casos">

        <div className="search-topbar">
          <button
            className="filter-toggle"
            onClick={() => setDrawerOpen(true)}
            aria-expanded={drawerOpen}
            aria-controls="filter-drawer"
          >
            <span className="hamburger-icon">&#9776;</span> Filtrar
            {activeFilterCount > 0 && (
              <span className="filter-badge">{activeFilterCount}</span>
            )}
          </button>
          <div className="search-right">
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por palabras clave..."
              aria-label="Buscar por palabras clave"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearchSubmit(); }}
            />
            <button className="search-btn" onClick={handleSearchSubmit}>Buscar</button>
          </div>
        </div>

        <FilterPanel
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          filters={filters}
          metadata={metadata}
          onChange={handleFilterChange}
          onClear={handleClear}
        />

        {!loading && (
          <p className="results-counter">
            {pagination.totalElementos} caso{pagination.totalElementos !== 1 ? "s" : ""} encontrado{pagination.totalElementos !== 1 ? "s" : ""}
          </p>
        )}

        <section className="case-feed">
          {loading && <CaseSkeletons />}

          {!loading && cases.length === 0 && feedError === "network" && (
            <div className="empty-state">
              <WifiOff size={52} strokeWidth={1.3} />
              <h3>Sin conexión</h3>
              <p>No pudimos conectarnos con el servidor. Verifica tu conexión a internet e intenta de nuevo.</p>
              <button className="ghost-button" onClick={reload}>
                Reintentar
              </button>
            </div>
          )}

          {!loading && cases.length === 0 && feedError === "server" && (
            <div className="empty-state">
              <ServerCrash size={52} strokeWidth={1.3} />
              <h3>El servidor no está disponible</h3>
              <p>Ocurrió un problema en el servidor y no pudimos cargar los casos. Intenta de nuevo en unos minutos.</p>
              <button className="ghost-button" onClick={reload}>
                Reintentar
              </button>
            </div>
          )}

          {!loading && cases.length === 0 && !feedError && (
            <div className="empty-state">
              <SearchX size={52} strokeWidth={1.3} />
              <h3>Sin resultados</h3>
              <p>No encontramos casos que coincidan con tu búsqueda o filtros aplicados.</p>
              <button className="ghost-button" onClick={handleClear}>
                Limpiar búsqueda
              </button>
            </div>
          )}

          {!loading && cases.length > 0 && (
            <>
              <div className="case-grid">
                {cases.map((item) => (
                  <CaseCard key={item.id} item={item} onOpen={() => setSelectedCase(item)} />
                ))}
              </div>

              {pagination.totalPaginas > 1 && (
                <div className="pagination">
                  <button
                    className="ghost-button"
                    onClick={() => handlePageChange(pagination.paginaActual - 1)}
                    disabled={pagination.paginaActual === 0}
                  >
                    Anterior
                  </button>
                  <span className="pagination-info">
                    Página {pagination.paginaActual + 1} de {pagination.totalPaginas}
                  </span>
                  <button
                    className="ghost-button"
                    onClick={() => handlePageChange(pagination.paginaActual + 1)}
                    disabled={pagination.paginaActual >= pagination.totalPaginas - 1}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </section>

      </main>

      <Footer />

      <CaseDetailModal item={selectedCase} onClose={() => setSelectedCase(null)} />
    </>
  );
}
