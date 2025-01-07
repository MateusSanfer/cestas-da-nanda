import React, { useState } from "react";
import CardCesta from "../components/CardCesta"; // Importa o componente CardCesta
import foto from "../assets/images/foto4.jpg";
const Home = ({ addToCart }) => {

  const [searchTerm, setSearchTerm] = useState("");

  const baskets = [
    {
        id: 1,
        name: 'Cesta Café da Manhã',
        description: 'Deliciosa cesta com pães, frutas e café',
        price: 130.00,
        includedItems: [
          '4 Biscoitos salgados',
          '1 Barra de Cereal',
          '1 Bolinho',
          '1 Sachê de café ',
          '2 Geleias ',
          '1 Pão de mel',
          '2 chocolates ',
          '1 Achocolatado',
          '1 Iogurte',
          '1 Fruta',
          '1 Torrada',
          '1 Pão com frios',
          '1 Sucrilhos',
        ],
        availableExtras: [
          { name: 'Caixa em MDF + 1 xícara + 1 Balão', price: 50 },
          { name: '1 Balão', price: 20 }
        ],
        selectedExtras: null,
        includedExtraItems: []
      },
 
    {
        id: 2,
        name: 'Cesta Com Amor',
        description: 'Cesta especial com chocolates e vinho',
        price: 44.99,
        includedItems: [
        'Cesta',
        '1 Mini vinho',
        '1 Taça ',
        '1 Kit Kat',
        'Chocolates',

        ],
        availableExtras: [
          { name: 'Ursinho com tolha de rosto', price: 15 },
        
        ],
        selectedExtras: null,
        includedExtraItems: []
      },
      {
        id: 3,
        name: 'Cesta Gourmet',
        description: 'Seleção de queijos e frios premium',
        price: 194.99,
        includedItems: [
        'Panetone 400g',
        'Vinho 750ml',
        'Taça', 
        'Batata frita',
        'Snacks',
        'Chocolates',
        'Waffers',
        'Barrinha de cereal', 
        'Mix passas',
        'Cappuccino',
        ],
        availableExtras: [
          { name: 'Creme de avelã', price: 14.99},
          { name: 'Mini petisqueira de frios', price: 89.90 }
        ],
        selectedExtras: null,
        includedExtraItems: []
      },
      {
        id: 4,
        name: 'Cesta Fitness',
        description: 'Cesta com alimentos saudaváveis e nutritivos',
        price: 179.90,
        includedItems: [
            'Frutas diversas', 
            '2 Barrinhas de Cereal', 
            'Suco Detox',
            'Whey Protein 500g'
        ],
        availableExtras: [
            {name: 'Shake Proteico', price: 60},
            {name: 'Kit de Vitaminas', price: 80},
        ],
      }
    
  ];


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
    setHighlightedIndex((prevIndex) => (prevIndex - 1 + baskets.length) % baskets.length);
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
              className="mt-2 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition duration-200"
            >
              Adicionar ao Carrinho
            </button>
            <div>
              <img src={foto} alt="" className="foto" />
            </div>
          </div>
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
              <CardCesta
                key={basket.id}
                basket={basket}
                addToCart={addToCart}
              />
            ))
          ) : (
            <p className="text-center col-span-3 text-gray-500">
              Nenhuma cesta encontrada.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
