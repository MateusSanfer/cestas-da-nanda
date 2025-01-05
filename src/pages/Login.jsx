// src/pages/Login.jsx
import React, { useState } from "react";
import { auth } from "../config/firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        try {
            if (isRegistering) {
                await createUserWithEmailAndPassword(auth, email, password);
                alert("Conta criada com sucesso!");
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                alert("Login realizado com sucesso!");
            }
            navigate("/"); // Redireciona para a Home após login
        } catch (error) {
            alert("Erro: " + error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleAuth}
                className="p-8 bg-white rounded-lg shadow-lg max-w-sm w-full"
            >
                <h2 className="text-2xl font-semibold mb-4">
                    {isRegistering ? "Criar Conta" : "Login"}
                </h2>

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
