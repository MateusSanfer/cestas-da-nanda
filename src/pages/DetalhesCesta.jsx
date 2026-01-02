// Imports updated (toast added locally if missing, but it was in previous versions)
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/detalhesCesta.css";
import toast from "react-hot-toast";
import ExtrasAdicionados from "../components/ExtrasAdicionados";
import SeletorExtras from "../components/SeletorExtras";
import GaleriaImagens from "../components/GaleriaImagens";
import ResumoCompra from "../components/ResumoCompra";

const DetalhesCesta = ({ addToCart, baskets }) => {
  const { id } = useParams();
  const [quantidade, setQuantidade] = useState(1);

  // Encontrar a cesta correspondente
  const foundBasket = baskets.find((b) => b.id?.toString() === id);
  const basket = foundBasket || {
    name: "",
    description: "",
    price: 0,
    image: "",
    images: "[]",
    includedItems: "[]",
    availableExtras: "[]",
  };

  // Parse seguro dos campos JSON
  let imagens = [];
  let includedItems = [];
  let availableExtras = [];

  try {
    imagens = Array.isArray(basket.images)
      ? basket.images
      : JSON.parse(basket.images || "[]");
    includedItems = Array.isArray(basket.includedItems)
      ? basket.includedItems
      : JSON.parse(basket.includedItems || "[]");
    availableExtras = Array.isArray(basket.availableExtras)
      ? basket.availableExtras
      : JSON.parse(basket.availableExtras || "[]");
  } catch (e) {
    console.error("Erro ao fazer parse dos dados da cesta", e);
  }

  // Hooks SEMPRE fora de condicional
  const [selectedExtra, setSelectedExtra] = useState(null);
  const [includedExtraItems, setIncludedExtraItems] = useState([]);
  const [imagemPrincipal, setImagemPrincipal] = useState("");

  useEffect(() => {
    if (basket.image) {
      setImagemPrincipal(basket.image);
    }
  }, [basket.image]);

  // Mostrar mensagem se a cesta não for encontrada
  if (!foundBasket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <h2 className="text-4xl font-serif text-terracotta mb-4">
            Produto não encontrado
          </h2>
          <Link
            to="/"
            className="text-gray-600 underline hover:text-terracotta"
          >
            Voltar para a Loja
          </Link>
        </div>
      </div>
    );
  }

  const addExtra = () => {
    if (selectedExtra) {
      const existingExtraIndex = includedExtraItems.findIndex(
        (item) => item.name === selectedExtra.name
      );

      if (existingExtraIndex > -1) {
        const updatedItems = [...includedExtraItems];
        updatedItems[existingExtraIndex].count += 1;
        setIncludedExtraItems(updatedItems);
      } else {
        setIncludedExtraItems([
          ...includedExtraItems,
          { ...selectedExtra, count: 1 },
        ]);
      }
      setSelectedExtra(null);
      toast.success(`${selectedExtra.name} adicionado!`);
    }
  };

  const removeExtra = (index) => {
    const updatedItems = [...includedExtraItems];
    updatedItems.splice(index, 1);
    setIncludedExtraItems(updatedItems);
  };

  const calculateTotal = () => {
    const extrasTotal = includedExtraItems.reduce(
      (total, item) => total + item.price * item.count,
      0
    );
    return (basket.price + extrasTotal) * quantidade;
  };

  const handleAddToCart = () => {
    const parsedIncludedItems = Array.isArray(basket.includedItems)
      ? basket.includedItems
      : JSON.parse(basket.includedItems || "[]");

    const basketWithExtras = {
      ...basket,
      includedItems: parsedIncludedItems,
      includedExtraItems: [...includedExtraItems],
      quantidade,
      total: calculateTotal(),
      uid: Date.now(), // Para diferenciar itens no carrinho
    };
    addToCart(basketWithExtras);
    toast.success("Adicionado ao carrinho com carinho!");
    setIncludedExtraItems([]); // limpa extras
  };

  return (
    <div className="bg-cream min-h-screen font-sans font-light text-charcoal flex flex-col pt-20 md:pt-28">
      {/* Breadcrumb simples */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-6 text-sm text-gray-500">
        <Link to="/" className="hover:text-terracotta transition">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-terracotta font-medium">{basket.name}</span>
      </div>

      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Galeria de Imagens (Esquerda - 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl bg-white relative group">
              <img
                src={imagemPrincipal || null}
                alt={basket.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
            </div>
            <GaleriaImagens
              imagemPrincipal={imagemPrincipal}
              setImagemPrincipal={setImagemPrincipal}
              imagens={imagens}
              alt={basket.name}
            />
          </div>

          {/* Detalhes do Produto (Direita - 5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-8 lg:sticky lg:top-32 h-fit">
            {/* Cabeçalho do Produto */}
            <div className="border-b border-terracotta/20 pb-6">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-charcoal mb-4 leading-tight">
                {basket.name}
              </h1>
              <p className="text-lg text-warmGray leading-relaxed font-light">
                {basket.description}
              </p>
            </div>

            {/* Preço */}
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-gray-500 uppercase tracking-widest font-semibold">
                A partir de
              </span>
              <span className="text-4xl font-serif font-bold text-terracotta">
                R$ {basket.price ? basket.price.toFixed(2) : "0.00"}
              </span>
            </div>

            {/* Itens Inclusos */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-serif font-semibold text-charcoal mb-4 flex items-center gap-2">
                <i className="bi bi-gift text-terracotta"></i>O que vem na
                cesta?
              </h3>
              {includedItems.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600 text-sm">
                  {includedItems.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 p-1.5 hover:bg-cream/50 rounded-lg transition-colors"
                    >
                      <i className="bi bi-check-circle-fill text-green-400 mt-0.5 flex-shrink-0"></i>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm italic">
                  Nenhum item listado.
                </p>
              )}
            </div>

            {/* Personalização */}
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-semibold text-charcoal flex items-center gap-2">
                <i className="bi bi-stars text-yellow-500"></i>
                Personalize seu presente
              </h3>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-400 mb-4">
                  Adicione chocolates, pelúcias ou bebidas.
                </p>
                <SeletorExtras
                  availableExtras={availableExtras}
                  selectedExtra={selectedExtra}
                  setSelectedExtra={setSelectedExtra}
                  addExtra={addExtra}
                />
                <div className="mt-4">
                  <ExtrasAdicionados
                    includedExtraItems={includedExtraItems}
                    removeExtra={removeExtra}
                  />
                </div>
              </div>
            </div>

            {/* Resumo e Ação */}
            <div className="pt-6">
              <ResumoCompra
                quantidade={quantidade}
                setQuantidade={setQuantidade}
                calculateTotal={calculateTotal}
                handleAddToCart={handleAddToCart}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DetalhesCesta;
