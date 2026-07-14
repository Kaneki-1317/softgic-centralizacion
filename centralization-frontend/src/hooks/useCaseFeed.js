import { useEffect, useState } from "react";
import { fetchCases } from "../services/casesApi";
import { fetchTiposCasos, fetchTecnologias, fetchCategorias, fetchLaboratorios } from "../services/catalogApi";
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
  // Mismo valor que ya se usaba hardcodeado — PublicPage no pasa este
  // parámetro, así que su comportamiento no cambia. AdminPage sí lo usa
  // para ofrecer un selector de tamaño de página (tope real: 100, el
  // backend rechaza tamaños mayores).
  initialPageSize = 10,
} = {}) {
  const { showToast } = useToast();

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  // null = sin error · "network" = no llegó respuesta (sin internet o
  // servidor inalcanzable) · "server" = el backend respondió con error (5xx).
  const [feedError, setFeedError] = useState(null);
  const [pageSize, setPageSize] = useState(initialPageSize);

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

  async function loadCases(page, search, activeFilters, size = pageSize) {
    try {
      setLoading(true);
      setFeedError(null);
      const params = { page, size };
      if (search) params.search = search;
      if (activeFilters?.tipo)        params.tipo        = activeFilters.tipo;
      if (activeFilters?.tecnologia)  params.tecnologia  = activeFilters.tecnologia;
      if (activeFilters?.categoria)   params.categoria   = activeFilters.categoria;
      if (activeFilters?.laboratorio) params.laboratorio = activeFilters.laboratorio;

      const data = await fetchCases(params);
      setCases(data.content);
      setPagination({
        paginaActual:   data.paginaActual,
        totalPaginas:   data.totalPaginas,
        totalElementos: data.totalElementos,
      });
    } catch (error) {
      console.error(error);
      // Con respuesta del servidor (aunque sea de error) lo tratamos como
      // "backend con error"; sin respuesta, como falla de red/conexión —
      // es la distinción más precisa que se puede hacer desde el navegador.
      setFeedError(error.response ? "server" : "network");
      setCases([]);
      showToast(loadCasesErrorMessage, "error");
    } finally {
      setLoading(false);
    }
  }

  async function loadMetadata() {
    try {
      const [tipos, tecs, cats, labs] = await Promise.all([
        fetchTiposCasos(),
        fetchTecnologias(),
        fetchCategorias(),
        fetchLaboratorios(),
      ]);
      setMetadata({
        tipos:        tipos.map((t) => ({ id: t.id, label: t.nombreTipo })),
        tecnologias:  tecs.map((t)  => ({ id: t.id, label: t.nombreTecnologia })),
        categorias:   cats.map((c)  => ({ id: c.id, label: c.nombreCategoria })),
        laboratorios: labs.map((l)  => ({ id: l.id, label: l.nombreLaboratorio })),
        tiposCasos:   tipos,
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

  // Cambiar el tamaño de página vuelve a la página 0 — la página actual bajo
  // el tamaño anterior puede no existir bajo el nuevo (ej. página 8 de a 10
  // no tiene sentido de a 100).
  function handlePageSizeChange(newSize) {
    setPageSize(newSize);
    loadCases(0, submittedSearch, filters, newSize);
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
    feedError,
    metadata,
    setMetadata,
    pagination,
    pageSize,
    searchInput,
    setSearchInput,
    submittedSearch,
    filters,
    activeFilterCount,
    handleSearchSubmit,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    handleClear,
    reload,
  };
}
