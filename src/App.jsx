import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from './components/Header';
import Home from './pages/Home';
import Sobre from './pages/Sobre';
import Confirmacao from './pages/Confirmacao';
import Pagamento from './pages/Pagamento';
import Login from './pages/Login';
import { auth } from "./config/firebaseConfig";

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
        {/* Passa addToCart para Home */}
        <Route 
          path="/" 
          element={<Home addToCart={addToCart} />} 
        />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/confirmacao" element={<Confirmacao />} />
        <Route path="/pagamento" element={user ? <Pagamento cart={cart} /> : <Navigate to="/login" />} />
           

        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
