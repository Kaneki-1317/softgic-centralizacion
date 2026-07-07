import { useEffect, useState } from "react";
import { Settings2, LayoutList, FlaskConical, Tag, TrendingUp, Building2, Paperclip, Plus, X, FileText, Trash2 } from "lucide-react";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";

const DOC_TYPES = [
  { value: "PDF",  label: "PDF",         color: "#dc2626", bg: "#fef2f2" },
  { value: "DOCX", label: "Word",        color: "#2563eb", bg: "#eff6ff" },
  { value: "XLSX", label: "Excel",       color: "#16a34a", bg: "#f0fdf4" },
  { value: "PPTX", label: "PowerPoint",  color: "#ea580c", bg: "#fff7ed" },
];

const EMPTY_FORM = {
  titulo: "",
  sector: "",
  cliente: "",
  anioImplementacion: "",
  beneficioPrincipal: "",
  reto: "",
  resultados: "",
  recursos: [],
  idTipoCaso: "",
  idsTecnologias: [],
  idsCategorias: [],
  idsLaboratorios: [],
};

const QUICK_CONFIG = {
  tecnologia: {
    title: "Nueva Tecnología",
    placeholder: "Ej: Power BI, Salesforce, Python...",
    endpoint: "/tecnologias",
    nameField: "nombreTecnologia",
    listField: "idsTecnologias",
  },
  categoria: {
    title: "Nueva Categoría",
    placeholder: "Ej: Automatización, Analítica...",
    endpoint: "/categorias",
    nameField: "nombreCategoria",
    listField: "idsCategorias",
  },
  laboratorio: {
    title: "Nuevo Equipo / Unidad",
    placeholder: "Ej: Lab IA, Centro de Innovación...",
    endpoint: "/laboratorios",
    nameField: "nombreLaboratorio",
    listField: "idsLaboratorios",
  },
};

const DELETE_MESSAGES = {
  tecnologia: "¿Estás seguro de que deseas eliminar esta tecnología?",
  categoria:  "¿Estás seguro de que deseas eliminar esta categoría?",
  laboratorio: "¿Estás seguro de que deseas eliminar este equipo / unidad?",
};

const DELETE_ENDPOINTS = {
  tecnologia: "/tecnologias",
  categoria:  "/categorias",
  laboratorio: "/laboratorios",
};

const LIST_FIELDS = {
  tecnologia: "idsTecnologias",
  categoria:  "idsCategorias",
  laboratorio: "idsLaboratorios",
};

// Resuelve la forma "externa" (nombre de tipo + labels de tecnologías/
// categorías/laboratorios) hacia la forma interna del formulario (IDs).
// La usan tanto initialData (edición) como prefillData (creación desde
// documento) — misma lógica, misma resolución, para no duplicarla.
function buildFormFromExternalShape(source, tiposCasos, tecnologias, categorias, laboratorios) {
  const tipoId = tiposCasos.find((t) => t.nombreTipo === source.tipoCaso)?.id ?? "";
  const tecIds = tecnologias.filter((t) => source.tecnologias?.includes(t.label)).map((t) => t.id);
  const catIds = categorias.filter((c) => source.categorias?.includes(c.label)).map((c) => c.id);
  const labIds = laboratorios.filter((l) => source.laboratorios?.includes(l.label)).map((l) => l.id);

  return {
    titulo:             source.titulo ?? "",
    sector:             source.sector ?? "",
    cliente:            source.cliente ?? "",
    anioImplementacion: source.anioImplementacion ?? "",
    beneficioPrincipal: source.beneficioPrincipal ?? "",
    reto:               source.reto ?? "",
    resultados:         source.resultados ?? "",
    recursos:           (source.recursos || []).map((r) => ({ tipo: r.tipo ?? "PDF", nombre: r.nombre ?? "", url: r.url ?? "" })),
    idTipoCaso:         tipoId,
    idsTecnologias:     tecIds,
    idsCategorias:      catIds,
    idsLaboratorios:    labIds,
  };
}

// ── Pill list renderer ───────────────────────────────────────────────────────
// Hoisted out of CaseFormModal (not a closure) so it isn't recreated on every
// render — a component redefined per-render loses its identity and forces
// React to remount it instead of reconciling, resetting any internal state.
function PillList({ items, selectedIds, field, type, isDeleteMode, onToggle, onAskDelete }) {
  return (
    <div className="modal-tags">
      {items.map((item) => (
        <div key={item.id} className="pill-wrapper">
          <button
            type="button"
            className={`form-tag-pill ${selectedIds.includes(item.id) ? "selected" : ""} ${isDeleteMode ? "delete-mode-pill" : ""}`}
            onClick={() => !isDeleteMode && onToggle(field, item.id)}
          >
            {item.label}
          </button>
          {isDeleteMode && (
            <button
              type="button"
              className="pill-delete-x"
              onClick={() => onAskDelete(type, item)}
              title={`Eliminar "${item.label}"`}
            >
              <X size={9} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Section header renderer ──────────────────────────────────────────────────
function SectionActions({ type, createLabel, isDeleteMode, onQuickCreate, onToggleDeleteMode }) {
  return (
    <div className="section-label-actions">
      <button type="button" className="quick-create-btn" onClick={() => onQuickCreate(type)}>
        <Plus size={12} /> {createLabel}
      </button>
      <button
        type="button"
        className={`delete-mode-btn ${isDeleteMode ? "active" : ""}`}
        onClick={() => onToggleDeleteMode(type)}
      >
        <Trash2 size={12} /> Eliminar
      </button>
    </div>
  );
}

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

  const [quickCreate, setQuickCreate] = useState({
    open: false, type: null, name: "", loading: false, error: "",
  });

  const [deleteMode, setDeleteMode] = useState({
    tecnologia: false, categoria: false, laboratorio: false,
  });

  const [confirmDelete, setConfirmDelete] = useState({
    open: false, type: null, item: null, loading: false,
  });

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

  function handleSubmit(e) {
    e.preventDefault();
    const recursos = form.recursos
      .filter((d) => d.url?.trim())
      .map((d) => ({ tipo: d.tipo, nombre: d.nombre.trim() || d.tipo, url: d.url.trim() }));

    onSave({
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
  }

  function toggleId(field, id) {
    const current = form[field];
    const updated = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    setForm({ ...form, [field]: updated });
  }

  // ── Quick-create handlers ────────────────────────────────────────────────────

  function openQuickCreate(type) {
    setQuickCreate({ open: true, type, name: "", loading: false, error: "" });
  }

  function closeQuickCreate() {
    setQuickCreate({ open: false, type: null, name: "", loading: false, error: "" });
  }

  async function handleQuickCreate(e) {
    e.preventDefault();
    const name = quickCreate.name.trim();
    if (!name) return;

    const config = QUICK_CONFIG[quickCreate.type];
    const setterMap = { tecnologia: setLocalTecs, categoria: setLocalCats, laboratorio: setLocalLabs };
    const setter = setterMap[quickCreate.type];

    setQuickCreate((prev) => ({ ...prev, loading: true, error: "" }));

    try {
      const payload = { [config.nameField]: name };
      const response = await api.post(config.endpoint, payload);
      const newItem = { id: response.data.id, label: response.data[config.nameField] };

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

  // ── Delete-mode handlers ─────────────────────────────────────────────────────

  function toggleDeleteMode(type) {
    setDeleteMode((prev) => ({ ...prev, [type]: !prev[type] }));
  }

  function askDelete(type, item) {
    setConfirmDelete({ open: true, type, item, loading: false });
  }

  function cancelDelete() {
    setConfirmDelete({ open: false, type: null, item: null, loading: false });
  }

  async function handleConfirmDelete() {
    const { type, item } = confirmDelete;
    const setterMap = { tecnologia: setLocalTecs, categoria: setLocalCats, laboratorio: setLocalLabs };

    setConfirmDelete((prev) => ({ ...prev, loading: true }));

    try {
      await api.delete(`${DELETE_ENDPOINTS[type]}/${item.id}`);

      setterMap[type]((prev) => prev.filter((x) => x.id !== item.id));
      setForm((prev) => ({
        ...prev,
        [LIST_FIELDS[type]]: prev[LIST_FIELDS[type]].filter((id) => id !== item.id),
      }));
      onMetadataDeleted?.(type, item.id);
      showToast(`"${item.label}" eliminado correctamente`, "success");
      setConfirmDelete({ open: false, type: null, item: null, loading: false });
    } catch (err) {
      const msg = err.response?.data?.mensaje || "Error al eliminar. Intenta de nuevo";
      showToast(msg, "error");
      setConfirmDelete({ open: false, type: null, item: null, loading: false });
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>

        <button className="modal-close" onClick={onClose}>&#10005;</button>

        <form onSubmit={handleSubmit}>

          {/* Header */}
          <div className="modal-header">
            <p className="form-modal-eyebrow">
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
                >
                  {t.nombreTipo}
                </button>
              ))}
            </div>

            <input
              className="form-title-input"
              placeholder="Título del caso..."
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
                value={form.resultados}
                onChange={(e) => setForm({ ...form, resultados: e.target.value })}
                rows={3}
              />
            </section>

            {/* Tecnologías */}
            <section className="modal-section">
              <div className="section-label-row">
                <h4 className="modal-section-label">
                  <Settings2 size={13} /> Tecnologías
                </h4>
                <SectionActions
                  type="tecnologia"
                  createLabel="Nueva"
                  isDeleteMode={deleteMode.tecnologia}
                  onQuickCreate={openQuickCreate}
                  onToggleDeleteMode={toggleDeleteMode}
                />
              </div>
              <PillList
                items={localTecs}
                selectedIds={form.idsTecnologias}
                field="idsTecnologias"
                type="tecnologia"
                isDeleteMode={deleteMode.tecnologia}
                onToggle={toggleId}
                onAskDelete={askDelete}
              />
            </section>

            {/* Categorías */}
            <section className="modal-section">
              <div className="section-label-row">
                <h4 className="modal-section-label">
                  <LayoutList size={13} /> Área de aplicación
                </h4>
                <SectionActions
                  type="categoria"
                  createLabel="Nueva"
                  isDeleteMode={deleteMode.categoria}
                  onQuickCreate={openQuickCreate}
                  onToggleDeleteMode={toggleDeleteMode}
                />
              </div>
              <PillList
                items={localCats}
                selectedIds={form.idsCategorias}
                field="idsCategorias"
                type="categoria"
                isDeleteMode={deleteMode.categoria}
                onToggle={toggleId}
                onAskDelete={askDelete}
              />
            </section>

            {/* Laboratorios */}
            <section className="modal-section">
              <div className="section-label-row">
                <h4 className="modal-section-label">
                  <FlaskConical size={13} /> Equipo / Unidad
                </h4>
                <SectionActions
                  type="laboratorio"
                  createLabel="Nuevo"
                  isDeleteMode={deleteMode.laboratorio}
                  onQuickCreate={openQuickCreate}
                  onToggleDeleteMode={toggleDeleteMode}
                />
              </div>
              <PillList
                items={localLabs}
                selectedIds={form.idsLaboratorios}
                field="idsLaboratorios"
                type="laboratorio"
                isDeleteMode={deleteMode.laboratorio}
                onToggle={toggleId}
                onAskDelete={askDelete}
              />
            </section>

            {/* Documentos del caso */}
            <section className="modal-section docs-section">
              <div className="docs-section-header">
                <h4 className="modal-section-label docs-section-label">
                  <Paperclip size={13} /> Documentos del caso
                </h4>
                <button type="button" className="docs-add-btn" onClick={addDocumento}>
                  <Plus size={13} /> Agregar
                </button>
              </div>
              <p className="docs-hint">PDF, Word, Excel o PowerPoint. Solo admite links a documentos.</p>

              {form.recursos.length === 0 ? (
                <div className="docs-empty">
                  <FileText size={26} />
                  <span>Sin documentos adjuntos</span>
                </div>
              ) : (
                <div className="docs-list">
                  {form.recursos.map((doc, i) => (
                    <div key={i} className="doc-item">
                      <div className="doc-item-top">
                        <div className="doc-type-pills">
                          {DOC_TYPES.map((dt) => (
                            <button
                              key={dt.value}
                              type="button"
                              className="doc-type-pill"
                              style={doc.tipo === dt.value
                                ? { background: dt.bg, color: dt.color, borderColor: dt.color }
                                : {}}
                              onClick={() => updateDocumento(i, "tipo", dt.value)}
                            >
                              {dt.label}
                            </button>
                          ))}
                        </div>
                        <button type="button" className="doc-remove-btn" onClick={() => removeDocumento(i)}>
                          <X size={13} />
                        </button>
                      </div>
                      <div className="doc-item-fields">
                        <input
                          className="form-input"
                          placeholder="Nombre del documento..."
                          value={doc.nombre}
                          onChange={(e) => updateDocumento(i, "nombre", e.target.value)}
                        />
                        <input
                          className="form-input"
                          type="url"
                          placeholder="https://..."
                          value={doc.url}
                          onChange={(e) => updateDocumento(i, "url", e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div className="form-actions">
              <button type="button" className="ghost-button" onClick={onClose}>Cancelar</button>
              <button type="submit" className="primary-button">
                {initialData ? "Guardar cambios" : "Crear caso"}
              </button>
            </div>

          </div>
        </form>

        {/* ── Quick-create sub-modal ── */}
        {quickCreate.open && (
          <div className="quick-create-overlay" onClick={closeQuickCreate}>
            <div className="quick-create-panel" onClick={(e) => e.stopPropagation()}>
              <div className="quick-create-header">
                <h5 className="quick-create-title">{QUICK_CONFIG[quickCreate.type].title}</h5>
                <button type="button" className="quick-create-close" onClick={closeQuickCreate}>
                  <X size={15} />
                </button>
              </div>
              <form onSubmit={handleQuickCreate}>
                <input
                  className="form-input"
                  placeholder={QUICK_CONFIG[quickCreate.type].placeholder}
                  value={quickCreate.name}
                  onChange={(e) => setQuickCreate((prev) => ({ ...prev, name: e.target.value, error: "" }))}
                  autoFocus
                  required
                  maxLength={100}
                />
                {quickCreate.error && (
                  <p className="quick-create-error">{quickCreate.error}</p>
                )}
                <div className="quick-create-actions">
                  <button type="button" className="ghost-button" onClick={closeQuickCreate}>
                    Cancelar
                  </button>
                  <button type="submit" className="primary-button" disabled={quickCreate.loading}>
                    {quickCreate.loading ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Confirm-delete sub-modal ── */}
        {confirmDelete.open && (
          <div className="quick-create-overlay" onClick={cancelDelete}>
            <div className="confirm-panel" onClick={(e) => e.stopPropagation()}>
              <div className="confirm-icon">
                <Trash2 size={28} />
              </div>
              <h3>{DELETE_MESSAGES[confirmDelete.type]}</h3>
              <p>
                Se eliminará <strong>"{confirmDelete.item?.label}"</strong> de todos los casos donde aparezca.
                Esta acción no se puede deshacer.
              </p>
              <div className="confirm-actions">
                <button
                  className="ghost-button"
                  onClick={cancelDelete}
                  disabled={confirmDelete.loading}
                >
                  Cancelar
                </button>
                <button
                  className="danger-button"
                  onClick={handleConfirmDelete}
                  disabled={confirmDelete.loading}
                >
                  {confirmDelete.loading ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
