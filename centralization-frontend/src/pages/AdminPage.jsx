import { useEffect, useState } from "react";
import { SearchX, WifiOff, ServerCrash, LayoutGrid, Table2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AdminNavbar from "../components/Navbar/AdminNavbar";
import FilterPanel from "../components/Filters/FilterPanel";
import CaseCard from "../components/Cases/CaseCard";
import CaseDetailModal from "../components/Cases/CaseDetailModal";
import CaseFormModal from "../components/Admin/CaseFormModal";
import NewCaseWizard from "../components/Admin/NewCaseWizard";
import CasesTable from "../components/Admin/CasesTable";
import AdminPagination from "../components/Admin/AdminPagination";
import BulkActionsBar from "../components/Admin/BulkActionsBar";
import ActiveFilterChips from "../components/Admin/ActiveFilterChips";
import CaseSkeletons from "../components/Cases/CaseSkeletons";
import ConfirmModal from "../components/Shared/ConfirmModal";
import ResultsCounter from "../components/Shared/ResultsCounter";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useCaseFeed } from "../hooks/useCaseFeed";
import { createCase, updateCase, deleteCase as deleteCaseRequest } from "../services/casesApi";

const VIEW_MODE_STORAGE_KEY = "softgic-admin-view-mode";
const SEARCH_DEBOUNCE_MS = 450;

export default function AdminPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showToast } = useToast();

  const [selectedCase, setSelectedCase] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [prefillData, setPrefillData] = useState(null);

  // Vista tipo tabla vs. grilla de tarjetas — preferencia recordada entre
  // sesiones. Por defecto "grid" para no cambiar la experiencia actual de
  // quien no elige explícitamente la tabla.
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem(VIEW_MODE_STORAGE_KEY) || "grid";
    } catch {
      return "grid";
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(VIEW_MODE_STORAGE_KEY, viewMode);
    } catch {
      // localStorage no disponible (modo privado, cuota) — la preferencia
      // simplemente no persiste entre sesiones, no es crítico.
    }
  }, [viewMode]);

  // Selección de filas para acciones masivas — solo tiene sentido en la
  // vista tabla.
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const {
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
  } = useCaseFeed();

  // Búsqueda avanzada: además del botón "Busca"/Enter (que siguen
  // funcionando igual), busca automáticamente tras una pausa al escribir.
  useEffect(() => {
    if (searchInput === submittedSearch) return;
    const timer = setTimeout(() => {
      handleSearchSubmit();
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // La selección de filas queda ligada a los casos visibles en este momento
  // — al cambiar de página, filtro, tamaño de página o recargar, se limpia
  // en vez de arrastrar ids que ya no están en pantalla. Ajuste de estado
  // durante el render (no en un efecto): mismo patrón que AdminPagination.
  const [syncedCases, setSyncedCases] = useState(cases);
  if (cases !== syncedCases) {
    setSyncedCases(cases);
    if (selectedIds.size > 0) setSelectedIds(new Set());
  }

  async function saveCase(data) {
    const isEditing = !!editingCase;
    try {
      if (isEditing) {
        await updateCase(editingCase.id, data);
        showToast("Caso actualizado correctamente", "success");
      } else {
        await createCase(data);
        showToast("Caso creado correctamente", "success");
      }
      setOpenModal(false);
      setEditingCase(null);
      setPrefillData(null);
      reload();
    } catch (error) {
      console.error(error);
      showToast(isEditing ? "Error al actualizar" : "Error al crear", "error");
    }
  }

  function handleChooseManual() {
    setWizardOpen(false);
    setEditingCase(null);
    setOpenModal(true);
  }

  function handleWizardComplete(data) {
    setWizardOpen(false);
    setPrefillData(data);
    setEditingCase(null);
    setOpenModal(true);
  }

  function handleWizardClose() {
    setWizardOpen(false);
  }

  function handleMetadataCreated(type, newItem) {
    setMetadata((prev) => {
      const key = type === "tecnologia" ? "tecnologias" : type === "categoria" ? "categorias" : "laboratorios";
      return { ...prev, [key]: [...prev[key], newItem] };
    });
  }

  function handleMetadataDeleted(type, deletedId) {
    setMetadata((prev) => {
      const key = type === "tecnologia" ? "tecnologias" : type === "categoria" ? "categorias" : "laboratorios";
      return { ...prev, [key]: prev[key].filter((item) => item.id !== deletedId) };
    });
  }

  async function deleteCase(id) {
    setConfirmId(id);
  }

  async function confirmDelete() {
    try {
      await deleteCaseRequest(confirmId);
      showToast("Caso eliminado correctamente", "success");
      reload();
    } catch (error) {
      console.error(error);
      showToast("Error al eliminar el caso", "error");
    } finally {
      setConfirmId(null);
    }
  }

  function toggleSelectCase(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleSelectAllOnPage() {
    setSelectedIds((prev) => {
      const allSelected = cases.length > 0 && cases.every((c) => prev.has(c.id));
      const next = new Set(prev);
      if (allSelected) {
        cases.forEach((c) => next.delete(c.id));
      } else {
        cases.forEach((c) => next.add(c.id));
      }
      return next;
    });
  }

  // Sin endpoint de borrado masivo en el backend (solo DELETE /casos/{id}):
  // una petición por caso seleccionado, en paralelo, con un resumen al final.
  async function handleBulkDeleteConfirm() {
    const ids = Array.from(selectedIds);
    setBulkDeleting(true);
    try {
      const results = await Promise.allSettled(ids.map((id) => deleteCaseRequest(id)));
      const failed = results.filter((r) => r.status === "rejected").length;
      const succeeded = ids.length - failed;

      if (succeeded > 0 && failed === 0) {
        showToast(`${succeeded} caso${succeeded !== 1 ? "s" : ""} eliminado${succeeded !== 1 ? "s" : ""} correctamente`, "success");
      } else if (succeeded > 0 && failed > 0) {
        showToast(`${succeeded} eliminado${succeeded !== 1 ? "s" : ""}, ${failed} con error`, "error");
      } else {
        showToast("No se pudo eliminar los casos seleccionados", "error");
      }

      setSelectedIds(new Set());
      reload();
    } finally {
      setBulkDeleting(false);
      setBulkConfirmOpen(false);
    }
  }

  function handleRemoveFilter(key) {
    handleFilterChange({ ...filters, [key]: "" });
  }

  function handleLogout() {
    showToast("Sesión cerrada correctamente", "success");
    logout();
    navigate("/softgic-access-portal/login");
  }


  return (
    <>
      <AdminNavbar />

      <main className="public-layout">

        {/* Barra admin: acciones rápidas */}
        <div className="admin-toolbar">
          <span className="admin-toolbar-label">Panel Administrativo</span>
          <div className="admin-toolbar-actions">
            <div className="view-mode-toggle" role="group" aria-label="Tipo de vista">
              <button
                type="button"
                className={`view-mode-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                aria-pressed={viewMode === "grid"}
                aria-label="Vista de tarjetas"
                title="Vista de tarjetas"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                type="button"
                className={`view-mode-btn ${viewMode === "table" ? "active" : ""}`}
                onClick={() => setViewMode("table")}
                aria-pressed={viewMode === "table"}
                aria-label="Vista de tabla"
                title="Vista de tabla"
              >
                <Table2 size={15} />
              </button>
            </div>
            <button
              className="primary-button"
              onClick={() => setWizardOpen(true)}
            >
              + Nuevo Caso
            </button>
            <button className="ghost-button" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Barra búsqueda + filtrar */}
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
            <div className="search-input-wrap">
              <input
                type="text"
                className="search-input"
                placeholder="Buscar por palabras clave..."
                aria-label="Buscar por palabras clave"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSearchSubmit(); }}
              />
              {searchInput && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchInput("")}
                  aria-label="Limpiar texto de búsqueda"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button className="search-btn" onClick={handleSearchSubmit}>
              Busca
            </button>
          </div>
        </div>

        <ActiveFilterChips filters={filters} onRemove={handleRemoveFilter} />

        {/* Drawer de filtros */}
        <FilterPanel
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          filters={filters}
          metadata={metadata}
          onChange={handleFilterChange}
          onClear={handleClear}
        />

        {!loading && <ResultsCounter total={pagination.totalElementos} />}

        {/* Grilla / tabla de casos */}
        <section className="case-feed">
          {loading && <CaseSkeletons variant={viewMode} />}

          {!loading && cases.length === 0 && feedError === "network" && (
            <div className="empty-state">
              <WifiOff size={52} strokeWidth={1.3} />
              <h3>Sin conexión</h3>
              <p>No pudimos conectarnos con el servidor. Verifica tu conexión a internet e intenta de nuevo.</p>
              <button className="ghost-button" onClick={reload}>Reintentar</button>
            </div>
          )}

          {!loading && cases.length === 0 && feedError === "server" && (
            <div className="empty-state">
              <ServerCrash size={52} strokeWidth={1.3} />
              <h3>El servidor no está disponible</h3>
              <p>Ocurrió un problema en el servidor y no pudimos cargar los casos. Intenta de nuevo en unos minutos.</p>
              <button className="ghost-button" onClick={reload}>Reintentar</button>
            </div>
          )}

          {!loading && cases.length === 0 && !feedError && (
            <div className="empty-state">
              <SearchX size={52} strokeWidth={1.3} />
              <h3>Sin resultados</h3>
              <p>No encontramos casos que coincidan con tu búsqueda o filtros aplicados.</p>
              <button className="ghost-button" onClick={handleClear}>Limpiar búsqueda</button>
            </div>
          )}

          {!loading && cases.length > 0 && (
            <>
              {viewMode === "table" ? (
                <>
                  <BulkActionsBar
                    count={selectedIds.size}
                    onClear={() => setSelectedIds(new Set())}
                    onDeleteSelected={() => setBulkConfirmOpen(true)}
                  />
                  <CasesTable
                    cases={cases}
                    onOpen={(item) => setSelectedCase(item)}
                    onEdit={(item) => { setEditingCase(item); setOpenModal(true); }}
                    onDelete={deleteCase}
                    selectedIds={selectedIds}
                    onToggleSelect={toggleSelectCase}
                    onToggleSelectAll={toggleSelectAllOnPage}
                  />
                </>
              ) : (
                <div className="case-grid">
                  {cases.map((item) => (
                    <CaseCard
                      key={item.id}
                      item={item}
                      onOpen={() => setSelectedCase(item)}
                      onEdit={(item) => { setEditingCase(item); setOpenModal(true); }}
                      onDelete={deleteCase}
                    />
                  ))}
                </div>
              )}

              <AdminPagination
                paginaActual={pagination.paginaActual}
                totalPaginas={pagination.totalPaginas}
                totalElementos={pagination.totalElementos}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </>
          )}
        </section>

      </main>

      <ConfirmModal
        open={confirmId !== null}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmId(null)}
      />

      <ConfirmModal
        open={bulkConfirmOpen}
        title={`¿Eliminar ${selectedIds.size} caso${selectedIds.size !== 1 ? "s" : ""} seleccionado${selectedIds.size !== 1 ? "s" : ""}?`}
        message="Esta acción no se puede deshacer."
        onConfirm={handleBulkDeleteConfirm}
        onCancel={() => !bulkDeleting && setBulkConfirmOpen(false)}
      />

      <CaseDetailModal
        item={selectedCase}
        onClose={() => setSelectedCase(null)}
      />

      {wizardOpen && (
        <NewCaseWizard
          onClose={handleWizardClose}
          onChooseManual={handleChooseManual}
          onComplete={handleWizardComplete}
        />
      )}

      <CaseFormModal
        open={openModal}
        initialData={editingCase}
        prefillData={prefillData}
        onClose={() => { setOpenModal(false); setEditingCase(null); setPrefillData(null); }}
        onSave={saveCase}
        tiposCasos={metadata.tiposCasos}
        tecnologias={metadata.tecnologias}
        categorias={metadata.categorias}
        laboratorios={metadata.laboratorios}
        onMetadataCreated={handleMetadataCreated}
        onMetadataDeleted={handleMetadataDeleted}
      />
    </>
  );
}
