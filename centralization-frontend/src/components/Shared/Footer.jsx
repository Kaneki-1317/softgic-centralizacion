import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa6";
import brandSoftgic from "../../assets/Softgic_Logo_White-scaled.png";

export default function Footer() {
  return (
    <footer className="site-footer">

      <div className="footer-inner">

        {/* Logo + tagline */}
        <div className="footer-brand">
          <img src={brandSoftgic} alt="Softgic" width={130} className="footer-logo" />
          <p className="footer-tagline">
            Transformamos organizaciones con innovación, tecnología y talento.
          </p>
        </div>

        {/* Columnas de info */}
        <div className="footer-cols">

          <div className="footer-col">
            <h4 className="footer-col-title">Sabaneta</h4>
            <p>Carrera 48 # 76d Sur – 52</p>
            <p>Mall Vegas Plaza</p>
            <p>(604) 520-8240</p>
            <p>+57 310 4985350</p>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Bogotá</h4>
            <p>Calle 26A # 13 – 97</p>
            <p>Barrio San Diego</p>
            <p>Bulevar Tequendama</p>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Síguenos</h4>
            <div className="footer-social">
              <a href="https://www.facebook.com/softgic/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook /></a>
              <a href="https://www.instagram.com/softgic/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://www.linkedin.com/company/softgic" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
              <a href="https://www.youtube.com/@softgic" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube /></a>
            </div>
          </div>

        </div>

        {/* CTA derecha */}
        <a
          href="https://softgic.co/es/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-cta-right"
        >
          <span className="footer-cta-label">Visitar</span>
          <span className="footer-cta-site">softgic.co</span>
          <div className="footer-cta-line" />
        </a>

      </div>

      {/* Barra inferior */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} All rights reserved. <strong>SOFTGIC</strong>.</p>
      </div>

    </footer>
  );
}
