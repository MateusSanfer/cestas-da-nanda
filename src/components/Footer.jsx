import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="rodape">
      <p>Todos os Direitos Reservados @ {currentYear}</p>
      <div className="redes">
        <p>Nossas Redes Sociais</p>
        <div className="icones">
          <button className="text-terracotta hover:text-charcoal transition-colors">
            <i className="bi bi-instagram"></i>
          </button>
          <button className="text-terracotta hover:text-charcoal transition-colors">
            <i className="bi bi-whatsapp"></i>
          </button>
          <a
            href="https://www.linkedin.com/in/mateus-sanfer/"
            target="_blank"
            rel="noreferrer"
            className="text-terracotta hover:text-charcoal transition-colors"
          >
            <i className="bi bi-linkedin"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
