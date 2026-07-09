import { useEffect, useState } from "react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";

const EMPTY_FILTERS = { tipo: "", tecnologia: "", categoria: "", laboratorio: "" };

/**
 * Lógica de datos compartida entre PublicPage y AdminPage: carga paginada de
 * casos, metadata de catálogos, búsqueda, filtros y paginación. Las páginas
 * solo renderizan UI y llaman a lo que este hook expone — nada de fetch ni
 * de estado de datos vive en los componentes de página.
 *
 * Los mensajes de error son parametrizables porque las dos páginas ya usaban
 * textos ligeramente distintos antes de esta extracción ("Error al cargar
 * los datos" en la pública vs. "Error al cargar los casos"/"la metadata" en
 * admin) — se preservan tal cual, no se unifican.
 */
export function useCaseFeed({
  loadCasesErrorMessage = "Error al cargar los casos",
  loadMetadataErrorMessage = "Error al cargar la metadata",
} = {}) {
  const { showToast } = useToast();

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const [metadata, setMetadata] = useState({
    tipos: [], tecnologias: [], categorias: [], laboratorios: [], tiposCasos: [],
  });

  const [pagination, setPagination] = useState({
    paginaActual: 0, totalPaginas: 0, totalElementos: 0,
  });

  const [searchInput, setSearchInput] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  useEffect(() => {
    loadCases(0, "", EMPTY_FILTERS);
    loadMetadata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadCases(page, search, activeFilters) {
    try {
      setLoading(true);
      const params = { page, size: 10 };
      if (search) params.search = search;
      if (activeFilters?.tipo)        params.tipo        = activeFilters.tipo;
      if (activeFilters?.tecnologia)  params.tecnologia  = activeFilters.tecnologia;
      if (activeFilters?.categoria)   params.categoria   = activeFilters.categoria;
      if (activeFilters?.laboratorio) params.laboratorio = activeFilters.laboratorio;

      const response = await api.get("/casos", { params });
      setCases(response.data.content);
      setPagination({
        paginaActual:   response.data.paginaActual,
        totalPaginas:   response.data.totalPaginas,
        totalElementos: response.data.totalElementos,
      });
    } catch (error) {
      console.error(error);
      showToast(loadCasesErrorMessage, "error");
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
        tiposCasos:   tipos.data,
      });
    } catch (error) {
      console.error(error);
      showToast(loadMetadataErrorMessage, "error");
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
    setSearchInput("");
    setSubmittedSearch("");
    setFilters(EMPTY_FILTERS);
    loadCases(0, "", EMPTY_FILTERS);
  }

  // Re-consulta la página/búsqueda/filtros actuales — para usar después de
  // crear, editar o eliminar un caso, sin reiniciar la posición del usuario.
  function reload() {
    loadCases(pagination.paginaActual, submittedSearch, filters);
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return {
    cases,
    loading,
    metadata,
    setMetadata,
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
  };
}
