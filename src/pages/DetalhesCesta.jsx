import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
      <div className="p-10 text-2xl mt-5 text-center text-terracotta font-serif">
        Produto não encontrado.
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
    <div className="bg-cream min-h-screen font-sans flex flex-col pt-24">
        <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* Galeria de Imagens (Esquerda) */}
                <div className="space-y-4">
                    <div className="aspect-square rounded-2xl overflow-hidden shadow-sm bg-white border border-gray-100 p-2">
                            <img 
                                src={imagemPrincipal || null} 
                                alt={basket.name} 
                                className="w-full h-full object-cover rounded-xl"
                            />
                    </div>
                     <GaleriaImagens
                        imagemPrincipal={imagemPrincipal}
                        setImagemPrincipal={setImagemPrincipal}
                        imagens={imagens}
                        alt={basket.name}
                    />
                </div>

                {/* Detalhes do Produto (Direita) */}
                <div className="flex flex-col space-y-8">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-charcoal mb-4">{basket.name}</h1>
                        <p className="text-lg text-warmGray leading-relaxed">{basket.description}</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
                        <h3 className="text-lg font-serif font-semibold text-terracotta mb-4 border-b border-gray-100 pb-2">
                            O que acompanha este presente?
                        </h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-charcoal">
                            {includedItems.map((item, index) => (
                            <li key={index} className="flex items-center gap-2">
                                <i className="bi bi-check-circle-fill text-green-400 text-xs"></i> {item}
                            </li>
                            ))}
                        </ul>
                    </div>

                    {/* Personalização */}
                    <div className="space-y-4">
                         <h3 className="text-lg font-serif font-semibold text-charcoal">Personalize seu presente</h3>
                         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
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
                     <div className="pt-6 border-t border-gray-200">
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
