import React from "react";
import axios from "axios";

const BasketList = ({ baskets, onEdit, onRefresh }) => {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredBaskets = baskets.filter((basket) =>
    basket.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar este produto?")) {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`http://localhost:3001/api/baskets/${id}`, config);
        onRefresh();
      } catch (error) {
        console.error("Erro ao deletar produto:", error);
        // Fallback just in case
        try {
          // Maybe retry with relative path?
          await axios.delete(`/api/baskets/${id}`);
          onRefresh();
        } catch (e) {
          alert("Erro ao deletar produto. Você está logado como admin?");
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="🔍 Buscar produto por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta outline-none transition-all shadow-sm"
        />
        <i className="bi bi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
      </div>

      {filteredBaskets.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <i className="bi bi-emoji-frown text-4xl mb-2 block"></i>
          Nenhum produto encontrado para "{searchTerm}"
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBaskets.map((basket) => (
            <div
              key={basket.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="relative h-48 overflow-hidden bg-gray-100">
                {basket.image ? (
                  <img
                    src={basket.image}
                    alt={basket.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <i className="bi bi-image text-4xl"></i>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-charcoal shadow-sm">
                  R$ {basket.price.toFixed(2)}
                </div>
                {basket.category && (
                  <div className="absolute top-2 left-2 bg-terracotta/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-white shadow-sm capitalize">
                    {basket.category}
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="font-serif font-bold text-charcoal text-lg mb-1 truncate">
                  {basket.name}
                </h3>
                <p className="text-sm text-warmGray mb-4 line-clamp-2 h-10">
                  {basket.description}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(basket)}
                    className="flex-1 py-2 px-4 rounded-lg bg-orange-50 text-terracotta font-semibold hover:bg-orange-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="bi bi-pencil-square"></i> Editar
                  </button>
                  <button
                    onClick={() => handleDelete(basket.id)}
                    className="py-2 px-4 rounded-lg bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    title="Deletar"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BasketList;
