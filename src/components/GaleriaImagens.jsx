import React from "react";
import "../styles/detalhesCesta.css";

const GaleriaImagens = ({ imagemPrincipal, setImagemPrincipal, imagens, alt }) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 mt-4 custom-scrollbar">
      {imagens.map((img, index) => (
        <div 
            key={index} 
            className={`relative w-20 h-20 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${imagemPrincipal === img ? 'border-terracotta ring-2 ring-terracotta/30' : 'border-transparent hover:border-terracotta/50'}`}
            onClick={() => setImagemPrincipal(img)}
        >
            <img
                src={img || null}
                alt={`Miniatura ${index}`}
                className="w-full h-full object-cover"
            />
        </div>
      ))}
    </div>
  );
};

export default GaleriaImagens;
