import React, { useState } from "react";
import CardCesta from "../components/CardCesta";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import HeroCarousel from "../components/HeroCarousel";
import Testimonials from "../components/Testimonials";
import WhatsAppButton from "../components/WhatsAppButton";

const Home = ({ addToCart, baskets }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("todos");

  const filteredBaskets = baskets.filter((basket) => {
    const matchSearch =
      basket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      basket.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory =
      activeCategory === "todos" ||
      (basket.category &&
        basket.category.toLowerCase() === activeCategory.toLowerCase()) ||
      (!basket.category && activeCategory === "cesta");

    return matchSearch && matchCategory;
  });

  // Logic for "Best Sellers" (Taking first 4 items for now as mock)
  const bestSellers = baskets.slice(0, 4);

  return (
    <div className="bg-cream min-h-screen font-sans">
      <HeroCarousel />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Search Bar - Premium Style (Moved below Hero) */}
        <div className="relative -mt-8 md:-mt-12 mb-16 z-20">
          <div className="max-w-xl mx-auto relative shadow-2xl rounded-full overflow-hidden flex items-center bg-white border border-gray-100 focus-within:ring-2 focus-within:ring-terracotta transition-all transform hover:scale-105 duration-300">
            <input
              type="text"
              placeholder="O que você procura hoje?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-4 pl-8 pr-12 text-gray-700 outline-none placeholder-gray-400 bg-transparent text-lg"
            />
            <button className="absolute right-2 p-3 bg-terracotta text-white rounded-full hover:bg-opacity-90 transition-all">
              <i className="bi bi-search text-xl"></i>
            </button>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-16 text-center">
          <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">
            Navegue por Categorias
          </h2>
          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-warmGray">
            {[
              "todos",
              "cesta",
              "flor",
              "lembrancinha",
              "kit",
              "personalizados",
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-full border transition-all capitalize hover:shadow-md ${
                  activeCategory === cat
                    ? "bg-terracotta text-white border-terracotta shadow-md scale-105"
                    : "bg-white border-gray-200 hover:border-terracotta hover:text-terracotta"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Mais Vendidos (Best Sellers) */}
        {activeCategory === "todos" && !searchTerm && (
          <div className="mb-20">
            <div className="flex items-end justify-between border-b border-gray-100 pb-4 mb-8">
              <div className="flex items-center gap-3">
                <span className="bg-terracotta/10 text-terracotta p-2 rounded-lg">
                  <i className="bi bi-trophy-fill text-xl"></i>
                </span>
                <h2 className="text-3xl font-serif font-bold text-charcoal">
                  Mais Vendidos
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {bestSellers.map((basket) => (
                <div
                  key={basket.id}
                  className="transform hover:-translate-y-2 transition-transform duration-300"
                >
                  <CardCesta basket={basket} addToCart={addToCart} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Catalog / Search Results */}
        <div id="catalogo" className="mb-16">
          <div className="flex items-end justify-between border-b border-gray-100 pb-4 mb-8">
            <h2 className="text-3xl font-serif font-bold text-charcoal">
              {searchTerm
                ? `Resultados para "${searchTerm}"`
                : "Novidades e Destaques"}
            </h2>
            {!searchTerm && (
              <Link
                to="/catalogo"
                className="text-terracotta font-medium hover:underline hidden sm:block"
              >
                Ver todos os produtos
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredBaskets.length > 0 ? (
              filteredBaskets.map((basket) => (
                <div
                  key={basket.id}
                  className="transform hover:-translate-y-1 transition-transform duration-300"
                >
                  <CardCesta basket={basket} addToCart={addToCart} />
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <div className="text-6xl text-gray-200 mb-4">
                  <i className="bi bi-basket"></i>
                </div>
                <p className="text-xl text-gray-500">
                  Nenhum produto encontrado com esse nome.
                </p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-4 text-terracotta font-semibold hover:underline"
                >
                  Limpar busca
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Testimonials />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Home;
