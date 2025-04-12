// src/pages/Pagamento.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Pagamento({ cart }) {
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState({
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const navigate = useNavigate();

  // Função para buscar o endereço pelo CEP usando a API do ViaCEP
  const fetchAddress = async () => {
    if (cep.length === 8) {
      try {
        const response = await axios.get(
          `https://viacep.com.br/ws/${cep}/json/`
        );
        const data = response.data;
        if (data.erro) {
          alert("CEP inválido!");
          return;
        }
        setAddress({
          rua: data.logradouro,
          numero: data.numero,
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

  // Calcular o total do carrinho
  const total = cart
    .reduce((acc, item) => {
      // Calcula o total dos extras e multiplica pela quantidade
      const extrasTotal = item.includedExtraItems
        ? item.includedExtraItems.reduce(
            (sum, extra) => sum + extra.price * extra.count,
            0
          )
        : 0;

      return acc + (item.price + extrasTotal) * item.quantidade;
    }, 0)
    .toFixed(2);

  // Função para finalizar o pedido
  const handleOrder = () => {
    if (!paymentMethod || !cep) {
      alert("Preencha todos os campos antes de finalizar a compra.");
      return;
    }
    alert("Pedido realizado com sucesso!");
    navigate("/confirmacao");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
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

          <label className="block font-medium">Numero</label>
          <input
            type="text"
            value={address.numero}
            onChange={(e) => setAddress({ ...address, numero: e.target.value })}
            className="w-full p-2 border rounded bg-gray-100"
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
        <div className="mb-4 font-semibold text-lg">Total: R$ {total}</div>

        {/* Botão Finalizar */}
        <button
          type="button"
          onClick={handleOrder}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Finalizar Compra
        </button>
      </div>
    </div>
  );
}

export default Pagamento;
