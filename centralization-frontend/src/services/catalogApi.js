import api from "./api";

/**
 * Llamadas HTTP relacionadas con los catálogos de metadata (tipos de caso,
 * tecnologías, categorías, laboratorios) — antes repetidas en useCaseFeed.js
 * (lectura) y CaseFormModal.jsx (creación/eliminación rápida).
 *
 * Los tres catálogos editables (tecnología/categoría/laboratorio) comparten
 * la misma forma de endpoint REST, por eso createCatalogItem/deleteCatalogItem
 * reciben el endpoint en vez de triplicar la misma función.
 */

export function fetchTiposCasos() {
  return api.get("/tipos-casos").then((res) => res.data);
}

export function fetchTecnologias() {
  return api.get("/tecnologias").then((res) => res.data);
}

export function fetchCategorias() {
  return api.get("/categorias").then((res) => res.data);
}

export function fetchLaboratorios() {
  return api.get("/laboratorios").then((res) => res.data);
}

export function createCatalogItem(endpoint, payload) {
  return api.post(endpoint, payload).then((res) => res.data);
}

export function deleteCatalogItem(endpoint, id) {
  return api.delete(`${endpoint}/${id}`);
}
