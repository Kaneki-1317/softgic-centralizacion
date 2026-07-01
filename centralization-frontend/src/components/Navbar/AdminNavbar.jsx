import brandSoftgic from "../../assets/Softgic_Logo_White-scaled.png";

function parseJwt(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export default function AdminNavbar() {
  const token = localStorage.getItem("token");
  const payload = parseJwt(token);
  const adminName = payload?.name ?? "Administrador";

  return (
    <header className="admin-navbar">
      <div className="admin-navbar-content">
        <div className="brand">
          <img src={brandSoftgic} alt="Softgic" width={160} />
        </div>

        <div className="admin-greeting">
          <span className="admin-greeting-label">Bienvenido,</span>
          <span className="admin-greeting-name">{adminName}</span>
        </div>
      </div>
    </header>
  );
}
