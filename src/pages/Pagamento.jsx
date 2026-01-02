// src/pages/Pagamento.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; // Assuming react-hot-toast is installed (it was in package.json)

function Pagamento({ cart }) {
  // Assuming user might be passed, if not we handle it
  // Retrieve user from local storage if available
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const [cep, setCep] = useState("");
  const [address, setAddress] = useState({
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
  });
  const [shippingCost, setShippingCost] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryPeriod, setDeliveryPeriod] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Simulated Shipping Logic
  const calculateShipping = (bairro) => {
    if (!bairro) return 0;
    const normalizedBairro = bairro.toLowerCase();

    // Zona 1: Bairros Vizinhos (Barato - R$ 5,00)
    // Inclui Nova Brasília, Trobogy, Jardim Nova Esperança, etc.
    if (
      [
        "nova brasília",
        "jardim nova esperança",
        "canabrava",
        "trobogy",
        "pau da lima",
        "são marcos",
        "vale dos lagos",
      ].some((b) => normalizedBairro.includes(b))
    ) {
      return 5.0;
    }
    // Zona 2: Bairros Distantes/Orla (Caro - R$ 20,00)
    else if (
      [
        "centro",
        "barra",
        "graça",
        "vitória",
        "pituba",
        "rio vermelho",
        "ondina",
        "caminho das árvores",
        "itaigara",
      ].some((b) => normalizedBairro.includes(b))
    ) {
      return 20.0;
    }
    // Zona 3: Padrão (Intermediário - R$ 10,00)
    return 10.0;
  };

  // Função para buscar o endereço pelo CEP usando a API do ViaCEP
  const fetchAddress = async () => {
    if (cep.length === 8) {
      try {
        const response = await axios.get(
          `https://viacep.com.br/ws/${cep}/json/`
        );
        const data = response.data;
        if (data.erro) {
          toast.error("CEP inválido!");
          return;
        }
        setAddress({
          rua: data.logradouro,
          numero: data.numero || "",
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
        });

        // Set shipping cost based on returned neighborhood
        const shipping = calculateShipping(data.bairro);
        setShippingCost(shipping);
        toast.success(`Frete calculado: R$ ${shipping.toFixed(2)}`);
      } catch (error) {
        toast.error("Erro ao buscar CEP.");
      }
    } else {
      toast.error("Digite um CEP válido com 8 dígitos.");
    }
  };

  // Calcular o total do carrinho
  const calculateSubtotal = () => {
    return cart.reduce((acc, item) => {
      const extrasTotal = item.includedExtraItems
        ? item.includedExtraItems.reduce(
            (sum, extra) => sum + extra.price * extra.count,
            0
          )
        : 0;
      return acc + (item.price + extrasTotal) * item.quantidade;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const total = (subtotal + shippingCost).toFixed(2);

  // Função para finalizar o pedido
  const handleOrder = async () => {
    if (
      !paymentMethod ||
      !cep ||
      !address.rua ||
      !address.numero ||
      !deliveryDate ||
      !deliveryPeriod
    ) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);

    const items = cart.map((item) => {
      const extrasTotal = item.includedExtraItems
        ? item.includedExtraItems.reduce(
            (sum, extra) => sum + extra.price * extra.count,
            0
          )
        : 0;

      return {
        basketId: item.id, // Ensure this matches DB ID
        quantity: item.quantidade,
        extras: item.includedExtraItems,
        subtotal: (item.price + extrasTotal) * item.quantidade,
      };
    });

    const payload = {
      userId: currentUser ? currentUser.id : null,
      items,
      total: parseFloat(total),
      deliveryAddress: {
        zipCode: cep,
        street: address.rua,
        number: address.numero,
        neighborhood: address.bairro,
        city: address.cidade,
        state: address.estado,
      },
      deliveryDate,
      deliveryPeriod,
      paymentMethod,
      message,
      // Note: We might want to save shippingCost separately in DB, but for now it's in total
    };

    try {
      const response = await axios.post("/api/orders", payload);
      toast.success("Pedido realizado com sucesso!");

      // Navigate with state to populate Confirmation page
      navigate("/confirmacao", {
        state: {
          orderId: response.data.id || "PENDENTE",
          total,
          paymentMethod,
          deliveryDate,
          shippingCost,
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao finalizar pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cream font-sans pt-24 pb-12">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full p-6 sm:p-10 border border-gray-100">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-10 text-center text-charcoal">
          Finalizar Pedido
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Coluna 1: Endereço */}
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-semibold mb-4 border-b border-gray-100 pb-2 text-terracotta flex items-center gap-2">
              <i className="bi bi-geo-alt"></i> Entrega
            </h3>

            <div>
              <label className="block text-sm font-medium text-warmGray mb-1">
                CEP
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cep}
                  onChange={(e) => setCep(e.target.value.replace(/\D/g, ""))}
                  maxLength="8"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta/50 focus:border-terracotta outline-none transition-all"
                  placeholder="00000-000"
                />
                <button
                  type="button"
                  onClick={fetchAddress}
                  className="bg-charcoal text-white px-5 py-2 rounded-lg hover:bg-opacity-90 transition shadow-sm"
                >
                  Buscar
                </button>
              </div>
            </div>

            {address.rua && (
              <div className="animate-fade-in space-y-4 bg-gray-50 p-4 rounded-xl">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Endereço
                  </label>
                  <p className="text-charcoal font-medium">
                    {address.rua} - {address.bairro}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {address.cidade}/{address.estado}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-warmGray mb-1">
                    Número
                  </label>
                  <input
                    type="text"
                    value={address.numero}
                    onChange={(e) =>
                      setAddress({ ...address, numero: e.target.value })
                    }
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta/50 focus:border-terracotta outline-none transition-all bg-white"
                    placeholder="Ex: 123"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Coluna 2: Detalhes e Pagamento */}
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-semibold mb-4 border-b border-gray-100 pb-2 text-terracotta flex items-center gap-2">
              <i className="bi bi-calendar-event"></i> Agendamento & Pagamento
            </h3>

            {/* Data e Periodo */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-warmGray mb-1">
                  Data da Entrega
                </label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta/50 focus:border-terracotta outline-none transition-all text-gray-600"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-warmGray mb-1">
                  Período
                </label>
                <div className="relative">
                  <select
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta/50 focus:border-terracotta outline-none transition-all appearance-none bg-white font-medium text-gray-600"
                    value={deliveryPeriod}
                    onChange={(e) => setDeliveryPeriod(e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="Manhã">Manhã (08h - 12h)</option>
                    <option value="Tarde">Tarde (13h - 18h)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <i className="bi bi-chevron-down text-xs"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Mensagem */}
            <div>
              <label className="block text-sm font-medium text-warmGray mb-1">
                Cartão (Opcional)
              </label>
              <textarea
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta/50 focus:border-terracotta outline-none transition-all"
                rows="2"
                placeholder="Mensagem para o cartão..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>

            {/* Pagamento */}
            <div>
              <label className="block text-sm font-medium text-warmGray mb-1">
                Pagamento
              </label>
              <div className="relative">
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta/50 focus:border-terracotta outline-none transition-all appearance-none bg-white font-medium text-gray-600"
                >
                  <option value="">Selecione...</option>
                  <option value="pix">Pix (Aprovação Imediata)</option>
                  <option value="cartao">Cartão de Crédito</option>
                  <option value="boleto">Boleto (até 3 dias úteis)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <i className="bi bi-chevron-down text-xs"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo e Ação */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col items-center">
          <div className="w-full max-w-md bg-gray-50 rounded-xl p-6 mb-6">
            <div className="flex justify-between text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600 mb-4 pb-4 border-b border-gray-200">
              <span>Frete ({address.bairro || "Calculando..."})</span>
              <span>R$ {shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-2xl font-serif font-bold text-terracotta">
              <span>Total</span>
              <span>R$ {total}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOrder}
            disabled={loading}
            className={`w-full max-w-md bg-terracotta text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl hover:bg-opacity-90 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                Processando...
              </>
            ) : (
              <>
                <i className="bi bi-check-lg text-xl"></i>
                Finalizar Compra
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pagamento;
