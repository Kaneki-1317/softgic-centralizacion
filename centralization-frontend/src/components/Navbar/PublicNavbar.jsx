import brandSoftgic from "../../assets/Softgic_Logo_White-scaled.png"
import "../../../src/index.css"
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa6";

function PublicNavbar(){
    return(
        <header className="public-navbar">

            <div className="top-bar">
                <div className="social-links">
                    <a href="https://www.facebook.com/softgic/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook /></a>
                    <a href="https://www.linkedin.com/company/softgic" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
                    <a href="https://www.instagram.com/softgic/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
                    <a href="https://www.youtube.com/channel/UCEVZYSClb1886VZOoW4EKwA" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube /></a>
                </div>

                <div className="gptw-badge">
                    Gran lugar para trabajar
                </div>
            </div>

            <div className="navbar-content">
                <div className="brand">
                    <img src={brandSoftgic} alt="Softgic" width={230} />
                </div>
            </div>

            <div className="hero-section">

                <h1>
                    Nuestros Casos de Uso y Éxito
                </h1>

                <p>
                    Descubre cómo ayudamos a organizaciones a acelerar su
                    transformación digital mediante innovación, tecnología
                    y talento.
                </p>

                <a href="#casos" className="hero-cta">
                    Explorar casos
                </a>
            </div>

        </header>
    );
}
export default PublicNavbar