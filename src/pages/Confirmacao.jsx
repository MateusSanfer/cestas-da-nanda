import React from "react";
import { Link } from "react-router-dom";

function Confirmacao() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-green-500 mb-4">
        Compra Finalizada com Sucesso! 🎉
      </h1>
      <p className="text-lg mb-6">Obrigado por comprar na Cestas Da Nanda!</p>
      <Link to="/" className="bg-pink-500 text-white px-6 py-3 rounded-lg">
        Voltar à Página Inicial
      </Link>
    </div>
  );
}

export default Confirmacao;
