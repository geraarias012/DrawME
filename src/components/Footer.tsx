import "../styles/Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer mt-auto py-5">
      <div className="container text-center text-md-start px-3">
        <div className="row gy-4">
          {/* Logo y nombre */}
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="footer-title">DRAWME</h5>
            <p className="footer-subtitle">by Sebastian & Gerardo</p>
            <p className="footer-subtitle small">Retratos generados por IA.</p>
          </div>

          {/* Recursos */}
          <div className="col-md-4 mb-4 mb-md-0">
            <h6 className="footer-heading">RECURSOS</h6>
            <ul className="list-unstyled">
              <li>
                <a
                  href="https://www.kaggle.com/datasets/jessicali9530/celeba-dataset"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Dataset de entrenamiento
                </a>
              </li>
              <li>
                <a href="#">Documentación</a>
              </li>
              <li>
                <Link to="/Generados">Retratos generados con DrawMe</Link>
              </li>
            </ul>
          </div>

          {/* Conectemos */}
          <div className="col-md-4">
            <h6 className="footer-heading">CONECTEMOS</h6>
            <ul className="list-unstyled">
              <li>
                <a href="#">sromana1801@alumno.ipn.mx</a>
              </li>
              <li>
                <a href="#">gariasm2101@alumno.ipn.mx</a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="footer-line mt-4" />

        <div className="row">
          <div className="col text-center">
            <p className="footer-copy small">
              © 2025 DrawME · Todos los derechos reservados ·
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
