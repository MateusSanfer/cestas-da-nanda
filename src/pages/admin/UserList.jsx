import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get("/auth/users", config);
      setUsers(res.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      toast.error("Erro ao carregar lista de usuários.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, currentStatus, userName) => {
    const newStatus = !currentStatus;
    const action = newStatus ? "promover" : "remover admin de";

    if (!window.confirm(`Tem certeza que deseja ${action} ${userName}?`))
      return;

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put(
        `/auth/users/${userId}/role`,
        { isAdmin: newStatus },
        config
      );

      toast.success(`Permissões de ${userName} atualizadas!`);
      fetchUsers(); // Recarrega a lista
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      toast.error(
        error.response?.data?.error || "Erro ao atualizar permissão."
      );
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-10">Carregando usuários...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold text-charcoal mb-6 border-l-4 border-terracotta pl-4">
        Gerenciar Usuários
      </h2>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="🔍 Buscar por nome ou e-mail..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta outline-none transition-all shadow-sm"
        />
        <i className="bi bi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 font-bold text-gray-600">ID</th>
              <th className="p-4 font-bold text-gray-600">Nome</th>
              <th className="p-4 font-bold text-gray-600">Email</th>
              <th className="p-4 font-bold text-gray-600 text-center">
                Admin?
              </th>
              <th className="p-4 font-bold text-gray-600 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 text-gray-500">#{user.id}</td>
                <td className="p-4 font-medium text-charcoal">{user.name}</td>
                <td className="p-4 text-gray-500">{user.email}</td>
                <td className="p-4 text-center">
                  {user.isAdmin ? (
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                      SIM
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-full">
                      NÃO
                    </span>
                  )}
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() =>
                      handleRoleChange(user.id, user.isAdmin, user.name)
                    }
                    className={`py-1 px-3 rounded text-sm font-semibold transition-colors ${
                      user.isAdmin
                        ? "bg-red-50 text-red-600 hover:bg-red-100"
                        : "bg-terracotta/10 text-terracotta hover:bg-terracotta/20"
                    }`}
                  >
                    {user.isAdmin ? "Remover Admin" : "Tornar Admin"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhum usuário encontrado para "{searchTerm}".
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
