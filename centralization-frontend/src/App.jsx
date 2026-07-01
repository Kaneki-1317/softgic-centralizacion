import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import PublicPage from "./pages/PublicPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";

import {
  useAuth,
} from "./context/AuthContext";

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
  return (
    <>
      <ToastViewport />

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

      </Routes>
    </>
  );
}