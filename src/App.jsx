import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import Home from './pages/Home';
import Sobre from './pages/Sobre';
import Contato from './pages/Contato';
import Pagamento from './pages/Pagamento';
import Login from './pages/Login';

function App() {
  const [cart, setCart] = useState([]); // Gerenciar o estado do carrinho aqui

  // Função para adicionar itens ao carrinho
  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  // Função para remover itens do carrinho
  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

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
        {/* Passa addToCart para Home */}
        <Route 
          path="/" 
          element={<Home addToCart={addToCart} />} 
        />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/pagamento" element={<Pagamento />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
