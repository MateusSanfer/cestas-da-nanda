import React, { useState } from "react";
import { useParams } from "react-router-dom";

const DetalhesCesta = ({ addToCart, baskets }) => {
  const { id } = useParams();
  const basketId = parseInt(id.split("-")[0]); // Pega só o número antes do "-"
const basket = baskets.find((b) => b.id === basketId);


  const [selectedExtra, setSelectedExtra] = useState(null);
  const [includedExtraItems, setIncludedExtraItems] = useState(basket.includedExtraItems || []);

  const addExtra = () => {
    if (selectedExtra) {
      const existingExtraIndex = includedExtraItems.findIndex((item) => item.name === selectedExtra.name);

      if (existingExtraIndex > -1) {
        const updatedItems = [...includedExtraItems];
        updatedItems[existingExtraIndex].count += 1;
        setIncludedExtraItems(updatedItems);
      } else {
        setIncludedExtraItems([...includedExtraItems, { ...selectedExtra, count: 1 }]);
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
    const extrasTotal = includedExtraItems.reduce((total, item) => total + item.price * item.count, 0);
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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{basket.name}</h2>
      <p className="text-gray-700">{basket.description}</p>
      <h3 className="text-lg font-semibold mt-4">Itens Inclusos:</h3>
      <ul className="list-disc list-inside">
        {basket.includedItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <select
        value={selectedExtra ? JSON.stringify(selectedExtra) : ""}
        onChange={(e) => setSelectedExtra(JSON.parse(e.target.value || null))}
        className="border px-2 py-1 rounded w-full mt-2"
      >
        <option value="">Selecione um extra</option>
        {basket.availableExtras.map((extra, index) => (
          <option key={index} value={JSON.stringify(extra)}>
            {extra.name} - R$ {extra.price.toFixed(2)}
          </option>
        ))}
      </select>
      <button onClick={addExtra} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-2">
        Adicionar Extra
      </button>

      <h3 className="text-lg font-semibold mt-4">Itens Extras Adicionados:</h3>
      <ul className="list-disc list-inside text-sm text-gray-600">
        {includedExtraItems.map((extra, index) => (
          <li key={index} className="flex justify-between items-center">
            <span>
              {extra.name} ({extra.count})
            </span>
            <span className="text-gray-600">R$ {(extra.price * extra.count).toFixed(2)}</span>
            <button onClick={() => removeExtra(index)} className="text-red-500 ml-4">
              Remover
            </button>
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center mt-4">
        <span className="total font-bold">Total: R$ {calculateTotal().toFixed(2)}</span>
        <button onClick={handleAddToCart} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
};

export default DetalhesCesta;
