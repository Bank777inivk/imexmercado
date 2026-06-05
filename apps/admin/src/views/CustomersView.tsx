import React, { useEffect, useState } from "react";
import { subscribeToCollection } from "@imexmercado/firebase";
import {
  Users,
  MagnifyingGlass,
  Funnel,
  DotsThreeVertical,
  UserCircle,
  CalendarBlank,
  IdentificationBadge,
  ArrowClockwise,
  DownloadSimple,
  Newspaper,
} from "@phosphor-icons/react";

export function CustomersView() {
  const [activeTab, setActiveTab] = useState<"users" | "subscribers">("users");
  const [users, setUsers] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "customer">(
    "all",
  );

  useEffect(() => {
    setLoading(true);
    if (activeTab === "users") {
      const unsubscribe = subscribeToCollection("users", (data) => {
        setUsers(data);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      const unsubscribe = subscribeToCollection("subscribers", (data) => {
        const sorted = data.sort((a: any, b: any) => {
          const dateA = new Date(a.subscribedAt || 0).getTime();
          const dateB = new Date(b.subscribedAt || 0).getTime();
          return dateB - dateA;
        });
        setSubscribers(sorted);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [activeTab]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === "all" ||
      (roleFilter === "admin" ? user.role === "admin" : user.role !== "admin");

    return matchesSearch && matchesRole;
  });

  const filteredSubscribers = subscribers.filter((sub) => {
    return sub.email?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleExportCSV = () => {
    if (subscribers.length === 0) return;
    const headers = "Email,Date d'inscription\n";
    const rows = subscribers
      .map(
        (sub) =>
          `"${sub.email}","${sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleString("fr-FR") : "Inconnue"}"`,
      )
      .join("\n");
    const csvContent =
      "data:text/csv;charset=utf-8," + encodeURIComponent(headers + rows);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute(
      "download",
      `abonnes_newsletter_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 md:space-y-10">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-left">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            {activeTab === "users" ? "Base Clients" : "Abonnés Newsletter"}
          </h2>
          <p className="text-sm font-medium text-gray-500">
            {activeTab === "users"
              ? "Un aperçu complet de votre communauté d'utilisateurs."
              : "Gérez et exportez la liste des inscrits à votre newsletter."}
          </p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
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

          {activeTab === "subscribers" && subscribers.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="bg-gray-900 hover:bg-black text-white px-5 py-4 rounded-2xl border border-transparent flex items-center gap-2 shadow-sm font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all"
            >
              <DownloadSimple size={18} weight="bold" />
              Exporter en CSV
            </button>
          )}

          <div className="bg-primary/5 text-primary px-6 py-4 rounded-2xl border border-primary/10 flex items-center gap-2 shadow-sm">
            {activeTab === "users" ? (
              <>
                <Users size={18} weight="bold" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {users.length} Inscrits
                </span>
              </>
            ) : (
              <>
                <Newspaper size={18} weight="bold" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {subscribers.length} Abonnés
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => {
              setActiveTab("users");
              setSearchTerm("");
            }}
            className={`pb-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
              activeTab === "users"
                ? "border-primary text-gray-900"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Utilisateurs du site
          </button>
          <button
            onClick={() => {
              setActiveTab("subscribers");
              setSearchTerm("");
            }}
            className={`pb-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
              activeTab === "subscribers"
                ? "border-primary text-gray-900"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Abonnés Newsletter
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <MagnifyingGlass
            size={20}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder={
              activeTab === "users"
                ? "Rechercher par nom, email..."
                : "Rechercher par email..."
            }
            className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-medium focus:ring-4 focus:ring-primary/5 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {activeTab === "users" && (
          <div className="flex items-center gap-2 w-full md:w-auto self-stretch">
            <div className="flex flex-1 bg-gray-50 p-1.5 rounded-2xl">
              {["all", "customer", "admin"].map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role as any)}
                  className={`flex-1 px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                    roleFilter === role
                      ? "bg-white text-gray-900 shadow-md transform scale-[1.02]"
                      : "text-gray-400"
                  }`}
                >
                  {role === "all"
                    ? "Tous"
                    : role === "admin"
                      ? "Admins"
                      : "Clients"}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Unified Handling of Loading & Empty States */}
      {loading ||
      (activeTab === "users"
        ? filteredUsers.length === 0
        : filteredSubscribers.length === 0) ? (
        <div className="bg-white rounded-[2.5rem] p-10 md:p-20 text-center border border-gray-200 shadow-sm animate-in fade-in zoom-in-95 duration-500">
          {loading ? (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Chargement des données...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <UserCircle
                size={48}
                className="text-gray-200 mb-4"
                weight="thin"
              />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                {activeTab === "users"
                  ? "Aucun utilisateur trouvé"
                  : "Aucun abonné trouvé"}
              </p>
            </div>
          )}
        </div>
      ) : activeTab === "users" ? (
        <div className="bg-transparent lg:bg-white lg:rounded-[2.5rem] lg:border lg:border-gray-200 lg:shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Utilisateur
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Rôle
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Contact
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Inscription
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((user) => (
                  <tr
                    key={`table-${user.id}`}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white font-black text-xs">
                          {user.firstName?.charAt(0)}
                          {user.lastName?.charAt(0)}
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            #{user.id.substring(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                          user.role === "admin"
                            ? "bg-purple-50 text-purple-600 border border-purple-100"
                            : "bg-blue-50 text-blue-600 border border-blue-100"
                        }`}
                      >
                        <IdentificationBadge size={14} weight="bold" />
                        {user.role === "admin" ? "Administrateur" : "Client"}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-left">
                      <p className="text-sm font-medium text-gray-600 truncate max-w-[200px]">
                        {user.email}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium">
                        {user.phone || "Pas de téléphone"}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-gray-500">
                        <CalendarBlank size={16} />
                        <span className="text-xs font-bold">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "Ancien"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 text-gray-300 hover:text-gray-900 hover:bg-white rounded-xl shadow-sm transition-all border border-transparent hover:border-gray-100 active:scale-90">
                        <DotsThreeVertical size={24} weight="bold" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View (Cards) */}
          <div className="lg:hidden space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={`card-${user.id}`}
                className="bg-white p-6 rounded-[2rem] border border-gray-200 shadow-sm space-y-4 active:scale-[0.98] transition-all animate-in slide-in-from-right-4 duration-500"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-gray-200">
                      {user.firstName?.charAt(0)}
                      {user.lastName?.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black text-gray-900 leading-tight">
                        {user.firstName} {user.lastName}
                      </p>
                      <p
                        className={`text-[9px] font-black uppercase tracking-widest mt-1 ${user.role === "admin" ? "text-purple-500" : "text-blue-500"}`}
                      >
                        {user.role === "admin" ? "Administrateur" : "Client"}
                      </p>
                    </div>
                  </div>
                  <button className="p-3 bg-gray-50 text-gray-300 rounded-xl active:scale-90">
                    <DotsThreeVertical size={22} weight="bold" />
                  </button>
                </div>

                <div className="bg-gray-50/50 p-4 rounded-2xl space-y-2 text-left border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-500 overflow-hidden">
                    <UserCircle size={14} weight="bold" className="shrink-0" />
                    <span className="text-[11px] font-bold truncate">
                      {user.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <CalendarBlank
                      size={14}
                      weight="bold"
                      className="shrink-0"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Inscrit le{" "}
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "Inconnu"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-transparent lg:bg-white lg:rounded-[2.5rem] lg:border lg:border-gray-200 lg:shadow-sm overflow-hidden">
          {/* Desktop Table View for Subscribers */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Adresse E-mail
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Date d'inscription
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredSubscribers.map((sub) => (
                  <tr
                    key={`table-sub-${sub.id}`}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-black text-xs">
                          <Newspaper size={20} weight="duotone" />
                        </div>
                        <span className="text-sm font-bold text-gray-900">
                          {sub.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-gray-500">
                        <CalendarBlank size={16} />
                        <span className="text-xs font-bold">
                          {sub.subscribedAt
                            ? new Date(sub.subscribedAt).toLocaleString("fr-FR")
                            : "Inconnue"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 text-gray-300 hover:text-gray-950 hover:bg-white rounded-xl shadow-sm transition-all border border-transparent hover:border-gray-100 active:scale-90">
                        <DotsThreeVertical size={24} weight="bold" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View for Subscribers */}
          <div className="lg:hidden space-y-4">
            {filteredSubscribers.map((sub) => (
              <div
                key={`card-sub-${sub.id}`}
                className="bg-white p-6 rounded-[2rem] border border-gray-200 shadow-sm space-y-4 active:scale-[0.98] transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-black text-xs">
                      <Newspaper size={20} weight="duotone" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-black text-gray-900 leading-tight truncate max-w-[200px]">
                        {sub.email}
                      </p>
                      <p className="text-[9px] font-black uppercase tracking-widest mt-1 text-gray-400">
                        Abonné Newsletter
                      </p>
                    </div>
                  </div>
                  <button className="p-2 bg-gray-50 text-gray-300 rounded-xl active:scale-90">
                    <DotsThreeVertical size={20} weight="bold" />
                  </button>
                </div>

                <div className="bg-gray-50/50 p-4 rounded-2xl text-left border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-400">
                    <CalendarBlank
                      size={14}
                      weight="bold"
                      className="shrink-0"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Inscrit le{" "}
                      {sub.subscribedAt
                        ? new Date(sub.subscribedAt).toLocaleDateString("fr-FR")
                        : "Inconnue"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
