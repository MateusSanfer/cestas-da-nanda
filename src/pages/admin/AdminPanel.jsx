import React, { useState, useEffect } from "react";
import BasketList from "./BasketList";
import BasketForm from "./BasketForm";
import OrderList from "./OrderList";
import axios from "axios";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("baskets");
  const [baskets, setBaskets] = useState([]);
  const [selectedBasket, setSelectedBasket] = useState(null);

  useEffect(() => {
    if (activeTab === "baskets") {
      fetchBaskets();
    }
  }, [activeTab]);

  const fetchBaskets = async () => {
    try {
      const res = await axios.get("/api/baskets");
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
    <div className="min-h-screen bg-cream font-sans pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8 text-center sm:text-left border-b border-gray-200 pb-6">
          <h1 className="text-4xl font-serif font-bold text-charcoal mb-2">
            Painel Administrativo
          </h1>
          <p className="text-warmGray">
            Gerencie seus produtos e pedidos com facilidade.
          </p>
        </header>

        {/* Tabs - Premium Style */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-4 mb-8">
          <button
            className={`px-6 py-3 rounded-full font-semibold transition-all shadow-sm flex items-center gap-2 ${
              activeTab === "baskets"
                ? "bg-terracotta text-white shadow-md transform -translate-y-0.5"
                : "bg-white text-gray-500 hover:text-terracotta hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("baskets")}
          >
            <i className="bi bi-basket2-fill"></i> Gerenciar Produtos
          </button>
          <button
            className={`px-6 py-3 rounded-full font-semibold transition-all shadow-sm flex items-center gap-2 ${
              activeTab === "orders"
                ? "bg-terracotta text-white shadow-md transform -translate-y-0.5"
                : "bg-white text-gray-500 hover:text-terracotta hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            <i className="bi bi-box-seam-fill"></i> Gerenciar Pedidos
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          {activeTab === "baskets" ? (
            <>
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-6 border-l-4 border-terracotta pl-4">
                {selectedBasket ? "Editar Produto" : "Cadastrar Novo Produto"}
              </h2>

              <BasketForm basket={selectedBasket} onClose={handleFormClose} />

              <div className="mt-12 pt-8 border-t border-gray-100">
                <h2 className="text-2xl font-serif font-bold text-charcoal mb-6 flex items-center justify-between">
                  <span>Todos os Produtos</span>
                  <span className="text-sm font-sans font-normal text-warmGray bg-gray-100 px-3 py-1 rounded-full">
                    {baskets.length} itens
                  </span>
                </h2>
                {baskets.length > 0 ? (
                  <BasketList
                    baskets={baskets}
                    onEdit={handleEdit}
                    onRefresh={fetchBaskets}
                  />
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <i className="bi bi-basket text-4xl mb-3 block"></i>
                    Nenhum produto cadastrado.
                  </div>
                )}
              </div>
            </>
          ) : (
            <OrderList />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
