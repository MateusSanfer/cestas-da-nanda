import React, { useState } from "react";
import { Link } from "react-router-dom";

const CardCesta = ({ basket, addToCart }) => {
  const [includedExtraItems, setIncludedExtraItems] = useState(
    basket.includedExtraItems || []
  );

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
    };
    addToCart(basketWithExtras);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="h-48 bg-red-200 rounded-lg mb-4 flex items-center justify-center">
        {/* Placeholder para imagem */}
        <img
          src={basket.image}
          alt={basket.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <h3 className="text-lg font-semibold mb-2">{basket.name}</h3>
      <p className="descricao text-gray-600 mb-2">{basket.description}</p>
      <span className="text-green-600 font-bold">
        R$ {basket.price.toFixed(2)}
      </span>

      <div className="flex justify-between mt-4">
        <Link to={`/cesta/${basket.id}`}>
          <button className=" verMais bg-blue-500 text-white px-2 py-2 rounded-lg hover:bg-blue-600 transition duration-200 ">
            Ver mais detalhes
          </button>
        </Link>
        <button
          onClick={handleAddToCart}
          className="botaoAdd text-white px-2 py-2 rounded-lg transition duration-200"
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
};

export default CardCesta;
