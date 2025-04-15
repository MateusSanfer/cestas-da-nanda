import React, { useState } from "react";
import CardCesta from "../components/CardCesta"; // Importa o componente CardCesta
import foto from "../assets/images/foto4.jpg";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const Home = ({ addToCart, baskets }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const generateSlug = (name, id) => {
    const normalized = name
      .normalize("NFD") // Decompor caracteres acentuados
      .replace(/[\u0300-\u036f]/g, "") // Remover sinais diacríticos (acentos)
      .toLowerCase()
      .replace(/\s+/g, "-"); // Substituir espaços por hífens
  
    return `${id}/${normalized}`;
  };
  
  const filteredBaskets = baskets.filter(
    (basket) =>
      basket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      basket.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const nextBasket = () => {
    setHighlightedIndex((prevIndex) => (prevIndex + 1) % baskets.length);
  };
  const prevBasket = () => {
    setHighlightedIndex(
      (prevIndex) => (prevIndex - 1 + baskets.length) % baskets.length
    );
  };

  return (
    <div className="fundo min-h-screen">
      <main className="max-w-6xl mx-auto p-4">
        <div className="flex justify-between items-center mt-3 py-4">
          <h1 className="text-2xl font-bold m-0 p-2">Cestas de Presente</h1>
          <div className="div-search flex gap-2">
            <input
              type="text"
              placeholder="Buscar cestas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar p-2 border rounded"
            />
            <button>
              <i className="bi bi-search"></i>
            </button>
          </div>
        </div>

        {/* Carrossel de Cesta em Destaque */}
        <div className="max-w-6x1 mx-auto px-4 my-6 ">
        {baskets.length > 0 && (
  <div className="highlighted-basket p-4 rounded-lg shadow-md bg-white text-center flex justify-between items-center">
    <div className="text-center flex justify-between items-center p-4 gap-5">
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Cesta em Destaque: {baskets[highlightedIndex].name}
        </h3>
        <p>{baskets[highlightedIndex].description}</p>
        <p className="text-lg font-bold mt-2">
          R$ {baskets[highlightedIndex].price.toFixed(2)}
        </p>
      </div>
    </div>
    <button
      onClick={() => addToCart(baskets[highlightedIndex])}
      className="botaoAdd mt-2 text-white px-4 py-2 rounded-lg transition duration-200"
    >
      Adicionar ao Carrinho
    </button>
    <div>
      <img src={foto} alt="" className="foto" />
    </div>
  </div>
)}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={prevBasket}
              className="text-pink-500 text-lg font-bold"
            >
              {"<"}
            </button>
            <button
              onClick={nextBasket}
              className="text-pink-500 text-lg font-bold"
            >
              {">"}
            </button>
          </div>
        </div>

        {/* Exibição das Cestas Filtradas */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBaskets.length > 0 ? (
            filteredBaskets.map((basket) => (
              <Link
                to={`/cesta/${generateSlug(basket.name, basket.id)}`}
                key={basket.id} 
              >
                <CardCesta basket={basket} addToCart={addToCart} />
              </Link>
            ))
          ) : (
            <p className="text-center col-span-3 text-gray-500">
              Nenhuma cesta encontrada.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
