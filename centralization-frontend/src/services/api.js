import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Punto único de manejo de sesión expirada/inválida. Un 401 en cualquier
// endpoint protegido (nunca en el propio login, que maneja su error aparte)
// cierra la sesión y fuerza una recarga completa hacia el login — así
// AuthProvider se remonta leyendo el localStorage ya sin token, sin tener
// que tocar AuthContext ni App.jsx para propagar el cambio de estado.
const LOGIN_ROUTE = "/softgic-access-portal/login";
const SESSION_EXPIRED_MESSAGE = "Tu sesión ha expirado. Inicia sesión nuevamente.";
let sessionExpiredHandled = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/auth/login");

    if (error.response?.status === 401 && !isLoginRequest) {
      if (!sessionExpiredHandled) {
        sessionExpiredHandled = true;
        localStorage.removeItem("token");
        sessionStorage.setItem("sessionExpiredMessage", SESSION_EXPIRED_MESSAGE);
        window.location.href = LOGIN_ROUTE;
      }
      // La página está a punto de recargar: no dejamos que el error siga su
      // curso normal, para que ningún componente muestre su propio mensaje
      // de error genérico ni quede en un estado inconsistente mientras tanto.
      return new Promise(() => {});
    }

    return Promise.reject(error);
  }
);

export default api;
