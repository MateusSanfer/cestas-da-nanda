// src/pages/Pagamento.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; // Assuming react-hot-toast is installed (it was in package.json)

function Pagamento({ cart }) { // Assuming user might be passed, if not we handle it
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
  const [paymentMethod, setPaymentMethod] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryPeriod, setDeliveryPeriod] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
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
      } catch (error) {
        toast.error("Erro ao buscar CEP.");
      }
    } else {
      toast.error("Digite um CEP válido com 8 dígitos.");
    }
  };

  // Calcular o total do carrinho
  const calculateTotal = () => {
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

  const total = calculateTotal().toFixed(2);

  // Função para finalizar o pedido
  const handleOrder = async () => {
    if (!paymentMethod || !cep || !address.rua || !address.numero || !deliveryDate || !deliveryPeriod) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);

    const items = cart.map(item => {
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
            subtotal: (item.price + extrasTotal) * item.quantidade
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
            state: address.estado
        },
        deliveryDate,
        deliveryPeriod,
        paymentMethod,
        message
    };

    try {
        await axios.post('/api/orders', payload);
        toast.success("Pedido realizado com sucesso!");
        // Clear cart logic should be here (via prop function or context)
        // For now just navigate
        navigate("/confirmacao");
    } catch (error) {
        console.error(error);
        toast.error("Erro ao finalizar pedido. Tente novamente.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cream font-sans">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full p-8 sm:p-10 border border-gray-100">
        <h2 className="text-4xl font-serif font-bold mb-10 text-center text-charcoal">Finalizar Pedido</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Coluna 1: Endereço */}
            <div className="space-y-6">
                <h3 className="text-xl font-serif font-semibold mb-4 border-b border-gray-100 pb-2 text-terracotta flex items-center gap-2">
                    <i className="bi bi-geo-alt"></i> Entrega
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-warmGray mb-1">CEP</label>
                  <div className="flex gap-2">
                    <input
                        type="text"
                        value={cep}
                        onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
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

                <div>
                  <label className="block text-sm font-medium text-warmGray mb-1">Rua</label>
                  <input
                    type="text"
                    value={address.rua}
                    readOnly
                    className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div className="flex gap-4">
                    <div className="w-1/3">
                        <label className="block text-sm font-medium text-warmGray mb-1">Número</label>
                        <input
                            type="text"
                            value={address.numero}
                            onChange={(e) => setAddress({ ...address, numero: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta/50 focus:border-terracotta outline-none transition-all"
                        />
                    </div>
                    <div className="w-2/3">
                        <label className="block text-sm font-medium text-warmGray mb-1">Bairro</label>
                        <input
                            type="text"
                            value={address.bairro}
                            readOnly
                            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                        />
                    </div>
                </div>
                 <div className="flex gap-4">
                    <div className="w-2/3">
                        <label className="block text-sm font-medium text-warmGray mb-1">Cidade</label>
                        <input
                            type="text"
                            value={address.cidade}
                            readOnly
                            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                        />
                    </div>
                    <div className="w-1/3">
                        <label className="block text-sm font-medium text-warmGray mb-1">UF</label>
                        <input
                            type="text"
                            value={address.estado}
                            readOnly
                            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                        />
                    </div>
                </div>
            </div>

            {/* Coluna 2: Detalhes e Pagamento */}
            <div className="space-y-6">
                <h3 className="text-xl font-serif font-semibold mb-4 border-b border-gray-100 pb-2 text-terracotta flex items-center gap-2">
                    <i className="bi bi-calendar-event"></i> Agendamento & Pagamento
                </h3>

                {/* Data e Periodo */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-warmGray mb-1">Data da Entrega</label>
                        <input 
                            type="date" 
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta/50 focus:border-terracotta outline-none transition-all text-gray-600"
                            value={deliveryDate}
                            onChange={(e) => setDeliveryDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-warmGray mb-1">Período</label>
                        <div className="relative">
                            <select 
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta/50 focus:border-terracotta outline-none transition-all appearance-none bg-white font-medium text-gray-600"
                                value={deliveryPeriod}
                                onChange={(e) => setDeliveryPeriod(e.target.value)}
                            >
                                <option value="">Selecione...</option>
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
                    <label className="block text-sm font-medium text-warmGray mb-1">Cartão de Presente <span className="text-gray-400 font-normal">(Opcional)</span></label>
                    <textarea 
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta/50 focus:border-terracotta outline-none transition-all"
                        rows="3"
                        placeholder="Escreva uma mensagem carinhosa..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                </div>

                {/* Pagamento */}
                <div>
                  <label className="block text-sm font-medium text-warmGray mb-1">Forma de Pagamento</label>
                  <div className="relative">
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta/50 focus:border-terracotta outline-none transition-all appearance-none bg-white font-medium text-gray-600"
                      >
                        <option value="">Selecione o método...</option>
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
            <div className="text-3xl font-serif font-bold text-terracotta mb-6">Total: R$ {total}</div>
            
            <button
                type="button"
                onClick={handleOrder}
                disabled={loading}
                className={`w-full max-w-md bg-terracotta text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl hover:bg-opacity-90 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                {loading ? (
                    <>
                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                        Processando...
                    </>
                ) : (
                    <>
                        <i className="bi bi-check-lg text-xl"></i>
                        Finalizar Compra com Carinho
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
}

export default Pagamento;
