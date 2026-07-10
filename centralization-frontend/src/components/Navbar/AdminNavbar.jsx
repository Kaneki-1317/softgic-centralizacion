import brandSoftgic from "../../assets/Softgic_Logo_White-scaled.png";
import { useAuth } from "../../context/AuthContext";

export default function AdminNavbar() {
  const { adminName } = useAuth();

  return (
    <header className="admin-navbar">
      <div className="admin-navbar-content">
        <div className="brand">
          <img src={brandSoftgic} alt="Softgic" width={160} />
        </div>

        <div className="admin-greeting">
          <span className="admin-greeting-label">Bienvenido,</span>
          <span className="admin-greeting-name">{adminName ?? "Administrador"}</span>
        </div>
      </div>
    </header>
  );
}
