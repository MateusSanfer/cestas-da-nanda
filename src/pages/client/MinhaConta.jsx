import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import toast from "react-hot-toast";

const MinhaConta = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("orders"); // 'orders' or 'profile'
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    setFormData((prev) => ({ ...prev, name: parsedUser.name }));
    fetchMyOrders(token);
  }, [navigate]);

  const fetchMyOrders = async (token) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get("/api/orders/me", config);
      setOrders(res.data);
    } catch (error) {
      console.error("Erro ao buscar meus pedidos:", error);

      if (error.response?.status === 401) {
        toast.error("Sessão expirada. Faça login novamente.");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmNewPassword
    ) {
      toast.error("A nova senha e a confirmação não coincidem.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const payload = {};
      // Only send name if changed
      if (formData.name !== user.name) payload.name = formData.name;

      // Only send password stuff if newPassword is provided
      if (formData.newPassword) {
        payload.password = formData.password;
        payload.newPassword = formData.newPassword;
      }

      const res = await axios.put("/auth/me", payload, config);

      toast.success(res.data.message);

      // Update local user data
      const updatedUser = { ...user, ...res.data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      setFormData((prev) => ({
        ...prev,
        password: "",
        newPassword: "",
        confirmNewPassword: "",
      }));
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      toast.error(error.response?.data?.error || "Erro ao atualizar perfil");
    }
  };

  // Helper to safely parse extras
  const parseExtras = (extras) => {
    if (!extras) return [];
    if (Array.isArray(extras)) return extras;
    try {
      return JSON.parse(extras);
    } catch (e) {
      return [];
    }
  };

  // Status Logic
  const steps = ["pending", "confirmed", "preparing", "sent", "delivered"];
  const stepLabels = {
    pending: "Recebido",
    confirmed: "Confirmado",
    preparing: "Preparando",
    sent: "A Caminho",
    delivered: "Entregue",
  };

  const getStatusStepIndex = (status) => {
    const index = steps.indexOf(status);
    return index === -1 ? 0 : index;
  };

  // Render Timeline Component
  const OrderTimeline = ({ currentStatus }) => {
    if (currentStatus === "canceled") {
      return (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 mb-4 font-bold border border-red-100">
          <i className="bi bi-x-circle-fill"></i> Pedido Cancelado
        </div>
      );
    }

    const currentIndex = getStatusStepIndex(currentStatus);

    return (
      <div className="relative flex items-center justify-between mb-8 mt-2 w-full max-w-2xl mx-auto">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-0 rounded-full"></div>
        <div
          className="absolute top-1/2 left-0 h-1 bg-green-500 -z-0 rounded-full transition-all duration-1000"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div
              key={step}
              className="flex flex-col items-center relative z-10 group"
            >
              <div
                className={`
                                  w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                                  ${
                                    isCompleted
                                      ? "bg-green-500 border-green-500 text-white shadow-md scale-110"
                                      : "bg-white border-gray-300 text-gray-300"
                                  }
                                  ${isCurrent ? "ring-4 ring-green-100" : ""}
                              `}
              >
                <i className={`bi bi-${getStepIcon(step)} text-xs`}></i>
              </div>
              <span
                className={`
                                  absolute top-10 text-xs font-bold whitespace-nowrap transition-colors duration-300
                                  ${
                                    isCompleted
                                      ? "text-charcoal"
                                      : "text-gray-300"
                                  }
                              `}
              >
                {stepLabels[step]}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const getStepIcon = (step) => {
    switch (step) {
      case "pending":
        return "clipboard-check";
      case "confirmed":
        return "hand-thumbs-up";
      case "preparing":
        return "box-seam";
      case "sent":
        return "truck";
      case "delivered":
        return "house-heart";
      default:
        return "circle";
    }
  };

  return (
    <div className="bg-cream min-h-screen font-sans flex flex-col pt-20 md:pt-24">
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-200 pb-6 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-2">
              Olá, {user?.name?.split(" ")[0]}
            </h1>
            <p className="text-warmGray">Acompanhe seus presentes e dados.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                activeTab === "orders"
                  ? "bg-terracotta text-white shadow-lg"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              <i className="bi bi-gift-fill mr-2"></i> Pedidos
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                activeTab === "profile"
                  ? "bg-terracotta text-white shadow-lg"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              <i className="bi bi-person-fill mr-2"></i> Dados
            </button>
          </div>
        </div>

        {activeTab === "orders" && (
          <div className="animate-fade-in">
            {loading ? (
              <div className="text-center py-20">
                <i className="bi bi-arrow-clockwise animate-spin text-4xl text-terracotta mb-4 block"></i>
                <p className="text-gray-500">Buscando seus pedidos...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-8">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                  >
                    {/* Order Header */}
                    <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-terracotta font-bold text-xl shadow-sm border border-gray-100">
                          #{order.id}
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                            Data do Pedido
                          </p>
                          <p className="font-semibold text-charcoal">
                            {new Date(order.createdAt).toLocaleDateString(
                              "pt-BR"
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                          Total
                        </p>
                        <p className="text-xl font-serif font-bold text-terracotta">
                          R$ {order.total}
                        </p>
                      </div>
                    </div>

                    {/* Order Content */}
                    <div className="p-6 md:p-8">
                      {/* Status Timeline */}
                      <div className="mb-10 pb-6 border-b border-gray-50">
                        <OrderTimeline currentStatus={order.status} />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Items List */}
                        <div>
                          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <i className="bi bi-basket"></i> Itens da Cesta
                          </h4>
                          <div className="space-y-3">
                            {order.OrderItems?.map((item, idx) => {
                              const safeExtras = parseExtras(item.extras);
                              return (
                                <div
                                  key={idx}
                                  className="flex gap-4 items-start p-3 rounded-xl hover:bg-cream/30 transition-colors"
                                >
                                  {/* Fallback Image or Basket Image if we had it populated in query */}
                                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                                    {item.Basket?.image ? (
                                      <img
                                        src={item.Basket.image}
                                        alt=""
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <i className="bi bi-image"></i>
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-bold text-charcoal">
                                      {item.Basket?.name ||
                                        `Produto #${item.basketId}`}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Qtd: {item.quantity}
                                    </p>
                                    {safeExtras && safeExtras.length > 0 && (
                                      <div className="text-xs text-terracotta mt-1">
                                        {safeExtras.map((e, i) => (
                                          <span
                                            key={i}
                                            className="inline-block bg-terracotta/10 px-2 py-0.5 rounded mr-1"
                                          >
                                            + {e.count} {e.name}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Delivery Info */}
                        <div className="bg-gray-50 rounded-2xl p-6 h-fit">
                          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <i className="bi bi-geo-alt"></i> Dados de Entrega
                          </h4>
                          {order.deliveryAddress ? (
                            <div className="text-sm text-gray-600 space-y-2">
                              <p>
                                <span className="font-bold">Endereço:</span>{" "}
                                {order.deliveryAddress.street},{" "}
                                {order.deliveryAddress.number}
                              </p>
                              <p>
                                <span className="font-bold">Bairro:</span>{" "}
                                {order.deliveryAddress.neighborhood} -{" "}
                                {order.deliveryAddress.city}
                              </p>
                              <p>
                                <span className="font-bold">CEP:</span>{" "}
                                {order.deliveryAddress.zipCode ||
                                  order.deliveryAddress.cep}
                              </p>
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <p>
                                  <span className="font-bold">Previsão:</span>{" "}
                                  {order.deliveryDate}
                                </p>
                                <p>
                                  <span className="font-bold">Período:</span>{" "}
                                  {order.deliveryPeriod}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-400 italic">
                              Endereço não registrado.
                            </p>
                          )}

                          <button className="w-full mt-6 py-2.5 rounded-xl border-2 border-terracotta text-terracotta font-bold hover:bg-terracotta hover:text-white transition-all flex items-center justify-center gap-2">
                            <i className="bi bi-whatsapp"></i> Falar com Suporte
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="bg-cream w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="bi bi-bag-heart text-4xl text-terracotta"></i>
                </div>
                <h2 className="text-2xl font-serif font-bold text-charcoal mb-2">
                  Nenhum pedido ainda
                </h2>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                  Que tal explorar nossas cestas e enviar um presente especial
                  hoje?
                </p>
                <Link
                  to="/"
                  className="inline-block px-8 py-3 bg-terracotta text-white rounded-full font-bold shadow-lg hover:bg-opacity-90 transform hover:-translate-y-1 transition-all"
                >
                  Ver Cestas Disponíveis
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold text-charcoal flex items-center gap-2">
                <i className="bi bi-person-bounding-box text-terracotta"></i>{" "}
                Meus Dados
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-terracotta font-bold hover:underline"
                >
                  <i className="bi bi-pencil-fill"></i> Editar
                </button>
              )}
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={isEditing ? formData.name : user?.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  readOnly={
                    !isEditing ||
                    (user?.hasChangedName && user.name !== formData.name)
                  }
                  disabled={user?.hasChangedName}
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none ${
                    isEditing && !user?.hasChangedName
                      ? "bg-white border-terracotta"
                      : "bg-gray-50 border-gray-200 text-gray-500"
                  }`}
                />
                {user?.hasChangedName && (
                  <p className="text-xs text-orange-500 mt-1">
                    O nome só pode ser alterado uma vez.
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-600 focus:outline-none cursor-not-allowed"
                />
              </div>

              {isEditing && (
                <div className="pt-4 border-t border-gray-100 animate-fade-in">
                  <h3 className="font-bold text-charcoal mb-4">
                    Alterar Senha{" "}
                    <span className="text-xs font-normal text-gray-400">
                      (Opcional)
                    </span>
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">
                        Senha Atual (Obrigatória para mudanças)
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-terracotta focus:outline-none"
                        required={!!formData.newPassword}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">
                        Nova Senha
                      </label>
                      <input
                        type="password"
                        value={formData.newPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-terracotta focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">
                        Confirmar Nova Senha
                      </label>
                      <input
                        type="password"
                        value={formData.confirmNewPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmNewPassword: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-terracotta focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData((prev) => ({
                        ...prev,
                        name: user.name,
                        password: "",
                        newPassword: "",
                      }));
                    }}
                    className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-terracotta text-white font-bold hover:bg-opacity-90 transition-colors shadow-lg"
                  >
                    Salvar Alterações
                  </button>
                </div>
              )}

              {!isEditing && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400 italic mb-4">
                    * Problemas com sua conta? Fale com nosso suporte.
                  </p>
                </div>
              )}
            </form>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MinhaConta;
