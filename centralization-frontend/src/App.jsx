import { lazy, Suspense, useEffect } from "react";

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Code splitting: cada página se descarga en su propio chunk, solo cuando la
// ruta correspondiente se visita — un visitante público nunca descarga el
// bundle del panel admin, y viceversa.
const PublicPage = lazy(() => import("./pages/PublicPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

import {
  useAuth,
} from "./context/AuthContext";

import { useToast } from "./context/ToastContext";

import ToastViewport from "./components/Shared/ToastViewport";

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/softgic-access-portal/login" />;
}

function GuestRoute({ children }) {
  const { isAuthenticated, adminName } = useAuth();
  return isAuthenticated ? <Navigate to={`/softgic-access-portal/${encodeURIComponent(adminName)}`} /> : children;
}

export default function App() {
  const { showToast } = useToast();

  // Si el interceptor de api.js forzó un cierre de sesión por un 401, deja
  // el mensaje en sessionStorage antes de recargar la página. Lo mostramos
  // una sola vez aquí, en el componente raíz, y lo limpiamos de inmediato.
  useEffect(() => {
    const message = sessionStorage.getItem("sessionExpiredMessage");
    if (message) {
      sessionStorage.removeItem("sessionExpiredMessage");
      showToast(message, "error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ToastViewport />

      <Suspense fallback={null}>
        <Routes>

          <Route
            path="/"
            element={<PublicPage />}
          />

          <Route
            path="/softgic-access-portal/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />

          <Route
            path="/softgic-access-portal/:adminName"
            element={
              <PrivateRoute>
                <AdminPage />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </Suspense>
    </>
  );
}