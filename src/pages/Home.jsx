// Exemplo: pages/Home.jsx
import React, { useState } from "react";


const Home= () => {
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const baskets = [
    {
      id: "1",
      name: "Cesta Româtica",
      description: "Cesta Especial com chocolates e vinho",
      price: 199.90,
      includedItems: ['Chocolate', 'Vinho', 'Flores'],
      avaliableExtras:  [
        {name: "Urso de Pelúcia", price: 50},
        {name: "Vinho Premium", price: 100},
      ]
    }
  ];
  const addToCart = (basket) => {
    setCart([...cart, basket]);
  };
  const removeFromCart = (index) => {
    const updateCart = [...cart];
    updateCart.splice(index, 1);
    setCart(updateCart);
  };
  return (


    <div className="bg-gray-100 min-h-screen">
  <main className="max-w-6xl mx-auto p-4">
  <div className="flex justify-between items-center mt-3 py-4">
      <h1 className="text-2xl font-bold m-0 p-2">Cestas de Presente</h1>
      <div className="div-search">
      <input
          type="text"
          placeholder="Buscar cestas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar p-2 border rounded"
      />

      <button><i className="bi bi-search"></i></button>
      </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {baskets.map(basket => (
          <div key={basket.id} className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold">{basket.name}</h3>
              <p>{basket.description}</p>
              <p className="text-lg font-bold mt-2">R$ {basket.price.toFixed(2)}</p>
              <button
                  onClick={() => addToCart(basket)}
                  className="mt-2 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
              >
                  Adicionar ao Carrinho
              </button>
          </div>
      ))}
  </div>

  {showCart && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end">
          <div className="bg-white w-96 p-6">
              <h2 className="text-2xl font-bold mb-4">Carrinho</h2>
              {cart.length === 0 ? (
                  <p>Seu carrinho está vazio</p>
              ) : (
                  cart.map((item, index) => (
                      <div key={index} className="p-4 border-b">
                          <h3 className="font-semibold">{item.name}</h3>
                          <button
                              onClick={() => removeFromCart(index)}
                              className="text-red-500 mt-2"
                          >
                              Remover
                          </button>
                      </div>
                  ))
              )}
              <button
                  onClick={() => setShowCart(false)}
                  className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
              >
                  Fechar
              </button>
          </div>
      </div>
  )}
</main>
</div>
);
}

export default Home;
