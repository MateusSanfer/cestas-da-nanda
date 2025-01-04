import React, { useState } from "react";
import { Link } from "react-router-dom";

function Header() {
    const [cartCount, setCartCount] = useState(0);
    const [showCart, setShowCart] = useState(false);

    return (
        <header>
            <nav className="shadow-lg bg-black text-white">
                <div className="max-w-6xl mx-auto px-2">
                    {/* Flex container */}
                    <div className="flex justify-between items-center py-4">
                        
                        {/* Logo */}
                        <div className="flex items-center">
                            <img src="/images/logo.png" alt="Logo Cestas Da Nanda" className="h-10 w-10" />
                            <span className="text-xl font-bold ml-2">Cestas Da Nanda</span>
                        </div>

                        {/* Links de Navegação */}
                        <div className="flex space-x-6 items-center">
                        <Link to="/" className="hover:text-yellow-400">Home</Link>
                        <Link to="/sobre" className="hover:text-yellow-400">Sobre</Link>
                        <Link to="/contato" className="hover:text-yellow-400">Contato</Link>
                        <Link to="/pagamento" className="hover:text-yellow-400">Pagamento</Link>
                        <Link to="/login" className="hover:text-yellow-400">Login</Link>

                            {/* Ícone do Carrinho */}
                            <button 
                                onClick={() => setShowCart(!showCart)}
                                className="relative p-2 focus:outline-none"
                            >
                                <svg
                                    className="h-9 w-9 text-gray-500"
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
                                {/* Exibe o número de itens no carrinho apenas se for maior que 0 */}
                                {cartCount > 0 && (
                                    <span className="cart-badge absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;
