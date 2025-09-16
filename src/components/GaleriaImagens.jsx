import React from "react";
import "../styles/detalhesCesta.css";

const GaleriaImagens = ({ imagemPrincipal, setImagemPrincipal, imagens, alt }) => {
  console.log('Imagens ',imagemPrincipal)
  console.log(imagemPrincipal.length)
  return (
    <div className="imagens">
      <img
        src={imagemPrincipal}
        alt={alt}
        className="imagem-principal"
      />
      <div className="miniaturas">
        {imagens.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Miniatura ${index}`}
            className="miniatura cursor-pointer"
            onClick={() => setImagemPrincipal(img)}
          />
        ))}
      </div>
    </div>
  );
};

export default GaleriaImagens;
