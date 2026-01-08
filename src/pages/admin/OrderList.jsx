import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Try relative path first (proxy), fallback to absolute if needed
      const res = await axios.get("/api/orders");
      setOrders(res.data);
    } catch (error) {
      console.error(error);
      try {
        const res = await axios.get("/api/orders");
        setOrders(res.data);
      } catch (e) {
        toast.error("Erro ao carregar pedidos.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`/api/orders/${id}`, { status: newStatus });
      toast.success(`Pedido #${id} atualizado para ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar status.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "preparing":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "sent":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "canceled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statusLabels = {
    pending: "Pendente",
    confirmed: "Confirmado",
    preparing: "Preparando",
    sent: "Enviado",
    delivered: "Entregue",
    canceled: "Cancelado",
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

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">
        <i className="bi bi-arrow-clockwise animate-spin text-2xl"></i>
        <br />
        Carregando pedidos...
      </div>
    );

  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <h2 className="text-xl font-serif font-bold text-charcoal flex items-center gap-2">
          <i className="bi bi-list-check text-terracotta"></i>
          Pedidos Recentes
        </h2>
        <button
          onClick={fetchOrders}
          className="text-sm text-terracotta hover:underline font-medium"
        >
          <i className="bi bi-arrow-clockwise"></i> Atualizar
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                #ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Data / Período
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Resumo do Pedido
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  #{order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <div className="font-medium text-gray-900">
                    <i className="bi bi-calendar-event"></i>{" "}
                    {order.deliveryDate}
                  </div>
                  <div className="text-xs mt-1 inline-block bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                    {order.deliveryPeriod}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="font-medium text-gray-900">
                    {order.User
                      ? order.User.name
                      : "Convidado/Usuário Excluído"}
                  </div>
                  <div className="text-xs text-gray-400 mb-1">
                    {order.User?.email}
                  </div>
                  {order.deliveryAddress && (
                    <div className="text-xs mt-1 text-gray-500 leading-snug">
                      {order.deliveryAddress.street},{" "}
                      {order.deliveryAddress.number}
                      <br />
                      {order.deliveryAddress.neighborhood} -{" "}
                      {order.deliveryAddress.city}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 box-content">
                  <ul className="list-disc list-inside space-y-1">
                    {order.OrderItems?.map((item, idx) => {
                      const safeExtras = parseExtras(item.extras);
                      return (
                        <li key={idx} className="truncate max-w-xs">
                          <span className="font-medium text-gray-800">
                            {item.quantity}x
                          </span>{" "}
                          {item.Basket?.name || `Produto #${item.basketId}`}
                          {safeExtras && safeExtras.length > 0 && (
                            <span className="text-xs text-terracotta block ml-4">
                              +{" "}
                              {safeExtras
                                .map((e) => `${e.count}x ${e.name}`)
                                .join(", ")}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  {order.message && (
                    <div className="mt-2 text-xs italic bg-yellow-50 p-2 rounded border border-yellow-100 text-yellow-800 max-w-xs whitespace-normal">
                      <i className="bi bi-chat-quote mr-1"></i> "{order.message}
                      "
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-charcoal">
                    R$ {order.total}
                  </div>
                  <div className="text-xs text-gray-400 capitalize">
                    {order.paymentMethod}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {statusLabels[order.status] || order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <select
                    className="border border-gray-300 rounded-lg p-1.5 text-xs bg-white focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta outline-none cursor-pointer hover:border-gray-400 transition-all"
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                  >
                    <option value="pending">Pendente</option>
                    <option value="confirmed">Confirmado</option>
                    <option value="preparing">Preparando</option>
                    <option value="sent">Enviado</option>
                    <option value="delivered">Entregue</option>
                    <option value="canceled">Cancelado</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-12 text-center text-gray-400"
                >
                  <i className="bi bi-inbox text-4xl mb-2 block opacity-50"></i>
                  Nenhum pedido encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
