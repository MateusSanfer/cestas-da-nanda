import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;

      if (isRegistering) {
        // REGISTRO
        response = await axios.post("/auth/register", {
          name,
          email,
          password,
        });
      } else {
        // LOGIN
        response = await axios.post("/auth/login", {
          email,
          password,
        });
      }

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // alert(`${isRegistering ? "Conta criada" : "Login realizado"} com sucesso!`);
      // Using a simpler feedback mechanism or rely on redirect

      // Redireciona com base no tipo de usuário
      if (user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert(
        error.response?.data?.error || "Erro ao autenticar. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Side - Image (Desktop Only) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-cream">
        <div className="absolute inset-0 bg-black/20 z-10" />
        {/* Using one of the Unsplash images typical for gift baskets/cozy vibe */}
        <img
          src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2040&auto=format&fit=crop"
          alt="Presentes"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-16 left-16 z-20 text-white max-w-lg">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-serif font-bold mb-4 leading-tight"
          >
            A arte de presentear com alma.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl opacity-90 font-light"
          >
            Crie memórias inesquecíveis com nossas cestas personalizadas para
            cada momento.
          </motion.p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        <Link
          to="/"
          className="absolute top-8 right-8 text-charcoal/50 hover:text-terracotta flex items-center gap-2 transition-colors font-medium text-sm"
        >
          Voltar para Loja <i className="bi bi-arrow-right"></i>
        </Link>

        <div className="w-full max-w-sm space-y-8">
          {/* Header Toggle */}
          <div className="text-center">
            <img
              src="/logo-512x512.png"
              alt="Logo"
              className="h-16 w-auto mx-auto mb-6 opacity-80"
            />{" "}
            {/* Placeholder if logo exists, or remove */}
            <h1 className="text-3xl font-serif font-bold text-charcoal mb-2">
              {isRegistering ? "Criar sua conta" : "Bem-vindo de volta"}
            </h1>
            <p className="text-warmGray text-sm">
              {isRegistering
                ? "Preencha seus dados para começar a experiência."
                : "Por favor, insira seus dados para entrar."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-5">
            <AnimatePresence mode="wait">
              {isRegistering && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Maria Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isRegistering}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta outline-none transition-all placeholder-gray-400"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                E-mail
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta outline-none transition-all placeholder-gray-400"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider">
                  Senha
                </label>
                {!isRegistering && (
                  <a
                    href="#"
                    className="text-xs text-terracotta hover:underline"
                  >
                    Esqueceu a senha?
                  </a>
                )}
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta outline-none transition-all placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-terracotta text-white font-bold py-4 rounded-xl shadow-lg hover:bg-opacity-90 hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <i className="bi bi-arrow-repeat animate-spin"></i>}
              {isRegistering ? "Criar Conta" : "Entrar"}
            </button>
          </form>

          {/* Footer Toggle */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-warmGray text-sm">
              {isRegistering ? "Já tem uma conta?" : "Ainda não tem conta?"}
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="ml-2 font-bold text-terracotta hover:underline outline-none"
              >
                {isRegistering ? "Fazer Login" : "Cadastre-se"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
