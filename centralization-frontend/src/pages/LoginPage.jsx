import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import brandSoftgic from "../assets/Softgic_Logo_White-scaled.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const adminName = await login(email, password);

    if (adminName) {
      showToast("Sesión iniciada correctamente", "success");
      navigate(`/softgic-access-portal/${encodeURIComponent(adminName)}`);
      return;
    }

    setError("Correo o contraseña incorrectos.");
    showToast("Credenciales inválidas", "error");
    setLoading(false);
  }

  return (
    <main className="login-page">

      {/* Panel izquierdo — marca */}
      <div className="login-brand">
        <img src={brandSoftgic} alt="Softgic" width={200} />
        <div className="login-brand-text">
          <h2>Portal Administrativo</h2>
          <p>Gestiona los casos de uso y éxito de Softgic desde un solo lugar.</p>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="login-form-side">
        <form className="login-card" onSubmit={handleSubmit}>

          <div className="login-card-header">
            <h1>Iniciar sesión</h1>
            <p>Ingresa tus credenciales para continuar</p>
          </div>

          <div className="login-fields">
            <div className="login-field">
              <label htmlFor="login-email">Correo electrónico</label>
              <div className="login-input-wrap">
                <Mail size={16} className="login-input-icon" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="admin@softgic.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="login-password">Contraseña</label>
              <div className="login-input-wrap">
                <Lock size={16} className="login-input-icon" />
                <input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="login-error" role="alert">{error}</div>
          )}

          <button className="login-submit" type="submit" disabled={loading}>
            <LogIn size={16} />
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

        </form>
      </div>

    </main>
  );
}
