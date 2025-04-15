import React, { useState } from "react";
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
  const [imagemPrincipal, setImagemPrincipal] = useState(basket.image || "");

  // Mostrar mensagem se a cesta não for encontrada
  if (!foundBasket) {
    return (
      <div className="p-6 text-2xl mt-5 text-center text-red-600">
        Cesta não encontrada.
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
    toast.success("Cesta adicionada ao carrinho com sucesso!");
    setIncludedExtraItems([]); // limpa extras
  };

  return (
    <>
      <div className="detalhes-container">
        {/* Imagens da cesta */}
        <GaleriaImagens
          imagemPrincipal={imagemPrincipal}
          setImagemPrincipal={setImagemPrincipal}
          imagens={imagens}
          alt={basket.name}
        />

        <div className="detalhes">
          <h2 className="titulo">{basket.name}</h2>
          <h3 className="font-bold">Itens Inclusos:</h3>
          <ul>
            {includedItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          {/* Adicionar Itens Extras */}
          <SeletorExtras
            availableExtras={availableExtras}
            selectedExtra={selectedExtra}
            setSelectedExtra={setSelectedExtra}
            addExtra={addExtra}
          />

          {/* Itens Extras Adicionados */}
          <ExtrasAdicionados
            includedExtraItems={includedExtraItems}
            removeExtra={removeExtra}
          />

          {/* Preço e botão adicionar ao carrinho */}
          <ResumoCompra
            quantidade={quantidade}
            setQuantidade={setQuantidade}
            calculateTotal={calculateTotal}
            handleAddToCart={handleAddToCart}
          />
        </div>
      </div>
      <div className="descricao2 bg-gray-100 p-3">
        <h2 className="text-2xl p-1">Descrição:</h2>
        <p className="text-gray-700">{basket.description}</p>
      </div>
      <Footer />
    </>
  );
};

export default DetalhesCesta;
