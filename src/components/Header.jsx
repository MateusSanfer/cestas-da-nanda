import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import SeletorQuantidade from "./SeletorQuantidade";

function Header({ cart = [], setCart }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

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
    return includedExtraItems.reduce((sum, extra) => sum + extra.price * extra.count, 0);
  };

  const checkout = () => {
    if (cart.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }
    
    // Calcula o total com os itens adicionais
    const cartTotal = cart.reduce((total, item) => {
      const extrasTotal = calcularTotalExtras(item.includedExtraItems);

      return total + (item.price + extrasTotal) * item.quantidade;
    }, 0);
  
    // Redireciona para a página de pagamento passando o total correto
    navigate("/pagamento", { state: { cartTotal } });
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
      <header>
        <nav className="shadow-lg bg-black text-white">
          <div className="max-w-6xl mx-auto px-2">
            <div className="flex justify-between items-center py-4">
              {/* Logo */}
              <div className="flex items-center">
                <img
                  src={logo}
                  alt="Logo Cestas Da Nanda"
                  className="h-10 w-10"
                />
                <span className="text-2xl font-bold ml-2">Cestas Da Nanda</span>
              </div>

              {/* Links de Navegação */}
              <div className="flex space-x-6 items-center">
                <Link to="/" className="hover:text-yellow-400 flex items-center gap-1">
                <i className="bi bi-house text-2xl "></i> Home
                </Link>
                <Link to="/sobre" className="hover:text-yellow-400 flex items-center gap-1">
                  Sobre
                </Link>
                <Link to="/pagamento" className="hover:text-yellow-400 flex items-center gap-1">
                <i className="bi bi-wallet2 text-2xl"></i> Pagamento
                </Link>
                <Link to="/login" className="hover:text-yellow-400 flex items-center gap-1">
                <i className="bi bi-box-arrow-in-left text-2xl"></i> Login
                </Link>

                {/* Botão do Carrinho */}
                <button
                  onClick={toggleCart}
                  className="relative p-2 focus:outline-none"
                >
                  <svg
                    className="h-9 w-9 text-gray-500 "
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {cart.length > 0 && (
                    <span className="cart-badge absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                      {cart.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Modal do Carrinho */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-end"
          onClick={toggleCart}
        >
          <div
            className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Carrinho</h2>
              {cart.length === 0 ? (
                <div className="text-gray-500">Seu carrinho está vazio</div>
              ) : (
                <div>
                  {cart.map((item) => (
                    <div key={item.uid} className="mb-4 p-4 border rounded-lg">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        Itens Inclusos:
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-600 mb-2">
                        {item.includedItems.map((includedItem, index) => (
                          <li key={index}>{includedItem}</li>
                        ))}
                        {item.includedExtraItems.map((extraItem, index) => (
                          <li key={index}>
                            {extraItem.name} ({extraItem.count})
                          </li>
                        ))}
                      </ul>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-gray-600">
                          R$ {(item.price + calcularTotalExtras(item.includedExtraItems)).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item)}
                          className="text-red-500"
                        >
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                      <SeletorQuantidade quantidade={item.quantidade} setQuantidade={(novaQuantidade) => atualizarCarrinho(item.uid, novaQuantidade)} />
                    </div>
                  ))}
                  <div className="mt-4 border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold">Total:</span>
                      <span className="text-xl font-bold">
                        R$ {cartTotal.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={checkout}
                      className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition duration-200"
                    >
                      Finalizar Pedido
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
