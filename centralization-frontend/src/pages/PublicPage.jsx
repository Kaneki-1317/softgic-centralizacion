import { useEffect, useState } from "react";
import { SearchX } from "lucide-react";

import PublicNavbar from "../components/Navbar/PublicNavbar";
import FilterPanel from "../components/Filters/FilterPanel";
import CaseCard from "../components/Cases/CaseCard";
import CaseDetailModal from "../components/Cases/CaseDetailModal";
import CaseSkeletons from "../components/Cases/CaseSkeletons";
import Footer from "../components/Shared/Footer";

import { useToast } from "../context/ToastContext";
import api from "../services/api";

export default function PublicPage() {
  const { showToast } = useToast();

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [metadata, setMetadata] = useState({
    tipos: [], tecnologias: [], categorias: [], laboratorios: [],
  });

  const [pagination, setPagination] = useState({
    paginaActual: 0, totalPaginas: 0, totalElementos: 0,
  });

  const [searchInput, setSearchInput] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");

  const [filters, setFilters] = useState({
    tipo: "", tecnologia: "", categoria: "", laboratorio: "",
  });

  useEffect(() => {
    loadCases(0, "", { tipo: "", tecnologia: "", categoria: "", laboratorio: "" });
    loadMetadata();
  }, []);

  async function loadCases(page, search, activeFilters) {
    try {
      setLoading(true);
      const params = { page, size: 10 };
      if (search) params.search = search;
      if (activeFilters.tipo)        params.tipo        = activeFilters.tipo;
      if (activeFilters.tecnologia)  params.tecnologia  = activeFilters.tecnologia;
      if (activeFilters.categoria)   params.categoria   = activeFilters.categoria;
      if (activeFilters.laboratorio) params.laboratorio = activeFilters.laboratorio;

      const response = await api.get("/casos", { params });
      setCases(response.data.content);
      setPagination({
        paginaActual:   response.data.paginaActual,
        totalPaginas:   response.data.totalPaginas,
        totalElementos: response.data.totalElementos,
      });
    } catch (error) {
      console.error(error);
      showToast("Error al cargar los datos", "error");
    } finally {
      setLoading(false);
    }
  }

  async function loadMetadata() {
    try {
      const [tipos, tecs, cats, labs] = await Promise.all([
        api.get("/tipos-casos"),
        api.get("/tecnologias"),
        api.get("/categorias"),
        api.get("/laboratorios"),
      ]);
      setMetadata({
        tipos:        tipos.data.map((t) => ({ id: t.id, label: t.nombreTipo })),
        tecnologias:  tecs.data.map((t)  => ({ id: t.id, label: t.nombreTecnologia })),
        categorias:   cats.data.map((c)  => ({ id: c.id, label: c.nombreCategoria })),
        laboratorios: labs.data.map((l)  => ({ id: l.id, label: l.nombreLaboratorio })),
      });
    } catch (error) {
      console.error(error);
      showToast("Error al cargar los datos", "error");
    }
  }

  function handleSearchSubmit() {
    setSubmittedSearch(searchInput);
    loadCases(0, searchInput, filters);
  }

  function handleFilterChange(newFilters) {
    setFilters(newFilters);
    loadCases(0, submittedSearch, newFilters);
  }

  function handlePageChange(newPage) {
    loadCases(newPage, submittedSearch, filters);
  }

  function handleClear() {
    const empty = { tipo: "", tecnologia: "", categoria: "", laboratorio: "" };
    setSearchInput("");
    setSubmittedSearch("");
    setFilters(empty);
    loadCases(0, "", empty);
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <>
      <PublicNavbar />

      <main className="public-layout" id="casos">

        <div className="search-topbar">
          <button className="filter-toggle" onClick={() => setDrawerOpen(true)}>
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

          {!loading && cases.length === 0 && (
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
