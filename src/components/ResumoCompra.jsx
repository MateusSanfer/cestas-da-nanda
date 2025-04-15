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
    <div className="preco-carrinho">
      <span className="preco">R$ {calculateTotal().toFixed(2)}</span>

      <div className="preco-carrinho-quantidade-carrinho">
        <SeletorQuantidade
          quantidade={quantidade}
          setQuantidade={setQuantidade}
        />
        <button onClick={handleAddToCart} className="botao-carrinho">
          <i className="bi bi-cart"></i> Adicionar ao carrinho
        </button>
      </div>
    </div>
  );
};

export default ResumoCompra;
