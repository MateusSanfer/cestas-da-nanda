import React, { useState } from "react";

const CardCesta = ({ basket, addToCart }) => {
  const [selectedExtra, setSelectedExtra] = useState(null);
  const { includedItems = [], availableExtras = [] } = basket;
  const [includedExtraItems, setIncludedExtraItems] = useState(
    basket.includedExtraItems || []
  );
 
  const addExtra = () => {
    if (selectedExtra) {
      const existingExtraIndex = includedExtraItems.findIndex(
        (item) => item.name === selectedExtra.name
      );

      if (existingExtraIndex > -1) {
        const updatedItems = [...includedExtraItems];
        updatedItems[existingExtraIndex].count += 1;
        setIncludedExtraItems(updatedItems);
      } else {
        setIncludedExtraItems([
          ...includedExtraItems,
          { ...selectedExtra, count: 1 },
        ]);
      }
      setSelectedExtra(null);
    }
  };

  const removeExtra = (index) => {
    const updatedItems = [...includedExtraItems];
    updatedItems.splice(index, 1);
    setIncludedExtraItems(updatedItems);
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
    };
    
    addToCart(basketWithExtras);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="h-48 bg-red-200 rounded-lg mb-4 flex items-center justify-center">
        {/* Placeholder para imagem */}
        <svg
          className="h-24 w-24 text-green-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold mb-2">{basket.name}</h3>
      <p className="text-gray-600 mb-2">{basket.description}</p>
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Itens Inclusos:</h4>
        <ul className="list-disc list-inside text-sm text-gray-600">
      {includedItems.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>

    <select
      value={selectedExtra ? JSON.stringify(selectedExtra) :""}
      onChange={(e) =>
        setSelectedExtra(JSON.parse(e.target.value || null))
      }
      className="border px-2 py-1 rounded w-full"
    >
      <option value="">Selecione um extra</option>
      {availableExtras.map((extra, index) => (
        <option key={index} value={JSON.stringify(extra)}>
          {extra.name} - R$ {extra.price.toFixed(2)}
        </option>
      ))}
    </select>
        <button
          onClick={addExtra}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 mt-2"
        >
          Adicionar Extra
        </button>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Itens Extras Adicionados:</h4>
        <ul className="list-disc list-inside text-sm text-gray-600">
          {includedExtraItems.map((extra, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>
                {extra.name} ({extra.count})
              </span>
              <span className="text-gray-600">
                R$ {(extra.price * extra.count).toFixed(2)}
              </span>
              <button
                onClick={() => removeExtra(index)}
                className="text-red-500 ml-4"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-between items-center">
        <span className="total font-bold">
          Total: R$ {calculateTotal().toFixed(2)}
        </span>
        <button
          onClick={handleAddToCart}
          className="botaoAdd text-white px-4 py-2 rounded-lg transition duration-200"
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
};

export default CardCesta;
