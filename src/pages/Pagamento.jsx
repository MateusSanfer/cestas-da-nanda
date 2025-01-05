import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Pagamento({ cart, setCart }) {
  const [paymentMethod, setPaymentMethod] = useState("");
  const navigate = useNavigate();

  const handlePayment = (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      alert("Por favor, selecione uma forma de pagamento.");
      return;
    }
    alert("Pagamento realizado com sucesso!");
    setCart([]); // Limpa o carrinho
    navigate("/confirmacao"); // Redireciona para a confirmação
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Pagamento</h1>
      <form onSubmit={handlePayment} className="space-y-4">
        <label className="block">
          <span className="font-semibold">Forma de Pagamento:</span>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mt-2 p-2 border rounded"
          >
            <option value="">Selecione...</option>
            <option value="cartao">Cartão de Crédito/Débito</option>
            <option value="pix">PIX</option>
            <option value="boleto">Boleto Bancário</option>
          </select>
        </label>
        <button
          type="submit"
          className="bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600"
        >
          Confirmar Pagamento
        </button>
      </form>
    </div>
  );
}

export default Pagamento;
