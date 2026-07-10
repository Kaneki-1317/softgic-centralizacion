import api from "./api";

/**
 * Llamadas HTTP relacionadas con casos — antes dispersas entre useCaseFeed.js
 * y AdminPage.jsx, cada una construyendo su propio endpoint/params. Mismos
 * endpoints y payloads que antes; estas funciones solo devuelven ya
 * desenvuelto response.data en vez de la respuesta completa de axios.
 */

export function fetchCases(params) {
  return api.get("/casos", { params }).then((res) => res.data);
}

export function createCase(data) {
  return api.post("/casos", data).then((res) => res.data);
}

export function updateCase(id, data) {
  return api.put(`/casos/${id}`, data).then((res) => res.data);
}

export function deleteCase(id) {
  return api.delete(`/casos/${id}`);
}
