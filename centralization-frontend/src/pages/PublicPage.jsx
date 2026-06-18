import { useEffect, useMemo, useState } from "react";

import PublicNavbar from "../components/Navbar/PublicNavbar";
import FilterPanel from "../components/Filters/FilterPanel";
import CaseCard from "../components/Cases/CaseCard";
import CaseDetailModal from "../components/Cases/CaseDetailModal";
import CaseSkeletons from "../components/Cases/CaseSkeletons";

import { useToast } from "../context/ToastContext";
import api from "../services/api";

export default function PublicPage() {
  const { showToast } = useToast();

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);

  const [metadata, setMetadata] = useState({
    tipos: [],
    tecnologias: [],
    categorias: [],
    laboratorios: [],
  });

  const [pagination, setPagination] = useState({
    paginaActual: 0,
    totalPaginas: 0,
    totalElementos: 0,
  });

  // Texto actualmente en el input (controlado)
  const [searchInput, setSearchInput] = useState("");
  // Último texto enviado al backend (para mantenerlo al cambiar de página)
  const [submittedSearch, setSubmittedSearch] = useState("");

  const [filters, setFilters] = useState({
    tipo: "",
    tecnologia: "",
    categoria: "",
    laboratorio: "",
  });

  useEffect(() => {
    loadCases(0, "");
    loadMetadata();
  }, []);

  async function loadCases(page, search) {
    try {
      setLoading(true);
      const response = await api.get("/casos", {
        params: { page, size: 10, search },
      });
      setCases(response.data.content);
      setPagination({
        paginaActual: response.data.paginaActual,
        totalPaginas: response.data.totalPaginas,
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
    loadCases(0, searchInput);
  }

  function handlePageChange(newPage) {
    loadCases(newPage, submittedSearch);
  }

  function handleClear() {
    setSearchInput("");
    setSubmittedSearch("");
    setFilters({ tipo: "", tecnologia: "", categoria: "", laboratorio: "" });
    loadCases(0, "");
  }

  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      const matchesTipo =
        !filters.tipo || item.tipoCaso === filters.tipo;

      const matchesTecnologia =
        !filters.tecnologia || item.tecnologias?.includes(filters.tecnologia);

      const matchesCategoria =
        !filters.categoria || item.categorias?.includes(filters.categoria);

      const matchesLaboratorio =
        !filters.laboratorio || item.laboratorios?.includes(filters.laboratorio);

      return matchesTipo && matchesTecnologia && matchesCategoria && matchesLaboratorio;
    });
  }, [cases, filters]);

  return (
    <>
      <PublicNavbar />

      <main className="public-layout">

        <aside>
          <FilterPanel
            search={searchInput}
            onSearchChange={setSearchInput}
            onSearchSubmit={handleSearchSubmit}
            filters={filters}
            metadata={metadata}
            onChange={setFilters}
            onClear={handleClear}
          />
        </aside>

        <section className="case-feed">

          {loading && <CaseSkeletons />}

          {!loading && (
            <>
              <div className="case-grid">
                {filteredCases.map((item) => (
                  <CaseCard
                    key={item.id}
                    item={item}
                    onOpen={() => setSelectedCase(item)}
                  />
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

      <CaseDetailModal
        item={selectedCase}
        onClose={() => setSelectedCase(null)}
      />
    </>
  );
}
