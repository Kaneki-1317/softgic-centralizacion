import brandSoftgic from "../../assets/Softgic_Logo_White-scaled.png"
import "../../../src/index.css"

function PublicNavbar(){
    return(
        <header className="public-navar">
            <div className="brand">
                <span className="brand-mark"><img src={brandSoftgic} alt="brand" style={{ filter: "brightness(0)" }} width={200}/></span>
            </div>
            <div>
                <h3>pagina de prueba</h3>
            </div>
            <nav>
                <a href="https://softgic.co/es/">Pagina Principal</a>
            </nav>
        </header>
    );
}
export default PublicNavbar