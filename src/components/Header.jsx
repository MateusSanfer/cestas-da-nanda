import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import SeletorQuantidade from "./SeletorQuantidade";
import axios from "axios";
import toast from "react-hot-toast";

function Header({ user, cart = [], setCart }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Notification Logic
  const [lastOrderId, setLastOrderId] = useState(null);

  useEffect(() => {
    // Only run for admins
    if (user && user.isAdmin) {
      const checkNewOrders = async () => {
        try {
          const response = await axios.get("/api/orders");
          const orders = response.data;

          if (orders.length > 0) {
            const latestOrder = orders[0]; // Assuming sorted DESC

            // On first load, just set the ID, don't notify
            if (lastOrderId === null) {
              setLastOrderId(latestOrder.id);
              return;
            }

            // If ID changed and is larger (Novelty check)
            if (latestOrder.id > lastOrderId) {
              // Play Sound
              const audio = new Audio(
                "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
              );
              audio.play().catch((e) => console.log("click needed for sound"));

              // Show Toast
              toast(
                (t) => (
                  <div
                    onClick={() => {
                      toast.dismiss(t.id);
                      navigate("/admin");
                    }}
                    className="cursor-pointer"
                  >
                    <p className="font-bold">
                      🔔 Novo Pedido #{latestOrder.id}. Bora lá!
                    </p>
                    <p className="text-sm">R$ {latestOrder.total}</p>
                  </div>
                ),
                {
                  duration: 8000,
                  icon: "💰",
                  style: { border: "2px solid #D75440" },
                }
              );

              setLastOrderId(latestOrder.id);
            }
          }
        } catch (error) {
          console.error("Polling error", error);
        }
      };

      // Poll every 10 seconds (faster for testing)
      const interval = setInterval(checkNewOrders, 20000);
      return () => clearInterval(interval);
    }
  }, [user, lastOrderId, navigate]);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    setIsMenuOpen(false); // Close menu when opening cart
  };

  const closeMenu = () => setIsMenuOpen(false);

  const cartTotal = cart.reduce((total, item) => {
    const extrasTotal = item.includedExtraItems
      ? item.includedExtraItems.reduce(
          (sum, extra) => sum + extra.price * extra.count,
          0
        )
      : 0;

    return total + (item.price + extrasTotal) * item.quantidade;
  }, 0);

  const removeFromCart = (item) => {
    const updatedCart = cart.filter((cartItem) => cartItem.uid !== item.uid);
    setCart(updatedCart);
  };

  const calcularTotalExtras = (includedExtraItems = []) => {
    return includedExtraItems.reduce(
      (sum, extra) => sum + extra.price * extra.count,
      0
    );
  };

  const checkout = () => {
    if (cart.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    const cartTotal = cart.reduce((total, item) => {
      const extrasTotal = calcularTotalExtras(item.includedExtraItems);
      return total + (item.price + extrasTotal) * item.quantidade;
    }, 0);

    navigate("/pagamento", { state: { cartTotal } });
    setIsCartOpen(false);
  };

  const atualizarCarrinho = (uid, novaQuantidade) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.uid === uid ? { ...item, quantidade: novaQuantidade } : item
      )
    );
  };

  return (
    <>
      <header className="fixed w-full z-50">
        <nav className="shadow-sm bg-cream/90 backdrop-blur-md text-charcoal transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              {/* Logo */}
              <Link to="/" onClick={closeMenu}>
                <div className="flex items-center gap-3">
                  <img
                    src={logo}
                    alt="Logo Nanda Ateliê"
                    className="h-12 w-12 rounded-full border-2 border-terracotta object-cover"
                  />
                  <span className="text-xl md:text-2xl font-serif font-bold text-terracotta tracking-tight">
                    Nanda Ateliê
                  </span>
                </div>
              </Link>

              {/* Hamburger Button (Mobile) */}
              <button
                className="md:hidden text-charcoal focus:outline-none p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <i
                  className={`bi bi-${isMenuOpen ? "x-lg" : "list"} text-3xl`}
                ></i>
              </button>

              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-8 items-center">
                <Link
                  to="/"
                  className="hover:text-terracotta transition-colors font-medium flex items-center gap-2 text-sm uppercase tracking-wide"
                >
                  <i className="bi bi-house text-lg"></i> Home
                </Link>
                <Link
                  to="/sobre"
                  className="hover:text-terracotta transition-colors font-medium flex items-center gap-2 text-sm uppercase tracking-wide"
                >
                  <i className="bi bi-info-circle"></i> Sobre
                </Link>
                {user && (
                  <Link
                    to="/minha-conta"
                    className="hover:text-terracotta transition-colors font-medium flex items-center gap-2 text-sm uppercase tracking-wide"
                  >
                    <i className="bi bi-person-lines-fill text-lg"></i> Minha
                    Conta
                  </Link>
                )}
                {user ? (
                  <button
                    onClick={() => {
                      localStorage.removeItem("user");
                      localStorage.removeItem("token");
                      window.location.reload();
                    }}
                    className="hover:text-terracotta transition-colors font-medium flex items-center gap-2 text-sm uppercase tracking-wide"
                  >
                    <i className="bi bi-box-arrow-right text-lg"></i> Sair
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="hover:text-terracotta transition-colors font-medium flex items-center gap-2 text-sm uppercase tracking-wide"
                  >
                    <i className="bi bi-person text-lg"></i> Login
                  </Link>
                )}

                {user?.isAdmin && (
                  <Link
                    to="/admin"
                    className="text-terracotta font-bold hover:text-charcoal transition-colors flex items-center gap-2 text-sm uppercase tracking-wide"
                  >
                    <i className="bi bi-gear-fill"></i> Admin
                  </Link>
                )}

                <button
                  onClick={toggleCart}
                  className="relative p-2 text-charcoal hover:text-terracotta transition-colors"
                >
                  <i className="bi bi-bag text-2xl"></i>
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-terracotta text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-cream">
                      {cart.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in-down shadow-lg absolute w-full left-0 top-full">
              <div className="flex flex-col px-4 py-4 space-y-4">
                <Link
                  to="/"
                  onClick={closeMenu}
                  className="text-lg font-medium text-charcoal hover:text-terracotta flex items-center gap-3 border-b border-gray-50 pb-2"
                >
                  <i className="bi bi-house"></i> Home
                </Link>
                <Link
                  to="/sobre"
                  onClick={closeMenu}
                  className="text-lg font-medium text-charcoal hover:text-terracotta flex items-center gap-3 border-b border-gray-50 pb-2"
                >
                  <i className="bi bi-info-circle"></i> Sobre
                </Link>

                <button
                  onClick={() => {
                    toggleCart();
                  }}
                  className="text-lg font-medium text-charcoal hover:text-terracotta flex items-center gap-3 border-b border-gray-50 pb-2"
                >
                  <i className="bi bi-bag"></i> Carrinho ({cart.length})
                </button>

                {user ? (
                  <>
                    <Link
                      to="/minha-conta"
                      onClick={closeMenu}
                      className="text-lg font-medium text-terracotta flex items-center gap-3 border-b border-gray-50 pb-2"
                    >
                      <i className="bi bi-person-circle"></i> Minha Conta
                    </Link>
                    {user.isAdmin && (
                      <Link
                        to="/admin"
                        onClick={closeMenu}
                        className="text-lg font-medium text-charcoal hover:text-terracotta flex items-center gap-3 border-b border-gray-50 pb-2"
                      >
                        <i className="bi bi-gear-fill"></i> Painel Admin
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        localStorage.removeItem("user");
                        localStorage.removeItem("token");
                        window.location.reload();
                      }}
                      className="text-lg font-medium text-red-500 hover:text-red-700 flex items-center gap-3 pt-2"
                    >
                      <i className="bi bi-box-arrow-right"></i> Sair
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="bg-terracotta text-white text-center py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-sm"
                  >
                    Entrar / Cadastrar
                  </Link>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Modal do Carrinho */}
      {/* Modal do Carrinho */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-charcoal/30 backdrop-blur-sm z-50 flex justify-end transition-opacity"
          onClick={toggleCart}
        >
          <div
            className="absolute right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl overflow-y-auto transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-bold text-charcoal">
                  Seu Carrinho
                </h2>
                <button
                  onClick={toggleCart}
                  className="text-gray-400 hover:text-terracotta transition-colors"
                >
                  <i className="bi bi-x-lg text-xl"></i>
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-warmGray opacity-60">
                  <i className="bi bi-basket text-6xl mb-4"></i>
                  <p className="text-lg">Seu carrinho está vazio</p>
                  <button
                    onClick={toggleCart}
                    className="mt-4 text-terracotta underline text-sm hover:text-charcoal"
                  >
                    Continuar comprando
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {cart.map((item) => (
                      <div
                        key={item.uid}
                        className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative group hover:border-terracotta/30 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-serif font-semibold text-charcoal pr-6">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item)}
                            className="text-gray-400 hover:text-red-500 transition-colors absolute top-4 right-4"
                            title="Remover item"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>

                        <p className="text-xs text-warmGray uppercase tracking-wider font-semibold mb-1">
                          Itens Inclusos:
                        </p>
                        <ul className="text-sm text-gray-600 mb-3 space-y-1 pl-1">
                          {(Array.isArray(item.includedItems)
                            ? item.includedItems
                            : typeof item.includedItems === "string"
                            ? JSON.parse(item.includedItems || "[]")
                            : []
                          ).map((includedItem, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-terracotta">•</span>{" "}
                              {includedItem}
                            </li>
                          ))}
                          {item.includedExtraItems &&
                            item.includedExtraItems.map((extraItem, index) => (
                              <li
                                key={`extra-${index}`}
                                className="flex items-start gap-2 text-terracotta font-medium"
                              >
                                <span>+</span> {extraItem.name} (
                                {extraItem.count})
                              </li>
                            ))}
                        </ul>

                        <div className="flex justify-between items-end mt-4 pt-3 border-t border-gray-200">
                          <SeletorQuantidade
                            quantidade={item.quantidade}
                            setQuantidade={(novaQuantidade) =>
                              atualizarCarrinho(item.uid, novaQuantidade)
                            }
                          />
                          <p className="font-bold text-lg text-terracotta">
                            R${" "}
                            {(
                              item.price +
                              calcularTotalExtras(item.includedExtraItems)
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto pt-6 border-t border-gray-100 bg-white">
                    <div className="flex justify-between items-center mb-4 text-charcoal">
                      <span className="font-medium">Subtotal</span>
                      <span className="text-2xl font-serif font-bold">
                        R$ {cartTotal.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={checkout}
                      className="w-full bg-terracotta text-white font-bold py-4 rounded-full hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 flex justify-center items-center gap-2"
                    >
                      <span>Finalizar Pedido</span>
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
