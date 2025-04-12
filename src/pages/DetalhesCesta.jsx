import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/detalhesCesta.css";
import SeletorQuantidade from "../components/SeletorQuantidade";

const DetalhesCesta = ({ addToCart, baskets }) => {
  const { id, slug } = useParams();
  console.log("Slug recebido:", slug); // Teste no console
  
  // Extrai apenas o ID (primeira parte antes da "/")
  console.log("ID extraído:", id); // Teste no console
  
  const [quantidade, setQuantidade] = useState(1);
  
  // Buscar a cesta pelo ID
  const basket = baskets.find((b) => b.id.toString() === id);

  const [selectedExtra, setSelectedExtra] = useState(null);
  const [includedExtraItems, setIncludedExtraItems] = useState(
    basket?.includedExtraItems || []
  );
  const [imagemPrincipal, setImagemPrincipal] = useState(basket.image);

  if (!basket) {
    return <div className="p-6 text-2xl mt-5">Cesta não encontrada.</div>; //Alterar isso para que fique visivel
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
    return (basket.price + extrasTotal)* quantidade;
  };

  const handleAddToCart = () => {
    const basketWithExtras = {
      ...basket,
      includedExtraItems: [...includedExtraItems],
      quantidade,
      total: calculateTotal(),
    };
    addToCart(basketWithExtras);
    // alterar isso para uma função de notificação
    alert("Adicionado ao carrinho");
  };

  return (
    <>
      <div className="detalhes-container">
        {/* Imagens da cesta */}
        <div className="imagens">
          <img
            src={imagemPrincipal}
            alt={basket.name}
            className="imagem-principal"
          />
          <div className="miniaturas">
            {(basket.images || []).map((img, index) => (
              <img
                key={index}
                src={img}
                alt="Miniatura"
                className="miniatura cursor-pointer"
                onClick={() => setImagemPrincipal(img)} // Troca a imagem ao clicar
              />
            ))}
          </div>
        </div>

        <div className="detalhes">
          <h2 className="titulo">{basket.name}</h2>
          <h3 className="font-bold">Itens Inclusos:</h3>
          <ul>
            {basket.includedItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          {/* Adicionar Itens Extras */}
          <label>Adicionar Itens Extras:</label>
          <select
            value={selectedExtra ? JSON.stringify(selectedExtra) : ""}
            onChange={(e) =>
              setSelectedExtra(JSON.parse(e.target.value || null))
            }
            className="select-extra"
          >
            <option value="">Selecione um extra</option>
            {basket.availableExtras.map((extra, index) => (
              <option key={index} value={JSON.stringify(extra)}>
                {extra.name} - R$ {extra.price.toFixed(2)}
              </option>
            ))}
          </select>
          <button onClick={addExtra} className="botao-extra">
            Adicionar
          </button>

          {/* Itens Extras Adicionados */}
          <h3 className="m-2">Itens Extras Adicionados:</h3>
          <ul className="lista-extras">
            {includedExtraItems.map((extra, index) => (
              <li key={index} className="extra-item">
                <span>
                  {extra.name} ({extra.count})
                </span>
                <span>R$ {(extra.price * extra.count).toFixed(2)}</span>
                <button
                  onClick={() => removeExtra(index)}
                  className="remover-extra"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
            
          {/* Preço e botão adicionar ao carrinho */}
          <div className="preco-carrinho">
            <span className="preco">R$ {calculateTotal().toFixed(2)}</span>
            
            <div className="preco-carrinho-quantidade-carrinho">
              <SeletorQuantidade quantidade={quantidade} setQuantidade={setQuantidade} />
              <button onClick={handleAddToCart} className="botao-carrinho">
                <i className="bi bi-cart"></i> Adicionar ao carrinho
              </button>
            </div>
          </div>
        </div>
      </div>
        <div className="descricao2 bg-gray-100 p-3">
          <h2 className="text-2xl p-1">Descrição:</h2>
          <p className="text-gray-700">{basket.description} Lore Lorem Lorem Lorem ipsum dolor sit amet consectetur, adipisicing elit. Totam earum fuga minus officiis? Animi mollitia alias molestias dolor deleniti, molestiae corrupti inventore libero pariatur ipsa tempore error aliquid hic dolorem? ipsum dolor, sit amet consectetur adipisicing elit. Consequuntur quia, asperiores ab quasi beatae a nobis voluptatem soluta eaque maiores laboriosam enim reiciendis hic expedita sapiente! Esse corrupti ea iusto. ipsum dolor sit amet consectetur adipisicing elit. Repellendus ut vitae officiis sint enim, nostrum laboriosam asperiores minima, dolores eveniet delectus amet alias laudantium cumque possimus earum nisi hic adipisci?</p>
        </div>
      <Footer />
    </>
  );
};

export default DetalhesCesta;
