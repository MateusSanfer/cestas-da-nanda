import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getUser } from "../hooks/useAuth";

function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (isRegistering) {
        // REGISTRO
        response = await axios.post("http://localhost:3001/auth/register", {
          name,
          email,
          password,
        });
      } else {
        // LOGIN
        response = await axios.post("http://localhost:3001/auth/login", {
          email,
          password,
        });
      }

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      alert(`${isRegistering ? "Conta criada" : "Login realizado"} com sucesso!`);

      // Redireciona com base no tipo de usuário
      if (user.isAdmin) {
        navigate("/admin");
      } else {
        // aqui você pode adaptar: "/" ou "/checkout"
        navigate("/");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert(error.response?.data?.error || "Erro ao autenticar");
    }
  };

  const user = getUser();
if (user?.isAdmin) {
  // mostra botão do painel admin, por exemplo
}

  return (
    <div className="login min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleAuth}
        className="p-8 bg-white rounded-xl shadow-lg max-w-sm w-full"
      >
        <h2 className="text-2xl font-semibold mb-4">
          {isRegistering ? "Criar Conta" : "Login"}
        </h2>

        {isRegistering && (
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border rounded mb-4"
          />
        )}

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded mb-4"
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          {isRegistering ? "Registrar" : "Entrar"}
        </button>

        <button
          type="button"
          onClick={() => setIsRegistering(!isRegistering)}
          className="mt-4 w-full text-center text-blue-600 underline"
        >
          {isRegistering
            ? "Já tem uma conta? Faça Login"
            : "Não tem conta? Crie uma"}
        </button>
      </form>
    </div>
  );
}

export default Login;
