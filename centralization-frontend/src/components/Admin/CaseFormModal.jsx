import { useEffect, useState } from "react";

const EMPTY_FORM = {
  titulo: "",
  descripcion: "",
  idTipoCaso: "",
  idsTecnologias: [],
  idsCategorias: [],
  idsLaboratorios: [],
};

export default function CaseFormModal({
  open,
  initialData,
  onClose,
  onSave,
  tiposCasos = [],
  tecnologias = [],
  categorias = [],
  laboratorios = [],
}) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!open) return;

    if (!initialData) {
      setForm(EMPTY_FORM);
      return;
    }

    // initialData es un CasoDTO: tipoCaso es String, tecnologias/categorias/laboratorios son String[].
    // El formulario necesita IDs numéricos, así que hacemos lookup inverso nombre → id.
    const tipoId = tiposCasos.find((t) => t.nombreTipo === initialData.tipoCaso)?.id ?? "";
    const tecIds = tecnologias
      .filter((t) => initialData.tecnologias?.includes(t.nombreTecnologia))
      .map((t) => t.id);
    const catIds = categorias
      .filter((c) => initialData.categorias?.includes(c.nombreCategoria))
      .map((c) => c.id);
    const labIds = laboratorios
      .filter((l) => initialData.laboratorios?.includes(l.nombreLaboratorio))
      .map((l) => l.id);

    setForm({
      titulo:          initialData.titulo,
      descripcion:     initialData.descripcion,
      idTipoCaso:      tipoId,
      idsTecnologias:  tecIds,
      idsCategorias:   catIds,
      idsLaboratorios: labIds,
    });
  }, [open, initialData, tiposCasos, tecnologias, categorias, laboratorios]);

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      titulo: form.titulo,
      descripcion: form.descripcion,
      idTipoCaso: Number(form.idTipoCaso),
      idsTecnologias: form.idsTecnologias,
      idsCategorias: form.idsCategorias,
      idsLaboratorios: form.idsLaboratorios,
    });
  }

  function toggleId(field, id) {
    const current = form[field];
    const updated = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    setForm({ ...form, [field]: updated });
  }

  return (
    <div className="modal-layer">

      <div className="case-form">

        <h2>{initialData ? "Editar Caso" : "Nuevo Caso"}</h2>

        <form onSubmit={handleSubmit}>

          <input
            placeholder="Título"
            value={form.titulo}
            onChange={(e) =>
              setForm({ ...form, titulo: e.target.value })
            }
          />

          <textarea
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) =>
              setForm({ ...form, descripcion: e.target.value })
            }
          />

          <select
            value={form.idTipoCaso}
            onChange={(e) =>
              setForm({ ...form, idTipoCaso: Number(e.target.value) })
            }
          >
            <option value="">-- Tipo de Caso --</option>
            {tiposCasos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombreTipo}
              </option>
            ))}
          </select>

          <fieldset>
            <legend>Tecnologías</legend>
            {tecnologias.map((t) => (
              <label key={t.id}>
                <input
                  type="checkbox"
                  checked={form.idsTecnologias.includes(t.id)}
                  onChange={() => toggleId("idsTecnologias", t.id)}
                />
                {t.nombreTecnologia}
              </label>
            ))}
          </fieldset>

          <fieldset>
            <legend>Categorías</legend>
            {categorias.map((c) => (
              <label key={c.id}>
                <input
                  type="checkbox"
                  checked={form.idsCategorias.includes(c.id)}
                  onChange={() => toggleId("idsCategorias", c.id)}
                />
                {c.nombreCategoria}
              </label>
            ))}
          </fieldset>

          <fieldset>
            <legend>Laboratorios</legend>
            {laboratorios.map((l) => (
              <label key={l.id}>
                <input
                  type="checkbox"
                  checked={form.idsLaboratorios.includes(l.id)}
                  onChange={() => toggleId("idsLaboratorios", l.id)}
                />
                {l.nombreLaboratorio}
              </label>
            ))}
          </fieldset>

          <div className="form-actions">
            <button
              type="button"
              className="ghost-button"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="primary-button"
            >
              Guardar
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
