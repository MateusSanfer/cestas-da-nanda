// src/pages/Login.jsx
import React, { useState } from "react";
import { auth, db } from "../config/firebaseConfig"; // Importa o Firestore
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Firestore para salvar os dados
import { useNavigate } from "react-router-dom";

function Login() {
    const [name, setName] = useState(""); // Campo para o nome
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        try {
            if (isRegistering) {
                // Cria um novo usuário
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Salva os dados do usuário no Firestore
                await setDoc(doc(db, "Clientes", user.uid), {
                    nome: name,
                    email: email,
                    createdAt: new Date(),
                });

                alert("Conta criada com sucesso!");
            } else {
                // Faz login do usuário
                await signInWithEmailAndPassword(auth, email, password);
                alert("Login realizado com sucesso!");
            }
            navigate("/"); // Redireciona para a Home após login ou registro
        } catch (error) {
            alert("Erro: " + error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
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
