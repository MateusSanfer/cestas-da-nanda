import React from "react";
import SeletorQuantidade from "./SeletorQuantidade";
import "../styles/detalhesCesta.css";

const ResumoCompra = ({
  quantidade,
  setQuantidade,
  calculateTotal,
  handleAddToCart,
}) => {
  return (
    <div className="flex items-center justify-between mt-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
      <div className="flex flex-col">
          <span className="text-sm text-warmGray">Total estimado</span>
          <span className="text-3xl font-serif font-bold text-terracotta">R$ {calculateTotal().toFixed(2)}</span>
      </div>

      <div className="flex items-center gap-4">
        <SeletorQuantidade
          quantidade={quantidade}
          setQuantidade={setQuantidade}
        />
        <button 
            onClick={handleAddToCart} 
            className="flex items-center gap-2 bg-terracotta text-white font-semibold py-3 px-6 rounded-full hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <i className="bi bi-cart-fill"></i>
          <span>Adicionar</span>
        </button>
      </div>
    </div>
  );
};

export default ResumoCompra;
