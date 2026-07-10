// Valida que la URL de un recurso use esquema http/https antes de enviarla —
// es solo una mejora de UX; el backend revalida lo mismo y es la fuente de
// verdad (ver ValidResourceUrl/ResourceUrlValidator en el backend).
const SAFE_URL_SCHEMES = new Set(["http:", "https:"]);

export function isSafeResourceUrl(url) {
  try {
    return SAFE_URL_SCHEMES.has(new URL(url.trim()).protocol);
  } catch {
    return false;
  }
}

// Comparación tolerante a mayúsculas/minúsculas y espacios — la IA no
// garantiza que el nombre detectado coincida byte a byte con el catálogo.
function normalizeLabel(value) {
  return (value ?? "").trim().toLowerCase();
}

function findCatalogMatch(name, catalogItems) {
  const target = normalizeLabel(name);
  return catalogItems.find((item) => normalizeLabel(item.label) === target);
}

// Para cada nombre detectado por la IA, indica si ya existe en el catálogo
// (matched=true, ya viene seleccionado en el selector de abajo) o si aún no
// existe (matched=false, la Card ofrece un botón "Crear" para darlo de alta).
export function buildAiChips(aiNames, catalogItems) {
  if (!aiNames) return [];
  return aiNames.map((label) => ({ label, matched: !!findCatalogMatch(label, catalogItems) }));
}

// Resuelve la forma "externa" (nombre de tipo + labels de tecnologías/
// categorías/laboratorios) hacia la forma interna del formulario (IDs).
// La usan tanto initialData (edición) como prefillData (creación desde
// documento) — misma lógica, misma resolución, para no duplicarla.
export function buildFormFromExternalShape(source, tiposCasos, tecnologias, categorias, laboratorios) {
  const tipoId = tiposCasos.find((t) => t.nombreTipo === source.tipoCaso)?.id ?? "";
  const namesToIds = (names, catalogItems) =>
    (names || [])
      .map((name) => findCatalogMatch(name, catalogItems)?.id)
      .filter((id) => id !== undefined);
  const tecIds = namesToIds(source.tecnologias, tecnologias);
  const catIds = namesToIds(source.categorias, categorias);
  const labIds = namesToIds(source.laboratorios, laboratorios);

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
