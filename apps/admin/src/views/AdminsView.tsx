import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, subscribeToCollection, updateDocument } from "@imexmercado/firebase";
import {
  Users,
  MagnifyingGlass,
  Funnel,
  UserCircle,
  CalendarBlank,
  IdentificationBadge,
  ArrowClockwise,
  ShieldCheck,
  UserGear,
  CheckCircle,
} from "@phosphor-icons/react";

export function AdminsView() {
  const { profile: currentProfile, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "superadmin" | "admin" | "customer">("all");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToCollection("users", (data) => {
      setUsers(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (authLoading) {
    return (
      <div className="p-12 text-center text-gray-400">
        <p className="text-sm font-medium">Chargement du profil...</p>
      </div>
    );
  }

  // Double security check: only superadmin can see this view
  if (currentProfile?.role !== "superadmin") {
    return <Navigate to="/unauthorized" replace />;
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingUserId(userId);
    try {
      await updateDocument("users", userId, { role: newRole });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle :", error);
      alert("Erreur lors de la mise à jour du rôle.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <div className="space-y-6 md:space-y-10">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-left">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <UserGear size={28} className="text-primary" />
            Gestion des Admins
          </h2>
          <p className="text-sm font-medium text-gray-500">
            Gérez les rôles et les permissions des administrateurs du site.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLoading(true)}
            disabled={loading}
            className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-all shadow-sm active:scale-90 disabled:opacity-50"
          >
            <ArrowClockwise
              size={20}
              className={loading ? "animate-spin" : ""}
            />
          </button>

          <div className="bg-primary/5 text-primary px-6 py-4 rounded-2xl border border-primary/10 flex items-center gap-2 shadow-sm">
            <ShieldCheck size={18} weight="bold" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {users.filter(u => u.role === "admin" || u.role === "superadmin").length} Admins
            </span>
          </div>
        </div>
      </div>

      {/* Main Search and Filters Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 md:p-8 border-b border-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/20">
          <div className="relative w-full md:w-80">
            <MagnifyingGlass
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 rounded-2xl text-sm font-medium outline-none transition-all placeholder:text-gray-400 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mr-2 flex items-center gap-1 shrink-0">
              <Funnel size={14} />
              Filtrer par rôle :
            </div>
            {[
              { id: "all", label: "Tous" },
              { id: "superadmin", label: "Super Admin" },
              { id: "admin", label: "Admin" },
              { id: "customer", label: "Client" },
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => setRoleFilter(role.id as any)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
                  roleFilter === role.id
                    ? "bg-gray-900 text-white shadow-md shadow-gray-900/10"
                    : "bg-white text-gray-500 border border-gray-100 hover:text-gray-900 shadow-sm"
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table / List */}
        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-sm font-medium">Chargement des comptes...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-sm font-medium">Aucun utilisateur trouvé.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-50 text-left bg-gray-50/10">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Utilisateur
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Email / Tél.
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Rôle Actuel
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">
                    Changer le rôle
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-gray-100">
                          <UserCircle size={24} />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-gray-950 uppercase">
                            {user.firstName || "Inconnu"} {user.lastName || ""}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1 mt-0.5">
                            <CalendarBlank size={12} />
                            Créé le {user.createdAt ? new Date(user.createdAt).toLocaleDateString("fr-FR") : "Inconnue"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-left">
                      <p className="text-sm font-medium text-gray-700">{user.email}</p>
                      {user.phone && (
                        <p className="text-[10px] font-bold text-gray-400 mt-0.5">{user.phone}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-left">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          user.role === "superadmin"
                            ? "bg-red-50 text-red-500 border border-red-100"
                            : user.role === "admin"
                              ? "bg-purple-50 text-purple-600 border border-purple-100"
                              : "bg-blue-50 text-blue-500 border border-blue-100"
                        }`}
                      >
                        {user.role === "superadmin"
                          ? "Super Admin"
                          : user.role === "admin"
                            ? "Administrateur"
                            : "Client"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {updatingUserId === user.id ? (
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Mise à jour...
                        </span>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <select
                            value={user.role || "customer"}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="bg-white border border-gray-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/5 px-2 py-1.5 rounded-xl text-xs font-bold outline-none cursor-pointer"
                          >
                            <option value="customer">Client (customer)</option>
                            <option value="admin">Administrateur (admin)</option>
                            <option value="superadmin">Super Admin (superadmin)</option>
                          </select>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
