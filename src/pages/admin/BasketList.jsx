import React from "react";
import axios from "axios";

const BasketList = ({ baskets, onEdit, onRefresh }) => {
  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar esta cesta?")) {
      try {
        await axios.delete(`http://localhost:3001/api/baskets/${id}`);
        onRefresh();
      } catch (error) {
        console.error("Erro ao deletar cesta:", error);
      }
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Cestas cadastradas</h2>
      <ul className="space-y-4">
        {baskets.map((basket) => (
          <li key={basket.id} className="border p-4 rounded shadow-sm">
            <p className="font-semibold">{basket.name}</p>
            <p>{basket.description}</p>
            <p>R$ {basket.price.toFixed(2)}</p>
            <div className="mt-2 space-x-2">
              <button
                onClick={() => onEdit(basket)}
                className="px-3 py-1 bg-yellow-400 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(basket.id)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Deletar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BasketList;
