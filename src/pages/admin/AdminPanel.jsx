import React, { useState, useEffect } from "react";
import BasketList from "./BasketList";
import BasketForm from "./BasketForm";
import axios from "axios";

const AdminPanel = () => {
  const [baskets, setBaskets] = useState([]);
  const [selectedBasket, setSelectedBasket] = useState(null);

  useEffect(() => {
    fetchBaskets();
  }, []);

  const fetchBaskets = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/baskets");
      setBaskets(res.data);
    } catch (error) {
      console.error("Erro ao buscar cestas:", error);
    }
  };

  const handleEdit = (basket) => {
    setSelectedBasket(basket);
  };

  const handleFormClose = () => {
    setSelectedBasket(null);
    fetchBaskets(); // atualiza lista após edição
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Painel Administrativo</h1>
      <BasketForm basket={selectedBasket} onClose={handleFormClose} />
      {baskets.length > 0 ? (
        <BasketList
          baskets={baskets}
          onEdit={handleEdit}
          onRefresh={fetchBaskets}
        />
      ) : (
        <p>Carregando cestas...</p>
      )}
    </div>
  );
};

export default AdminPanel;
