import brandSoftgic from "../../assets/Softgic_Logo_White-scaled.png"
import "../../../src/index.css"
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa6";

function PublicNavbar(){
    return(
        <header className="public-navbar">

            <div className="top-bar">
                <div className="social-links">
                    <FaFacebook />
                    <FaInstagram />
                    <FaLinkedin />
                    <FaYoutube />
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