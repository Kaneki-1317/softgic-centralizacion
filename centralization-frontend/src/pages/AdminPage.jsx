import { useState } from "react";
import { SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AdminNavbar from "../components/Navbar/AdminNavbar";
import FilterPanel from "../components/Filters/FilterPanel";
import CaseCard from "../components/Cases/CaseCard";
import CaseDetailModal from "../components/Cases/CaseDetailModal";
import CaseFormModal from "../components/Admin/CaseFormModal";
import NewCaseWizard from "../components/Admin/NewCaseWizard";
import CaseSkeletons from "../components/Cases/CaseSkeletons";
import ConfirmModal from "../components/Shared/ConfirmModal";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useCaseFeed } from "../hooks/useCaseFeed";
import api from "../services/api";

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

  const {
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
  } = useCaseFeed();

  async function saveCase(data) {
    const isEditing = !!editingCase;
    try {
      if (isEditing) {
        await api.put(`/casos/${editingCase.id}`, data);
        showToast("Caso actualizado correctamente", "success");
      } else {
        await api.post("/casos", data);
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
      await api.delete(`/casos/${confirmId}`);
      showToast("Caso eliminado correctamente", "success");
      reload();
    } catch (error) {
      console.error(error);
      showToast("Error al eliminar el caso", "error");
    } finally {
      setConfirmId(null);
    }
  }

  function handleLogout() {
    showToast("Sesión cerrada correctamente", "success");
    logout();
    navigate("/login");
  }


  return (
    <>
      <AdminNavbar />

      <main className="public-layout">

        {/* Barra admin: acciones rápidas */}
        <div className="admin-toolbar">
          <span className="admin-toolbar-label">Panel Administrativo</span>
          <div className="admin-toolbar-actions">
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
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por palabras clave..."
              aria-label="Buscar por palabras clave"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearchSubmit(); }}
            />
            <button className="search-btn" onClick={handleSearchSubmit}>
              Busca
            </button>
          </div>
        </div>

        {/* Drawer de filtros */}
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

        {/* Grilla de casos */}
        <section className="case-feed">
          {loading && <CaseSkeletons />}

          {!loading && cases.length === 0 && (
            <div className="empty-state">
              <SearchX size={52} strokeWidth={1.3} />
              <h3>Sin resultados</h3>
              <p>No encontramos casos que coincidan con tu búsqueda o filtros aplicados.</p>
              <button className="ghost-button" onClick={handleClear}>Limpiar búsqueda</button>
            </div>
          )}

          {!loading && cases.length > 0 && (
            <>
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

      <ConfirmModal
        open={confirmId !== null}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmId(null)}
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
