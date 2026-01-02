import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import SeletorQuantidade from "./SeletorQuantidade";

function Header({ user,cart = [], setCart }) {
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
      <header className="fixed w-full z-50">
        <nav className="shadow-sm bg-cream/90 backdrop-blur-md text-charcoal transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <Link
                  to="/"
                  >
                <img
                  src={logo}
                  alt="Logo Cestas Da Nanda"
                  className="h-12 w-12 rounded-full border-2 border-terracotta object-cover"
                />
                
                <span className="text-2xl font-serif font-bold text-terracotta tracking-tight">Cestas Da Nanda</span>
                </Link>
              </div>

              {/* Links de Navegação */}
              <div className="flex space-x-8 items-center">
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
                  Sobre
                </Link>
                {user && (
                    <Link
                    to="/minha-conta"
                    className="hover:text-terracotta transition-colors font-medium flex items-center gap-2 text-sm uppercase tracking-wide"
                    >
                    <i className="bi bi-person-lines-fill text-lg"></i> Minha Conta
                    </Link>
                )}
                {user ? (
                   <button
                    onClick={() => {
                        localStorage.removeItem('user');
                        localStorage.removeItem('token'); // Assuming token is stored
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

                {/* Link do Admin apenas se for admin */}
                {user?.isAdmin && (
                  <Link
                    to="/admin"
                    className="text-terracotta font-bold hover:text-charcoal transition-colors flex items-center gap-2 text-sm uppercase tracking-wide"
                  >
                    <i className="bi bi-gear-fill"></i> Admin
                  </Link>
                )}

                {/* Botão do Carrinho */}
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
                 <h2 className="text-2xl font-serif font-bold text-charcoal">Seu Carrinho</h2>
                 <button onClick={toggleCart} className="text-gray-400 hover:text-terracotta transition-colors">
                    <i className="bi bi-x-lg text-xl"></i>
                 </button>
              </div>
              
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-warmGray opacity-60">
                    <i className="bi bi-basket text-6xl mb-4"></i>
                    <p className="text-lg">Seu carrinho está vazio</p>
                    <button onClick={toggleCart} className="mt-4 text-terracotta underline text-sm hover:text-charcoal">
                        Continuar comprando
                    </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {cart.map((item) => (
                      <div key={item.uid} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative group hover:border-terracotta/30 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-serif font-semibold text-charcoal pr-6">{item.name}</h3>
                             <button
                                onClick={() => removeFromCart(item)}
                                className="text-gray-400 hover:text-red-500 transition-colors absolute top-4 right-4"
                                title="Remover item"
                                >
                                <i className="bi bi-trash"></i>
                            </button>
                        </div>
                        
                        <p className="text-xs text-warmGray uppercase tracking-wider font-semibold mb-1">Itens Inclusos:</p>
                        <ul className="text-sm text-gray-600 mb-3 space-y-1 pl-1">
                          {item.includedItems.map((includedItem, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <span className="text-terracotta">•</span> {includedItem}
                            </li>
                          ))}
                          {item.includedExtraItems && item.includedExtraItems.map((extraItem, index) => (
                            <li key={`extra-${index}`} className="flex items-start gap-2 text-terracotta font-medium">
                               <span>+</span> {extraItem.name} ({extraItem.count})
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
                            R$ {(item.price + calcularTotalExtras(item.includedExtraItems)).toFixed(2)}
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
