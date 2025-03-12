import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from './components/Header';
import Home from './pages/Home';
import Sobre from './pages/Sobre';
import Confirmacao from './pages/Confirmacao';
import Pagamento from './pages/Pagamento';
import Login from './pages/Login';
import DetalhesCesta from "./pages/DetalhesCesta";
import { auth } from "./config/firebaseConfig";
import cesta1 from "./assets/images/cesta1.jpg";
import cesta2 from "./assets/images/cesta2.jpg";
import cesta3 from "./assets/images/cesta3.jpg";
import foto4 from "./assets/images/foto4.jpg";

function App() {
  const [cart, setCart] = useState([]); // Gerenciar o estado do carrinho aqui
  const [user, setUser] = useState(null);

  // Função para adicionar itens ao carrinho
  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  // Função para remover itens do carrinho
  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const [baskets, setBaskets] = useState([
    {
      id: 1,
      name: "Cesta Café da Manhã",
      image: cesta1,
      images: [cesta2, cesta3, foto4],
      description: "Deliciosa cesta com pães, frutas e café. A maioria das pesssoas só aprende as lições da vida, depois que a mão.",
      price: 130.0,
      includedItems: [
        "4 Biscoitos salgados",
        "1 Barra de Cereal",
        "1 Bolinho",
        "1 Sachê de café ",
        "2 Geleias ",
        "1 Pão de mel",
        "2 chocolates ",
        "1 Achocolatado",
        "1 Iogurte",
        "1 Fruta",
        "1 Torrada",
        "1 Pão com frios",
        "1 Sucrilhos",
      ],
      availableExtras: [
        { name: "Caixa em MDF + 1 xícara + 1 Balão", price: 50 },
        { name: "1 Balão", price: 20 },
      ],
      selectedExtras: null,
      includedExtraItems: [],
    },

    {
      id: 2,
      name: "Cesta Com Amor",
      image: cesta2,
      images: [cesta2, cesta3, foto4],
      description: "Cesta especial com chocolates e vinho",
      price: 44.99,
      includedItems: [
        "Cesta",
        "1 Mini vinho",
        "1 Taça ",
        "1 Kit Kat",
        "Chocolates",
      ],
      availableExtras: [{ name: "Ursinho com tolha de rosto", price: 15 }],
      selectedExtras: null,
      includedExtraItems: [],
    },
    {
      id: 3,
      name: "Cesta Gourmet",
      image: cesta3,
      images: [cesta2, cesta3, foto4],
      description: "Seleção de queijos e frios premium",
      price: 194.99,
      includedItems: [
        "Panetone 400g",
        "Vinho 750ml",
        "Taça",
        "Batata frita",
        "Snacks",
        "Chocolates",
        "Waffers",
        "Barrinha de cereal",
        "Mix passas",
        "Cappuccino",
      ],
      availableExtras: [
        { name: "Creme de avelã", price: 14.99 },
        { name: "Mini petisqueira de frios", price: 89.9 },
      ],
      selectedExtras: null,
      includedExtraItems: [],
    },
    {
      id: 4,
      name: "Cesta Fitness",
      image: foto4,
      images: [cesta2, cesta3, foto4],
      description: "Cesta com alimentos saudaváveis e nutritivos",
      price: 179.9,
      includedItems: [
        "Frutas diversas",
        "2 Barrinhas de Cereal",
        "Suco Detox",
        "Whey Protein 500g",
      ],
      availableExtras: [
        { name: "Shake Proteico", price: 60 },
        { name: "Kit de Vitaminas", price: 80 },
      ],
    },
  ]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      {/* Passa as props relacionadas ao carrinho para o Header */}
      <Header
        cart={cart}
        setCart={setCart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Passa addToCart para Home */}
        <Route path="/" element={<Home addToCart={addToCart} baskets={baskets} />} />
        <Route path="/cesta/:slug" element={<DetalhesCesta addToCart={addToCart} baskets={baskets} />} />

        <Route path="/sobre" element={<Sobre />} />
        <Route path="/confirmacao" element={<Confirmacao />} />
        <Route
          path="/pagamento"
          element={user ? <Pagamento cart={cart} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
