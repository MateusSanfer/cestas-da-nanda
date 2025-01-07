import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebaseConfig";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { auth } from "../config/firebaseConfig";

function Pagamento({ cart }) {
    const [cep, setCep] = useState("");
    const [address, setAddress] = useState({
        rua: "",
        bairro: "",
        cidade: "",
        estado: "",
        numero: "",
    });
    const [paymentMethod, setPaymentMethod] = useState("");
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [boletoCode, setBoletoCode] = useState("");
    const navigate = useNavigate();

    const user = auth.currentUser;

    const fetchAddress = async () => {
        if (cep.length === 8) {
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                const data = response.data;
                if (data.erro) {
                    alert("CEP inválido!");
                    return;
                }
                setAddress({
                    ...address,
                    rua: data.logradouro,
                    bairro: data.bairro,
                    cidade: data.localidade,
                    estado: data.uf,
                });
            } catch (error) {
                alert("Erro ao buscar CEP. Tente novamente.");
            }
        } else {
            alert("Digite um CEP válido com 8 dígitos.");
        }
    };

    const total = cart.reduce((acc, item) => acc + item.price, 0).toFixed(2);

    const saveToFirestore = async () => {
        if (!user) {
            alert("Você precisa estar logado para finalizar a compra.");
            return;
        }

        try {
            await addDoc(collection(db, "Pedidos"), {
                endereco: { cep, ...address },
                pagamento: paymentMethod,
                total: parseFloat(total),
                items: cart,
                usuario: user.uid,
                data: new Date(),
            });
            alert("Pedido salvo com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar no Firestore:", error);
            alert("Erro ao salvar os dados. Tente novamente.");
        }
    };

    const generatePixQrCode = () => {
        const pixData = `00020126...5204000053039865802BR5913Cestas Da Nanda...TXID12345678`;
        const encodedPix = encodeURIComponent(pixData);
        setQrCodeUrl(`https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodedPix}`);
    };

    const generateBoletoCode = () => {
        const dummyCode = "34191.79001 01043.510047 91020.150008 3 89240000001500";
        setBoletoCode(dummyCode);
    };

    const handleOrder = async () => {
        if (!paymentMethod || !cep) {
            alert("Preencha todos os campos antes de finalizar a compra.");
            return;
        }

        try {
            await saveToFirestore();

            if (paymentMethod === "pix") {
                generatePixQrCode();
            } else if (paymentMethod === "boleto") {
                generateBoletoCode();
            } else {
                alert("Pedido realizado com sucesso!");
                navigate("/confirmacao");
            }
        } catch (error) {
            alert("Erro ao processar o pedido: " + error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-2xl font-semibold mb-6">Finalizar Pedido</h2>

                {/* CEP */}
                <div className="mb-4">
                    <label className="block font-medium">CEP</label>
                    <input
                        type="text"
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                        maxLength="8"
                        className="w-full p-2 border rounded"
                    />
                    <button
                        type="button"
                        onClick={fetchAddress}
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Buscar Endereço
                    </button>
                </div>

                {/* Endereço */}
                <div className="mb-4">
                    <label className="block font-medium">Rua</label>
                    <input
                        type="text"
                        value={address.rua}
                        readOnly
                        className="w-full p-2 border rounded bg-gray-100"
                    />

                    {/* Adicione campo para número */}
                    <label className="block font-medium mt-2">Número</label>
                    <input
                        type="text"
                        value={address.numero}
                        onChange={(e) => setAddress({ ...address, numero: e.target.value })}
                        className="w-full p-2 border rounded"
                    />

                    <label className="block font-medium mt-2">Bairro</label>
                    <input
                        type="text"
                        value={address.bairro}
                        readOnly
                        className="w-full p-2 border rounded bg-gray-100"
                    />

                    <label className="block font-medium mt-2">Cidade</label>
                    <input
                        type="text"
                        value={address.cidade}
                        readOnly
                        className="w-full p-2 border rounded bg-gray-100"
                    />

                    <label className="block font-medium mt-2">Estado</label>
                    <input
                        type="text"
                        value={address.estado}
                        readOnly
                        className="w-full p-2 border rounded bg-gray-100"
                    />
                </div>

                {/* Forma de Pagamento */}
                <div className="mb-4">
                    <label className="block font-medium">Forma de Pagamento</label>
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Selecione</option>
                        <option value="pix">Pix</option>
                        <option value="boleto">Boleto</option>
                        <option value="cartao">Cartão de Crédito</option>
                    </select>
                </div>

                {/* Resumo do Pedido */}
                <div className="mb-4 font-semibold text-lg">
                    Total: R$ {total}
                </div>

                {/* Botão Finalizar */}
                <button
                    type="button"
                    onClick={handleOrder}
                    className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                >
                    Finalizar Compra
                </button>

                {/* Exibição de QR Code ou Boleto */}
                {paymentMethod === "pix" && qrCodeUrl && (
                    <div className="mt-4">
                        <h3 className="text-lg font-medium">QR Code para Pix</h3>
                        <img src={qrCodeUrl} alt="QR Code Pix" />
                    </div>
                )}

                {paymentMethod === "boleto" && boletoCode && (
                    <div className="mt-4">
                        <h3 className="text-lg font-medium">Código de Barras para Boleto</h3>
                        <p>{boletoCode}</p>
                    </div>
                )}
            </div>
        </div>
    );

}
export default Pagamento;
