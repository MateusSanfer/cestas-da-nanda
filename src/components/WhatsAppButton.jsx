import React from "react";

const WhatsAppButton = () => {
  // Número fictício para exemplo. Substitua pelo real.
  const phoneNumber = "5571988210680";
  const message = encodeURIComponent(
    "Olá! Vim pelo site da Cestas da Nanda e gostaria de tirar uma dúvida."
  );

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
      aria-label="Falar no WhatsApp"
      title="Falar no WhatsApp"
    >
      <i className="bi bi-whatsapp text-3xl"></i>
      {/* Tooltip on hover */}
      <span className="absolute right-full mr-4 bg-white text-charcoal px-4 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Falar com a Nanda
      </span>
    </a>
  );
};

export default WhatsAppButton;
