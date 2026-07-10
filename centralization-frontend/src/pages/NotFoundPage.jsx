import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

import PublicNavbar from "../components/Navbar/PublicNavbar";
import Footer from "../components/Shared/Footer";

export default function NotFoundPage() {
  return (
    <>
      <PublicNavbar />

      <main className="public-layout">
        <div className="empty-state">
          <AlertTriangle size={52} strokeWidth={1.3} />
          <h3>Página no encontrada</h3>
          <p>La página que buscas no existe o fue movida.</p>
          <Link to="/" className="ghost-button">Volver al inicio</Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
