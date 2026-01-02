import React, { useState } from "react";
import { Link } from "react-router-dom";

const CardCesta = ({ basket, addToCart }) => {
  const [includedExtraItems] = useState(basket.includedExtraItems || []);

  const generateSlug = (name, id) => {
    const normalized = name
      .normalize("NFD") // Decompor caracteres acentuados
      .replace(/[\u0300-\u036f]/g, "") // Remover sinais diacríticos (acentos)
      .toLowerCase()
      .replace(/\s+/g, "-"); // Substituir espaços por hífens

    return `${id}/${normalized}`;
  };

  const calculateTotal = () => {
    const extrasTotal = includedExtraItems.reduce(
      (total, item) => total + item.price * item.count,
      0
    );
    return basket.price + extrasTotal;
  };

  const handleAddToCart = () => {
    const basketWithExtras = {
      ...basket,
      includedExtraItems: [...includedExtraItems],
      total: calculateTotal(),
      quantidade: 1,
    };
    addToCart(basketWithExtras);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-5 border border-transparent hover:border-gray-100">
      <Link
        to={`/cesta/${generateSlug(basket.name, basket.id)}`}
        className="block"
      >
        <div className="h-56 bg-cream rounded-xl mb-5 flex items-center justify-center overflow-hidden relative group">
          <img
            src={basket.image || null}
            alt={basket.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <h3 className="text-xl font-serif font-bold mb-2 text-charcoal group-hover:text-terracotta transition-colors">
          {basket.name}
        </h3>
      </Link>
      <p className="descricao text-warmGray text-sm mb-4 line-clamp-2">
        {basket.description}
      </p>
      <span className="text-terracotta font-bold text-lg block mb-4">
        R$ {basket.price.toFixed(2)}
      </span>

      <div className="flex flex-col gap-3 mt-auto">
        <button
          onClick={handleAddToCart}
          className="w-full bg-terracotta text-white font-medium py-3 rounded-full hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Adicionar ao Carrinho
        </button>
        <Link
          to={`/cesta/${generateSlug(basket.name, basket.id)}`}
          className="text-center"
        >
          <span className="text-terracotta text-sm font-semibold hover:underline">
            Ver detalhes
          </span>
        </Link>
      </div>
    </div>
  );
};

export default CardCesta;
