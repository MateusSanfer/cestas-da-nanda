import React from "react";
import { Link, useLocation } from "react-router-dom";

function Confirmacao() {
  const location = useLocation();
  const { orderId, total, paymentMethod } = location.state || {}; // Retrieve passed state

  // Dummy PIX Key for MVP
  const pixKey = "00.000.000/0001-00";
  const whatsappNumber = "5571988210680"; // Updated per user request

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    alert("Chave Pix copiada!");
  };

  const generateWhatsappMessage = () => {
    const msg = `Olá! Fiz o pedido #${orderId} no valor de R$ ${total}. Segue o comprovante de pagamento.`;
    return encodeURIComponent(msg);
  };

  // If accessed directly without state, show generic message
  if (!orderId) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-cream p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            <i className="bi bi-bag-check"></i>
          </div>
          <h1 className="text-2xl font-serif font-bold text-charcoal mb-4">
            Pedido Recebido!
          </h1>
          <p className="text-warmGray mb-6">
            Seu pedido está sendo processado com muito carinho.
          </p>
          <Link
            to="/"
            className="inline-block bg-terracotta text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition"
          >
            Voltar para Loja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8 md:p-12 border border-gray-100 relative overflow-hidden">
        {/* Confetti or decoration could go here */}

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-500 rounded-full mb-6 animate-bounce-slow">
            <i className="bi bi-check-lg text-4xl"></i>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-2">
            Pedido #{orderId} Realizado!
          </h1>
          <p className="text-warmGray text-lg">
            Obrigado por escolher a Nanda Ateliê.
          </p>
        </div>

        {/* Payment Instructions */}
        {paymentMethod === "pix" && (
          <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-bold text-terracotta mb-4 flex items-center gap-2">
              <i className="bi bi-qr-code"></i> Pagamento via Pix
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Para confirmar seu pedido, faça a transferência de{" "}
              <strong>R$ {total}</strong> para a chave abaixo e envie o
              comprovante.
            </p>

            <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg p-3 mb-4">
              <span className="font-mono text-gray-700 select-all">
                {pixKey}
              </span>
              <button
                onClick={handleCopyPix}
                className="text-terracotta font-bold hover:underline text-sm uppercase"
              >
                Copiar
              </button>
            </div>

            <div className="flex justify-center">
              {/* QR Code Generated via API */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${pixKey}&color=d75440`}
                alt="QR Code Pix"
                className="w-32 h-32 mb-4 border-2 border-terracotta rounded-lg p-1"
              />
            </div>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${generateWhatsappMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-green-500 text-white text-center font-bold py-3 rounded-xl hover:bg-green-600 transition shadow-md flex items-center justify-center gap-2"
            >
              <i className="bi bi-whatsapp"></i> Enviar Comprovante no Zap
            </a>
          </div>
        )}

        {/* Other Payment Methods */}
        {paymentMethod !== "pix" && (
          <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-100 text-center">
            <p className="text-blue-800 font-medium">
              Seu pagamento via {paymentMethod} está sendo processado. Você
              receberá uma confirmação em breve.
            </p>
          </div>
        )}

        <div className="text-center">
          <Link to="/" className="text-terracotta hover:underline font-medium">
            Voltar para a Página Inicial
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Confirmacao;
