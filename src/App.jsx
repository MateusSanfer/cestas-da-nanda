import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Sobre from "./pages/Sobre";
import Confirmacao from "./pages/Confirmacao";
import Pagamento from "./pages/Pagamento";
import Login from "./pages/Login";
import DetalhesCesta from "./pages/DetalhesCesta";
import { v4 as uuidv4 } from "uuid";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPanel from "./pages/admin/AdminPanel";
import MinhaConta from "./pages/client/MinhaConta";

function App() {
  // Load cart from localStorage or default to empty array
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [user, setUser] = useState(null);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Função para comparar os extras
  const areExtrasEqual = (extras1, extras2) => {
    if (extras1.length !== extras2.length) return false;

    const sorted1 = [...extras1].sort((a, b) => a.name.localeCompare(b.name));
    const sorted2 = [...extras2].sort((a, b) => a.name.localeCompare(b.name));

    return sorted1.every(
      (item, index) =>
        item.name === sorted2[index].name &&
        item.price === sorted2[index].price &&
        item.count === sorted2[index].count
    );
  };
  // Função para adicionar ao carrinho
  const addToCart = (newItem) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.id === newItem.id &&
          areExtrasEqual(item.includedExtraItems, newItem.includedExtraItems)
      );

      if (existingIndex !== -1) {
        const updatedCart = [...prevCart];

        // Atualiza a quantidade e recalcula o total corretamente
        const existingItem = updatedCart[existingIndex];
        const novaQuantidade = existingItem.quantidade + newItem.quantidade;
        const precoUnitario =
          (existingItem.total || 0) / (existingItem.quantidade || 1);

        updatedCart[existingIndex] = {
          ...existingItem,
          quantidade: novaQuantidade,
          total: precoUnitario * novaQuantidade,
        };

        return updatedCart;
      } else {
        // Item novo, adiciona com UID
        return [...prevCart, { ...newItem, uid: uuidv4() }];
      }
    });
  };

  // Função para remover itens do carrinho
  const removeFromCart = (uid) => {
    setCart((prevCart) => prevCart.filter((item) => item.uid !== uid));
  };

  const [baskets, setBaskets] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/baskets")
      .then((res) => {
        const basketsFromAPI = res.data.map((basket) => ({
          ...basket,
          selectedExtras: null,
          includedExtraItems: [],
        }));
        setBaskets(basketsFromAPI);
      })
      .catch((err) => console.error("Erro ao buscar cestas:", err));
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      {/* Passa as props relacionadas ao carrinho para o Header */}
      <Header
        user={user}
        cart={cart}
        setCart={setCart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Passa addToCart para Home */}
        <Route
          path="/"
          element={<Home addToCart={addToCart} baskets={baskets} />}
        />
        <Route
          path="/cesta/:id/:slug"
          element={<DetalhesCesta addToCart={addToCart} baskets={baskets} />}
        />

        <Route path="/sobre" element={<Sobre />} />
        <Route path="/confirmacao" element={<Confirmacao />} />
        <Route
          path="/pagamento"
          element={
            <ProtectedRoute>
              <Pagamento cart={cart} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/minha-conta"
          element={
            <ProtectedRoute>
              <MinhaConta />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
