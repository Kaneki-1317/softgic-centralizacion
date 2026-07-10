import api from "./api";

/** Login de administrador — antes inline dentro de AuthContext.jsx. */
export function login(correo, contrasena) {
  return api.post("/auth/login", { correo, contrasena }).then((res) => res.data);
}
