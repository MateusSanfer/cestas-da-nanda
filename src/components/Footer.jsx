import React from "react";

const Footer = () => {
  return (
    <div className="rodape">
      <p>Todos os Direitos Reservados @ 2024</p>
      <div className="redes">
        <p>Nossas Redes Sociais</p>
        <div className="icones">
          <a href="#"><i className="bi bi-instagram"></i></a>
          <a href="#"><i className="bi bi-whatsapp"></i></a>
          <a href="https://www.linkedin.com/in/mateus-sanfer/" target="_blank"><i className="bi bi-linkedin"></i></a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
