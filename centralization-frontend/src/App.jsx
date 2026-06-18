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

function PrivateRoute({
  children,
}) {
  const {
    isAuthenticated,
  } = useAuth();

  return isAuthenticated
    ? children
    : <Navigate to="/login" />;
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
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/admin"
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