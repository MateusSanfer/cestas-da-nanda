import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";

const MinhaConta = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!storedUser || !token) {
            navigate("/login");
            return;
        }

        setUser(JSON.parse(storedUser));
        fetchMyOrders(token);
    }, [navigate]);
  
    const fetchMyOrders = async (token) => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get("http://localhost:3001/api/orders/me", config);
        setOrders(res.data);
      } catch (error) {
        console.error("Erro ao buscar meus pedidos:", error);
      } finally {
        setLoading(false);
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
  
    const getStatusColor = (status) => {
        switch(status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'preparing': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'sent': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'canceled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
  
    const statusLabels = {
        pending: 'Pendente',
        confirmed: 'Confirmado',
        preparing: 'Preparando',
        sent: 'Enviado',
        delivered: 'Entregue',
        canceled: 'Cancelado'
    };
  
    return (
      <div className="bg-cream min-h-screen font-sans flex flex-col pt-24">
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
            <header className="mb-8 border-b border-gray-200 pb-6 flex justify-between items-end">
                <div>
                     <h1 className="text-4xl font-serif font-bold text-charcoal mb-2">Minha Conta</h1>
                     <p className="text-warmGray">Bem-vindo de volta, <span className="font-semibold text-terracotta">{user?.name}</span>!</p>
                </div>
                <Link to="/" className="text-sm font-medium text-terracotta hover:underline">
                    <i className="bi bi-arrow-left"></i> Voltar para Loja
                </Link>
            </header>
  
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h2 className="text-2xl font-serif font-bold text-charcoal mb-6 flex items-center gap-2">
                    <i className="bi bi-bag-heart text-terracotta"></i> Meus Pedidos
                </h2>
  
                {loading ? (
                    <div className="text-center py-12 text-gray-500">
                        <i className="bi bi-arrow-clockwise animate-spin text-3xl mb-2 block"></i>
                        Carregando seus pedidos...
                    </div>
                ) : orders.length > 0 ? (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow bg-gray-50/30">
                                <div className="flex flex-wrap justify-between items-start gap-4 mb-4 border-b border-gray-100 pb-4">
                                    <div>
                                        <span className="text-xs text-uppercase font-bold text-gray-400 tracking-wider">PEDIDO #{order.id}</span>
                                        <div className="text-charcoal font-medium flex items-center gap-2 mt-1">
                                            <i className="bi bi-calendar-event"></i> {order.deliveryDate} ({order.deliveryPeriod})
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                        {statusLabels[order.status] || order.status}
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-sm font-bold text-charcoal mb-2">Itens do Pedido</h4>
                                        <ul className="space-y-2">
                                            {order.OrderItems?.map((item, idx) => {
                                                const safeExtras = parseExtras(item.extras);
                                                return (
                                                    <li key={idx} className="text-sm text-gray-600 bg-white p-2 rounded border border-gray-100">
                                                        <span className="font-bold text-gray-800">{item.quantity}x</span> {item.Basket?.name || `Produto #${item.basketId}`}
                                                        {safeExtras && safeExtras.length > 0 && (
                                                            <div className="text-xs text-terracotta mt-1 pl-4 border-l-2 border-terracotta/20">
                                                                {safeExtras.map((e, i) => (
                                                                    <span key={i} className="block">+ {e.count}x {e.name}</span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                    
                                    <div className="flex flex-col justify-between">
                                        <div>
                                            <h4 className="text-sm font-bold text-charcoal mb-2">Endereço de Entrega</h4>
                                            {order.deliveryAddress ? (
                                                <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-100">
                                                    {order.deliveryAddress.street}, {order.deliveryAddress.number}<br/>
                                                    {order.deliveryAddress.neighborhood} - {order.deliveryAddress.city}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">Não informado</span>
                                            )}
                                        </div>
                                        
                                        <div className="mt-4 text-right">
                                            <p className="text-xs text-gray-500 uppercase">Total do Pedido</p>
                                            <p className="text-2xl font-serif font-bold text-terracotta">R$ {order.total}</p>
                                            <p className="text-xs text-gray-400">{order.paymentMethod}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-gray-50 rounded-xl">
                        <i className="bi bi-basket text-4xl text-gray-300 mb-4 block"></i>
                        <h3 className="text-lg font-medium text-gray-500">Você ainda não fez nenhum pedido.</h3>
                        <Link to="/" className="inline-block mt-4 px-6 py-2 bg-terracotta text-white rounded-full font-bold hover:bg-opacity-90 transition-all shadow-sm">
                            Explorar Produtos
                        </Link>
                    </div>
                )}
            </div>
        </main>
        <Footer />
      </div>
    );
  };
  
 export default MinhaConta;
