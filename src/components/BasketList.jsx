import React from "react";

const BasketList = ({ baskets = [], onEdit, onRefresh }) => {
  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta cesta?")) {
      try {
        await fetch(`http://localhost:3001/api/baskets/${id}`, {
          method: "DELETE",
        });
        onRefresh(); // Atualiza a lista após exclusão
      } catch (error) {
        console.error("Erro ao excluir cesta:", error);
      }
    }
  };

  return (
    <ul className="space-y-4 mt-4">
      {baskets.map((basket) => (
        <li
          key={basket.id}
          className="border p-4 rounded shadow flex justify-between items-center"
        >
          <div>
            <h3 className="text-xl font-semibold">{basket.name}</h3>
            <p className="text-gray-600">{basket.description}</p>
            <p className="text-green-600 font-bold">R$ {basket.price}</p>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => onEdit(basket)}
              className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Editar
            </button>
            <button
              onClick={() => handleDelete(basket.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Excluir
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default BasketList;
