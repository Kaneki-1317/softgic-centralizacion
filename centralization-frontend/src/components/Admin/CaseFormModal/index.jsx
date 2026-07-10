import { useEffect, useRef, useState } from "react";
import { Settings2, LayoutList, FlaskConical, Tag, TrendingUp, Building2 } from "lucide-react";

import { createCatalogItem, deleteCatalogItem } from "../../../services/catalogApi";
import { useToast } from "../../../context/ToastContext";

import CatalogSection from "./CatalogSection";
import QuickCreateModal from "./QuickCreateModal";
import ConfirmDeleteCatalogModal from "./ConfirmDeleteCatalogModal";
import DocumentsSection from "./DocumentsSection";

import { EMPTY_FORM, QUICK_CONFIG, DELETE_ENDPOINTS, LIST_FIELDS } from "./constants";
import { isSafeResourceUrl, buildAiChips, buildFormFromExternalShape } from "./formHelpers";

// Config estática de las 3 secciones de catálogo — definida fuera del
// componente porque no depende de props/estado, solo de qué campo/tipo
// corresponde a cada una. Antes cada sección se escribía completa en línea,
// 3 veces, con la misma estructura.
const CATALOG_SECTIONS = [
  {
    type: "tecnologia",
    icon: <Settings2 size={13} />,
    title: "Tecnologías",
    itemsLabel: "Tecnologías seleccionadas",
    createLabel: "Nueva",
    field: "idsTecnologias",
  },
  {
    type: "categoria",
    icon: <LayoutList size={13} />,
    title: "Área de aplicación",
    itemsLabel: "Áreas seleccionadas",
    createLabel: "Nueva",
    field: "idsCategorias",
  },
  {
    type: "laboratorio",
    icon: <FlaskConical size={13} />,
    title: "Equipo / Unidad",
    itemsLabel: "Equipos seleccionados",
    createLabel: "Nuevo",
    field: "idsLaboratorios",
  },
];

export default function CaseFormModal({
  open,
  initialData,
  prefillData = null,
  onClose,
  onSave,
  tiposCasos = [],
  tecnologias = [],
  categorias = [],
  laboratorios = [],
  onMetadataCreated,
  onMetadataDeleted,
}) {
  const { showToast } = useToast();
  const [form, setForm] = useState(EMPTY_FORM);

  const [localTecs, setLocalTecs] = useState([]);
  const [localCats, setLocalCats] = useState([]);
  const [localLabs, setLocalLabs] = useState([]);

  // Antes redefinido idéntico dentro de cada uno de los 3 handlers que lo
  // usan (crear rápido, crear desde IA, eliminar) — un solo lugar ahora.
  const catalogSetters = { tecnologia: setLocalTecs, categoria: setLocalCats, laboratorio: setLocalLabs };

  const [saving, setSaving] = useState(false);

  const [quickCreate, setQuickCreate] = useState({
    open: false, type: null, name: "", loading: false, error: "",
  });

  const [deleteMode, setDeleteMode] = useState({
    tecnologia: false, categoria: false, laboratorio: false,
  });

  const [confirmDelete, setConfirmDelete] = useState({
    open: false, type: null, item: null, loading: false,
  });

  // Nombres detectados por IA que el usuario está creando en el catálogo
  // desde el chip "+ Crear" (uno por tipo, para no cruzar estados entre
  // Tecnologías/Áreas/Equipos si comparten algún nombre).
  const [creatingAiItems, setCreatingAiItems] = useState({
    tecnologia: new Set(), categoria: new Set(), laboratorio: new Set(),
  });

  const closeButtonRef = useRef(null);
  const previouslyFocusedRef = useRef(null);
  // Compartida entre los 2 sub-modales (crear rápido / confirmar eliminar):
  // nunca están abiertos a la vez, así que un solo ref alcanza para recordar
  // qué elemento abrió el que esté visible en cada momento.
  const subModalTriggerRef = useRef(null);

  // Sync local lists whenever parent updates them
  useEffect(() => { setLocalTecs(tecnologias); }, [tecnologias]);
  useEffect(() => { setLocalCats(categorias);  }, [categorias]);
  useEffect(() => { setLocalLabs(laboratorios); }, [laboratorios]);

  // Populate form when modal opens, edited case changes, or prefill data (from
  // the "Crear desde Documento" flow) arrives. initialData takes precedence
  // over prefillData; when neither is present, falls back to EMPTY_FORM.
  // Intentionally omits tecnologias/categorias/laboratorios from deps to prevent
  // resetting the form while the user is quick-creating inside this modal.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!open) return;

    const source = initialData || prefillData;

    if (!source) {
      setForm(EMPTY_FORM);
      setDeleteMode({ tecnologia: false, categoria: false, laboratorio: false });
      return;
    }

    setForm(buildFormFromExternalShape(source, tiposCasos, tecnologias, categorias, laboratorios));
    setDeleteMode({ tecnologia: false, categoria: false, laboratorio: false });
  }, [open, initialData, prefillData]);

  // Declaradas antes del efecto de Escape (más abajo) que las usa —
  // referenciarlas ahí antes de su declaración funcionaba por hoisting, pero
  // es más claro declararlas primero.
  function closeQuickCreate() {
    setQuickCreate({ open: false, type: null, name: "", loading: false, error: "" });
    subModalTriggerRef.current?.focus?.();
  }

  function cancelDelete() {
    setConfirmDelete({ open: false, type: null, item: null, loading: false });
    subModalTriggerRef.current?.focus?.();
  }

  // Cierra con Escape. El sub-modal visible tiene prioridad sobre el
  // formulario principal, para no perder el progreso del caso por accidente
  // si el usuario solo quería cerrar "crear rápido" o "confirmar eliminar".
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e) {
      if (e.key !== "Escape") return;
      if (confirmDelete.open) {
        cancelDelete();
      } else if (quickCreate.open) {
        closeQuickCreate();
      } else {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // Se omiten onClose/cancelDelete/closeQuickCreate a propósito: son
    // funciones redefinidas en cada render que no cambian de comportamiento,
    // envolverlas en useCallback está fuera del alcance de esta tarea.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, confirmDelete.open, quickCreate.open]);

  // Al abrir el formulario, mueve el foco y recuerda qué elemento lo abrió;
  // al cerrarlo, el foco vuelve ahí. Los sub-modales gestionan el suyo por
  // separado (ver openQuickCreate/closeQuickCreate y askDelete/cancelDelete).
  useEffect(() => {
    if (!open) return;

    previouslyFocusedRef.current = document.activeElement;
    closeButtonRef.current?.focus();

    return () => {
      previouslyFocusedRef.current?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  // ── Documento helpers ────────────────────────────────────────────────────────

  function addDocumento() {
    setForm((f) => ({ ...f, recursos: [...f.recursos, { tipo: "PDF", nombre: "", url: "" }] }));
  }

  function removeDocumento(i) {
    setForm((f) => ({ ...f, recursos: f.recursos.filter((_, idx) => idx !== i) }));
  }

  function updateDocumento(i, field, value) {
    setForm((f) => ({
      ...f,
      recursos: f.recursos.map((doc, idx) => idx === i ? { ...doc, [field]: value } : doc),
    }));
  }

  // ── Form submit ──────────────────────────────────────────────────────────────

  async function handleSubmit(e) {
    e.preventDefault();
    if (saving) return;

    const recursos = form.recursos
      .filter((d) => d.url?.trim())
      .map((d) => ({ tipo: d.tipo, nombre: d.nombre.trim() || d.tipo, url: d.url.trim() }));

    const recursoInvalido = recursos.find((r) => !isSafeResourceUrl(r.url));
    if (recursoInvalido) {
      showToast(
        `La URL de "${recursoInvalido.nombre}" no es válida. Debe iniciar con http:// o https://`,
        "error"
      );
      return;
    }

    setSaving(true);
    try {
      await onSave({
        titulo:             form.titulo,
        sector:             form.sector,
        cliente:            form.cliente || null,
        anioImplementacion: form.anioImplementacion ? Number(form.anioImplementacion) : null,
        beneficioPrincipal: form.beneficioPrincipal,
        reto:               form.reto,
        resultados:         form.resultados || null,
        recursos:           recursos.length ? recursos : null,
        idTipoCaso:         Number(form.idTipoCaso),
        idsTecnologias:     form.idsTecnologias,
        idsCategorias:      form.idsCategorias,
        idsLaboratorios:    form.idsLaboratorios,
      });
    } finally {
      setSaving(false);
    }
  }

  function toggleId(field, id) {
    const current = form[field];
    const updated = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    setForm({ ...form, [field]: updated });
  }

  // ── Quick-create handlers ────────────────────────────────────────────────────

  function openQuickCreate(type) {
    subModalTriggerRef.current = document.activeElement;
    setQuickCreate({ open: true, type, name: "", loading: false, error: "" });
  }

  function handleQuickCreateNameChange(value) {
    setQuickCreate((prev) => ({ ...prev, name: value, error: "" }));
  }

  async function handleQuickCreate(e) {
    e.preventDefault();
    const name = quickCreate.name.trim();
    if (!name) return;

    const config = QUICK_CONFIG[quickCreate.type];
    const setter = catalogSetters[quickCreate.type];

    setQuickCreate((prev) => ({ ...prev, loading: true, error: "" }));

    try {
      const payload = { [config.nameField]: name };
      const data = await createCatalogItem(config.endpoint, payload);
      const newItem = { id: data.id, label: data[config.nameField] };

      setter((prev) => [...prev, newItem]);
      setForm((prev) => ({ ...prev, [config.listField]: [...prev[config.listField], newItem.id] }));
      onMetadataCreated?.(quickCreate.type, newItem);
      showToast(`"${newItem.label}" creado correctamente`, "success");
      closeQuickCreate();
    } catch (err) {
      const msg = err.response?.status === 409
        ? "Ya existe un registro con ese nombre"
        : "Error al guardar. Intenta de nuevo";
      setQuickCreate((prev) => ({ ...prev, loading: false, error: msg }));
    }
  }

  // Crea en el catálogo un nombre detectado por la IA que todavía no existe,
  // y lo selecciona automáticamente — mismo endpoint/config que el
  // quick-create manual, sin el modal intermedio porque el nombre ya se conoce.
  async function handleCreateFromAi(type, name) {
    const config = QUICK_CONFIG[type];
    const setter = catalogSetters[type];

    setCreatingAiItems((prev) => ({ ...prev, [type]: new Set(prev[type]).add(name) }));

    try {
      const payload = { [config.nameField]: name };
      const data = await createCatalogItem(config.endpoint, payload);
      const newItem = { id: data.id, label: data[config.nameField] };

      setter((prev) => [...prev, newItem]);
      setForm((prev) => ({ ...prev, [config.listField]: [...prev[config.listField], newItem.id] }));
      onMetadataCreated?.(type, newItem);
      showToast(`"${newItem.label}" creado correctamente`, "success");
    } catch (err) {
      const msg = err.response?.status === 409
        ? "Ya existe un registro con ese nombre"
        : err.friendlyMessage || "Error al crear. Intenta de nuevo";
      showToast(msg, "error");
    } finally {
      setCreatingAiItems((prev) => {
        const next = new Set(prev[type]);
        next.delete(name);
        return { ...prev, [type]: next };
      });
    }
  }

  // ── Delete-mode handlers ─────────────────────────────────────────────────────

  function toggleDeleteMode(type) {
    setDeleteMode((prev) => ({ ...prev, [type]: !prev[type] }));
  }

  function askDelete(type, item) {
    subModalTriggerRef.current = document.activeElement;
    setConfirmDelete({ open: true, type, item, loading: false });
  }

  async function handleConfirmDelete() {
    const { type, item } = confirmDelete;

    setConfirmDelete((prev) => ({ ...prev, loading: true }));

    try {
      await deleteCatalogItem(DELETE_ENDPOINTS[type], item.id);

      catalogSetters[type]((prev) => prev.filter((x) => x.id !== item.id));
      setForm((prev) => ({
        ...prev,
        [LIST_FIELDS[type]]: prev[LIST_FIELDS[type]].filter((id) => id !== item.id),
      }));
      onMetadataDeleted?.(type, item.id);
      showToast(`"${item.label}" eliminado correctamente`, "success");
      setConfirmDelete({ open: false, type: null, item: null, loading: false });
      subModalTriggerRef.current?.focus?.();
    } catch (err) {
      const msg = err.response?.data?.mensaje || "Error al eliminar. Intenta de nuevo";
      showToast(msg, "error");
      setConfirmDelete({ open: false, type: null, item: null, loading: false });
      subModalTriggerRef.current?.focus?.();
    }
  }

  // Recalculado en cada render a partir del catálogo actual — apenas se crea
  // un pendiente (handleCreateFromAi) el propio catálogo lo refleja y el chip
  // pasa de "pendiente" a "coincidido" sin estado adicional que sincronizar.
  const catalogLiveState = {
    tecnologia:  { items: localTecs, selectedIds: form.idsTecnologias,  aiItems: buildAiChips(prefillData?.tecnologias, localTecs) },
    categoria:   { items: localCats, selectedIds: form.idsCategorias,   aiItems: buildAiChips(prefillData?.categorias, localCats) },
    laboratorio: { items: localLabs, selectedIds: form.idsLaboratorios, aiItems: buildAiChips(prefillData?.laboratorios, localLabs) },
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="modal-overlay">
      <div
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-form-modal-title"
      >

        <button className="modal-close" onClick={onClose} aria-label="Cerrar" ref={closeButtonRef}>&#10005;</button>

        <form onSubmit={handleSubmit}>

          {/* Header */}
          <div className="modal-header">
            <p className="form-modal-eyebrow" id="case-form-modal-title">
              {initialData ? "Editar Caso" : "Nuevo Caso"}
            </p>

            <h4 className="modal-section-label">
              <Tag size={13} /> Tipo de Caso
            </h4>
            <div className="modal-tags">
              {tiposCasos.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`form-tipo-pill ${form.idTipoCaso === t.id ? "selected" : ""}`}
                  onClick={() => setForm({ ...form, idTipoCaso: t.id })}
                  aria-pressed={form.idTipoCaso === t.id}
                >
                  {t.nombreTipo}
                </button>
              ))}
            </div>

            <input
              className="form-title-input"
              placeholder="Título del caso..."
              aria-label="Título del caso"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              required
            />
          </div>

          {/* Body */}
          <div className="modal-body">

            <section className="modal-section">
              <h4 className="modal-section-label">
                <Building2 size={13} /> Sector / Industria
              </h4>
              <input
                className="form-input"
                placeholder="Ej: Salud, Finanzas, Retail..."
                aria-label="Sector / Industria"
                value={form.sector}
                onChange={(e) => setForm({ ...form, sector: e.target.value })}
                required
              />
            </section>

            <section className="modal-section">
              <h4 className="modal-section-label">Cliente (opcional)</h4>
              <input
                className="form-input"
                placeholder="Nombre del cliente o empresa..."
                aria-label="Cliente (opcional)"
                value={form.cliente}
                onChange={(e) => setForm({ ...form, cliente: e.target.value })}
              />
            </section>

            <section className="modal-section">
              <h4 className="modal-section-label">Año de implementación (opcional)</h4>
              <input
                className="form-input"
                type="number"
                placeholder="Ej: 2024"
                aria-label="Año de implementación (opcional)"
                min="2000"
                max="2100"
                value={form.anioImplementacion}
                onChange={(e) => setForm({ ...form, anioImplementacion: e.target.value })}
              />
            </section>

            <div className="modal-impact">
              <div className="modal-impact-title">
                <TrendingUp size={13} /> Beneficio principal
              </div>
              <textarea
                className="form-textarea-ghost"
                placeholder='Una frase que resuma el valor obtenido. Ej: "Reducción del 60% en tiempos de gestión"'
                aria-label="Beneficio principal"
                value={form.beneficioPrincipal}
                onChange={(e) => setForm({ ...form, beneficioPrincipal: e.target.value })}
                rows={2}
                required
              />
            </div>

            <section className="modal-section">
              <h4 className="modal-section-label">
                <Settings2 size={13} /> Reto / Desafío
              </h4>
              <textarea
                className="form-textarea"
                placeholder="¿Cuál era el problema o necesidad del cliente?"
                aria-label="Reto / Desafío"
                value={form.reto}
                onChange={(e) => setForm({ ...form, reto: e.target.value })}
                rows={4}
                required
              />
            </section>

            <section className="modal-section">
              <h4 className="modal-section-label">
                <TrendingUp size={13} /> Resultados obtenidos (opcional)
              </h4>
              <textarea
                className="form-textarea"
                placeholder="¿Qué se logró? Incluye métricas si las tienes."
                aria-label="Resultados obtenidos (opcional)"
                value={form.resultados}
                onChange={(e) => setForm({ ...form, resultados: e.target.value })}
                rows={3}
              />
            </section>

            {CATALOG_SECTIONS.map((section) => (
              <CatalogSection
                key={section.type}
                icon={section.icon}
                title={section.title}
                itemsLabel={section.itemsLabel}
                type={section.type}
                createLabel={section.createLabel}
                field={section.field}
                items={catalogLiveState[section.type].items}
                selectedIds={catalogLiveState[section.type].selectedIds}
                aiItems={catalogLiveState[section.type].aiItems}
                creatingLabels={creatingAiItems[section.type]}
                isDeleteMode={deleteMode[section.type]}
                onToggleId={toggleId}
                onAskDelete={askDelete}
                onQuickCreate={openQuickCreate}
                onToggleDeleteMode={toggleDeleteMode}
                onCreateAiItem={(name) => handleCreateFromAi(section.type, name)}
              />
            ))}

            <DocumentsSection
              recursos={form.recursos}
              onAdd={addDocumento}
              onRemove={removeDocumento}
              onUpdate={updateDocumento}
            />

            <div className="form-actions">
              <button type="button" className="ghost-button" onClick={onClose}>Cancelar</button>
              <button type="submit" className="primary-button" disabled={saving}>
                {saving ? "Guardando..." : (initialData ? "Guardar cambios" : "Crear caso")}
              </button>
            </div>

          </div>
        </form>

        <QuickCreateModal
          quickCreate={quickCreate}
          onNameChange={handleQuickCreateNameChange}
          onSubmit={handleQuickCreate}
          onClose={closeQuickCreate}
        />

        <ConfirmDeleteCatalogModal
          confirmDelete={confirmDelete}
          onCancel={cancelDelete}
          onConfirm={handleConfirmDelete}
        />

      </div>
    </div>
  );
}
