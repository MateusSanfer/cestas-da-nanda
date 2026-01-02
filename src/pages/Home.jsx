import React, { useState } from "react";
import CardCesta from "../components/CardCesta"; // Importa o componente CardCesta
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const Home = ({ addToCart, baskets }) => {
  // console.log("Baskets recebidas:", baskets)
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("todos");

  const generateSlug = (name, id) => {
    const normalized = name
      .normalize("NFD") // Decompor caracteres acentuados
      .replace(/[\u0300-\u036f]/g, "") // Remover sinais diacríticos (acentos)
      .toLowerCase()
      .replace(/\s+/g, "-"); // Substituir espaços por hífens

    return `${id}/${normalized}`;
  };

  const filteredBaskets = baskets.filter(
    (basket) => {
      const matchSearch = basket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      basket.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCategory = activeCategory === 'todos' || 
                            (basket.category && basket.category.toLowerCase() === activeCategory.toLowerCase()) ||
                            // Fallback for older items without category (treat as 'cesta' if filtering for cesta, or just show in todos)
                            (!basket.category && activeCategory === 'cesta');

      return matchSearch && matchCategory;
    }
  );

  const [highlightedIndex, setHighlightedIndex] = useState(0);
  // ...

  return (
    <div className="bg-cream min-h-screen font-sans">
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Hero Section */}
        <div className="text-center py-16 md:py-24">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-charcoal mb-4">
                Presentes com Amor e Sofisticação
            </h1>
            <p className="text-lg md:text-xl text-warmGray max-w-2xl mx-auto mb-8 font-light">
                Cestas personalizadas, flores e lembranças únicas para tornar cada momento inesquecível.
            </p>
            
            {/* Search Bar - Premium Style */}
            <div className="max-w-xl mx-auto relative shadow-lg rounded-full overflow-hidden flex items-center bg-white border border-gray-100 focus-within:ring-2 focus-within:ring-terracotta transition-all">
                 <input
                    type="text"
                    placeholder="O que você procura hoje?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-4 pl-6 pr-12 text-gray-700 outline-none placeholder-gray-400 bg-transparent"
                />
                 <button className="absolute right-2 p-2 bg-terracotta text-white rounded-full hover:bg-opacity-90 transition-all">
                    <i className="bi bi-search text-lg"></i>
                 </button>
            </div>
        </div>

        {/* Categories Section */}
        <div className="mb-12 text-center">
            <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-warmGray">
                {['todos', 'cesta', 'flor', 'lembrancinha', 'kit', 'personalizados'].map((cat) => (
                    <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-2 rounded-full border transition-all capitalize ${
                            activeCategory === cat 
                            ? 'bg-terracotta text-white border-terracotta shadow-md' 
                            : 'bg-white border-gray-200 hover:border-terracotta hover:text-terracotta'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>

        {/* Featured Section */}
        <div className="mb-8 flex items-end justify-between border-b border-gray-100 pb-4">
            <h2 className="text-3xl font-serif font-bold text-charcoal">Destaques</h2>
            <Link to="/catalogo" className="text-terracotta font-medium hover:underline hidden sm:block">Ver todos os produtos</Link>
        </div>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredBaskets.length > 0 ? (
            filteredBaskets.map((basket) => (
              <div key={basket.id} className="transform hover:-translate-y-1 transition-transform duration-300">
                    <CardCesta basket={basket} addToCart={addToCart} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
                <div className="text-6xl text-gray-200 mb-4"><i className="bi bi-basket"></i></div>
                <p className="text-xl text-gray-500">Nenhum produto encontrado com esse nome.</p>
                <button onClick={() => setSearchTerm('')} className="mt-4 text-terracotta font-semibold hover:underline">Limpar busca</button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
