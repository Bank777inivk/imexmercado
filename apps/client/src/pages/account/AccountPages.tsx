import React from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  Package,
  MapPin,
  Heart,
  PencilSimple,
  Check,
  FloppyDisk,
  X,
  User as UserIcon,
  Phone,
  Globe,
  NavigationArrow,
  Trash,
  Plus,
  ShieldCheck,
  DownloadSimple,
  EnvelopeSimple,
  PaperPlaneTilt,
} from "@phosphor-icons/react";
import { setDocument, deleteDocument } from "@imexmercado/firebase";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../hooks/useLocale";

const StatCard = ({ label, value, icon, gradient, subtitle }: any) => (
  <div className="bg-white/80 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-[#2F333F]/30 shadow-lg relative overflow-hidden group hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1 transition-all duration-500 h-full flex flex-col">
    <div
      className={`w-12 h-12 bg-gradient-to-br ${gradient} text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-500`}
    >
      {icon}
    </div>
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
      {label}
    </p>
    <h3 className="text-2xl font-black tracking-tight mb-1 text-gray-900">
      {value}
    </h3>
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-auto">
      {subtitle}
    </p>
    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
  </div>
);

export const Dashboard = () => {
  const { user, profile, orders } = useOutletContext<any>();
  const { t } = useTranslation("account");
  const { localLink } = useLocale();

  const initials = profile
    ? `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase()
    : user?.displayName
      ? user.displayName
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
      : "U";

  const fullName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : user?.displayName || "Utilisateur";

  return (
    <div className="space-y-10 md:space-y-12 animate-in fade-in duration-700">
      {/* Premium Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-none mb-2 uppercase text-left">
            {t("dashboard.welcome", {
              name:
                profile?.firstName ||
                user?.displayName?.split(" ")[0] ||
                "Client",
            })}
          </h1>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/20">
              {t("dashboard.client_premium")}
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              {t("dashboard.member_since", {
                year: user?.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).getFullYear()
                  : "2026",
              })}
            </span>
          </div>
        </div>
      </div>
      {/* Stats Grid - Modern Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          label={t("dashboard.orders")}
          value={orders.length}
          icon={<Package size={24} weight="fill" />}
          gradient="from-[#1F222A] to-[#0F1115]"
          subtitle={t("dashboard.orders_sub")}
        />
        <StatCard
          label={t("dashboard.favorites")}
          value={profile?.wishlist?.length || 0}
          icon={<Heart size={24} weight="fill" />}
          gradient="from-[#FF5C00] to-[#FF8A00]"
          subtitle={t("dashboard.favorites_sub")}
        />
        <StatCard
          label={t("dashboard.total_spent")}
          value={`${orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0).toFixed(2)}€`}
          icon={<Globe size={24} weight="fill" />}
          gradient="from-[#00A859] to-[#00C86F]"
          subtitle={t("dashboard.total_spent_sub")}
        />
      </div>{" "}
      {/* Activity & Quick View */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Activity (2/3) */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between text-left">
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">
              {t("dashboard.recent_activity")}
            </h2>
            <Link
              to={localLink("/compte/commandes")}
              className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline"
            >
              {t("dashboard.view_all")}
            </Link>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order: any) => (
                <Link
                  key={order.id}
                  to={localLink("/compte/commandes")}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-[#2F333F]/35 rounded-3xl hover:border-primary hover:shadow-xl hover:shadow-gray-200/50 transition-all group relative overflow-hidden text-left"
                >
                  <div className="flex items-center gap-3 sm:gap-5 relative z-10 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all duration-500 shrink-0">
                      <Package size={20} className="sm:size-[24px]" weight="bold" />
                    </div>
                    <div className="text-left min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[9px] sm:text-[10px] font-black uppercase text-gray-400 tracking-wider">
                          {t("dashboard.order")}
                        </span>
                        <span className="px-2 py-0.5 bg-[#2F333F]/10 border border-[#2F333F]/20 text-[#2F333F] font-mono text-[10px] sm:text-xs font-black rounded-lg">
                          #{order.id.slice(-6).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-widest whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span className="w-1 h-1 bg-gray-200 rounded-full shrink-0"></span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[7px] sm:text-[8px] font-black uppercase tracking-wider ${
                            order.status?.toLowerCase() === "delivered"
                              ? "bg-[#00A859]/10 text-[#00A859] border border-[#00A859]/20"
                              : order.status?.toLowerCase() === "processing"
                                ? "bg-[#FF5C00]/10 text-[#FF5C00] border border-[#FF5C00]/20"
                                : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          }`}
                        >
                          {t(`orders_page.status_${order.status?.toLowerCase()}`, { defaultValue: order.status })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right relative z-10 shrink-0 pl-13 sm:pl-0">
                    <p className="text-base sm:text-lg font-black text-gray-900 leading-none">
                      {order.total?.toFixed(2)}€
                    </p>
                  </div>
                  {/* Decorative background number */}
                  <span className="absolute -right-4 -bottom-8 text-8xl font-black text-gray-50/50 select-none group-hover:text-primary/5 transition-colors pointer-events-none">
                    #{order.id.slice(-2)}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-[2.5rem] text-center border border-dashed border-gray-200">
              <Package
                size={48}
                weight="thin"
                className="text-gray-200 mx-auto mb-4"
              />
              <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">
                {t("dashboard.no_recent_orders")}
              </p>
            </div>
          )}
        </div>

        {/* Info / Quick Actions (1/3) */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight text-left">
            {t("dashboard.quick_profile")}
          </h2>
          <div className="bg-gradient-to-br from-[#1F222A] to-[#0F1115] border border-[#2F333F]/50 rounded-3xl p-6 text-white relative overflow-hidden shadow-2xl shadow-gray-900/40 text-left">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 bg-[#00A859] rounded-full animate-ping"></span>
                <p className="text-[10px] font-black text-[#00A859] uppercase tracking-widest">
                  {t("dashboard.verified_account")}
                </p>
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-6 line-clamp-1 text-white">
                {fullName}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white/70">
                  <UserIcon size={18} className="text-primary" weight="bold" />
                  <span className="text-xs font-bold truncate">
                    {user?.email}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <Phone size={18} className="text-primary" weight="bold" />
                  <span className="text-xs font-bold">
                    {profile?.phone || t("dashboard.not_specified")}
                  </span>
                </div>
              </div>
              <Link
                to={localLink("/compte/parametres")}
                className="mt-8 block w-full bg-transparent hover:bg-primary hover:text-white border border-primary text-primary rounded-2xl py-3.5 text-center text-[10px] font-black uppercase tracking-widest transition-all duration-300"
              >
                {t("dashboard.modify_profile")}
              </Link>
            </div>
            <div className="absolute -right-12 -top-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-[#00A859]/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileEdit = ({ profile, user }: any) => {
  const { t } = useTranslation("account");
  const [isEditing, setIsEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [formData, setFormData] = React.useState({
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    phone: profile?.phone || "",
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await setDocument("users", user.uid, {
        ...profile,
        ...formData,
        email: user.email,
        updatedAt: new Date().toISOString(),
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsEditing(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-8 border-t border-gray-100 text-left">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          {t("settings.personal_info")}
        </h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-gray-900 text-sm font-black uppercase tracking-widest flex items-center gap-2 hover:underline"
        >
          {isEditing ? (
            <>
              <X size={14} weight="bold" /> {t("settings.cancel")}
            </>
          ) : (
            <>
              <PencilSimple size={14} weight="bold" /> {t("settings.edit")}
            </>
          )}
        </button>
      </div>

      {isEditing ? (
        <div className="bg-white border-2 border-gray-100 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                {t("settings.first_name")}
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                {t("settings.last_name")}
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm text-gray-900"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                {t("settings.phone")}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm text-gray-900"
              />
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-gray-900 text-white font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-black transition-all disabled:opacity-50"
          >
            {loading ? (
              t("settings.saving")
            ) : success ? (
              <>
                <Check size={18} weight="bold" /> {t("settings.saved")}
              </>
            ) : (
              <>
                <FloppyDisk size={18} weight="bold" /> {t("settings.save")}
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoItem
            label={t("settings.full_name")}
            value={
              profile?.firstName
                ? `${profile.firstName} ${profile.lastName}`
                : user?.displayName || t("settings.not_specified")
            }
            icon={<UserIcon size={20} />}
          />
          <InfoItem
            label={t("settings.email")}
            value={user?.email}
            icon={<Check size={20} className="text-success" />}
          />
          <InfoItem
            label={t("settings.phone")}
            value={profile?.phone || t("settings.not_specified")}
            icon={<Phone size={20} />}
          />
        </div>
      )}
    </div>
  );
};

const InfoItem = ({ label, value, icon }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4 hover:border-primary/20 transition-colors group">
    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-0.5">
        {label}
      </p>
      <p className="text-sm font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const GdprTools = ({ profile, user }: any) => {
  const { t } = useTranslation("account");
  const [loading, setLoading] = React.useState(false);

  const handleExport = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify(
          {
            uid: user?.uid,
            email: user?.email,
            firstName: profile?.firstName || "",
            lastName: profile?.lastName || "",
            phone: profile?.phone || "",
            addresses: profile?.addresses || [],
            metadata: {
              creationTime: user?.metadata?.creationTime,
              lastSignInTime: user?.metadata?.lastSignInTime,
            },
          },
          null,
          2,
        ),
      );

    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `imex_donnees_${user?.uid || "client"}.json`,
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm(t("settings.gdpr_delete_confirm1"))) return;
    if (!window.confirm(t("settings.gdpr_delete_confirm2"))) return;

    setLoading(true);
    try {
      // 1. Supprimer le document profil dans Firestore
      await deleteDocument("users", user.uid);

      // 2. Supprimer le compte dans Firebase Authentication
      if (user && typeof user.delete === "function") {
        await user.delete();
      }

      alert(t("settings.gdpr_delete_success"));
      window.location.href = "/";
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/requires-recent-login") {
        alert(t("settings.gdpr_delete_reauth"));
      } else {
        alert(t("settings.gdpr_delete_error"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-8 border-t border-gray-100 text-left space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tighter mb-2">
          {t("settings.gdpr_title")}
        </h2>
        <p className="text-xs text-gray-400 font-medium max-w-3xl leading-relaxed">
          {t("settings.gdpr_desc")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Box 1: Portabilité des données */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex flex-col justify-between hover:shadow-2xl hover:shadow-gray-200/50 hover:border-primary/20 transition-all duration-300">
          <div className="space-y-4 mb-8">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
              <ShieldCheck size={24} weight="bold" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-2">
                {t("settings.gdpr_portability_title")}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                {t("settings.gdpr_portability_desc")}
              </p>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="w-full bg-gray-50 hover:bg-gray-100 border border-[#2F333F]/20 text-gray-900 text-[10px] font-black uppercase tracking-widest py-4 px-6 rounded-2xl transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
          >
            <DownloadSimple size={16} weight="bold" />
            {t("settings.gdpr_export_btn")}
          </button>
        </div>

        {/* Box 2: Droit à l'oubli */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-red-100/50 flex flex-col justify-between hover:shadow-2xl hover:shadow-red-500/5 hover:border-red-200 transition-all duration-300 relative overflow-hidden">
          <div className="space-y-4 mb-8">
            <div className="w-12 h-12 bg-red-50/60 text-red-500 rounded-2xl flex items-center justify-center">
              <Trash size={24} weight="bold" />
            </div>
            <div>
              <h3 className="text-sm font-black text-red-600 uppercase tracking-tight mb-2">
                {t("settings.gdpr_delete_title")}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                {t("settings.gdpr_delete_desc")}
              </p>
            </div>
          </div>
          <button
            onClick={handleDeleteAccount}
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest py-4 px-6 rounded-2xl transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-red-500/10 disabled:opacity-50 cursor-pointer"
          >
            <Trash size={16} weight="bold" />
            {loading ? t("settings.saving") : t("settings.gdpr_delete_btn")}
          </button>
        </div>
      </div>
    </div>
  );
};

export const Settings = () => {
  const { user, profile } = useOutletContext<any>();
  const { t } = useTranslation("account");
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tighter">
          {t("settings.title")}
        </h1>
      </div>

      <ProfileEdit profile={profile} user={user} />

      <div className="pt-8 border-t border-gray-100">
        <Addresses />
      </div>

      <div className="pt-8 border-t border-gray-100">
        <GdprTools profile={profile} user={user} />
      </div>
    </div>
  );
};

export const Orders = () => {
  const { orders } = useOutletContext<any>();
  const [currentPage, setCurrentPage] = React.useState(1);
  const { t } = useTranslation("account");
  const { localLink } = useLocale();
  const itemsPerPage = 5;

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = orders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tighter text-left">
          {t("orders_page.title")}
        </h1>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
          {t("orders_page.orders_count", { count: orders.length })}
        </p>
      </div>

      {orders.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4">
            {currentOrders.map((order: any) => (
              <div
                key={order.id}
                className="bg-white p-4 sm:p-5 rounded-3xl border border-[#2F333F] shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group overflow-hidden relative text-left"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-4 sm:gap-6 relative z-10">
                  {/* Column 1: Order Info & Product Thumbnails */}
                  <div className="flex items-start gap-3 sm:gap-4 col-span-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                      <Package size={20} className="sm:size-[24px]" weight="bold" />
                    </div>
                    <div className="space-y-2 text-left min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-[#2F333F]/10 border border-[#2F333F]/20 text-[#2F333F] font-mono text-xs font-black rounded-lg">
                          #{order.id.slice(-6).toUpperCase()}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-lg text-[8px] sm:text-[9px] font-black uppercase tracking-widest ${
                            order.status?.toLowerCase() === "delivered"
                              ? "bg-[#00A859]/10 text-[#00A859] border border-[#00A859]/20"
                              : order.status?.toLowerCase() === "processing"
                                ? "bg-[#FF5C00]/10 text-[#FF5C00] border border-[#FF5C00]/20"
                                : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          }`}
                        >
                          {t(`orders_page.status_${order.status?.toLowerCase()}`, { defaultValue: order.status })}
                        </span>
                      </div>
                      <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        {t("orders_page.date_prefix")}{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>

                      {/* Inline Product Thumbnails below details on column 1 */}
                      {order.items && order.items.length > 0 && (
                        <div className="flex gap-1.5 pt-1 flex-wrap">
                          {order.items.map((item: any, idx: number) => (
                            <div
                              key={idx}
                              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-gray-100 overflow-hidden bg-gray-50 group-hover:border-primary/20 transition-colors shrink-0"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Column 2: Empty Spacer for Middle Column */}
                  <div className="hidden md:block col-span-1"></div>

                  {/* Column 3: Totals & Articles count */}
                  <div className="flex items-center justify-between md:justify-end gap-6 sm:gap-10 col-span-1 border-t md:border-t-0 pt-3 md:pt-0 border-gray-50 text-right w-full">
                    <div className="text-left md:text-right">
                      <p className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        {t("orders_page.articles")}
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-gray-900">
                        {t("orders_page.items_count", {
                          count: order.items?.length || 0,
                        })}
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        {t("orders_page.total")}
                      </p>
                      <p className="text-lg sm:text-xl font-black text-gray-900 leading-none">
                        {order.total?.toFixed(2)}€
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decorative background ID */}
                <span className="absolute -right-4 -bottom-6 text-7xl font-black text-gray-50/30 select-none group-hover:text-gray-900/5 transition-colors pointer-events-none">
                  #{order.id.slice(-2)}
                </span>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-[#2F333F]/30 hover:border-primary hover:text-primary rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-30 disabled:hover:border-[#2F333F]/30 disabled:hover:text-gray-400 transition-colors cursor-pointer"
              >
                {t("orders_page.prev")}
              </button>

              <div className="flex items-center gap-1.5 px-2">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-xl text-xs font-black flex items-center justify-center border transition-all cursor-pointer ${
                        isActive
                          ? "bg-primary border-primary text-white shadow-md shadow-primary/20 scale-105"
                          : "bg-white border-[#2F333F]/30 text-gray-500 hover:border-primary hover:text-primary"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-[#2F333F]/30 hover:border-primary hover:text-primary rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-30 disabled:hover:border-[#2F333F]/30 disabled:hover:text-gray-400 transition-colors cursor-pointer"
              >
                {t("orders_page.next")}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-100">
          <Package
            size={64}
            weight="thin"
            className="text-gray-200 mx-auto mb-6"
          />
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
            {t("orders_page.empty_title")}
          </p>
          <Link
            to={localLink("/boutique")}
            className="inline-block mt-8 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-8 py-4 rounded-xl shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
          >
            {t("orders_page.empty_cta")}
          </Link>
        </div>
      )}
    </div>
  );
};

export const Addresses = () => {
  const { user, profile } = useOutletContext<any>();
  const { t } = useTranslation("account");
  const [isEditing, setIsEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    address: "",
    city: "",
    zipCode: "",
    country: "France",
  });

  const openEdition = (addr: any) => {
    setFormData({
      address: addr.address || "",
      city: addr.city || "",
      zipCode: addr.zipCode || "",
      country: addr.country || "France",
    });
    setEditingId(addr.id);
    setIsEditing(true);
  };

  const openCreation = () => {
    setFormData({
      address: "",
      city: "",
      zipCode: "",
      country: "France",
    });
    setEditingId(null);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId === "root-default") {
        await setDocument("users", user.uid, {
          ...profile,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country,
          updatedAt: new Date().toISOString(),
        });
      } else if (editingId) {
        const updatedAddresses = profile.addresses.map((a: any) =>
          a.id === editingId ? { ...a, ...formData } : a,
        );
        await setDocument("users", user.uid, {
          ...profile,
          addresses: updatedAddresses,
          updatedAt: new Date().toISOString(),
        });
      } else {
        const newAddress = {
          id: `addr-${Date.now()}`,
          firstName: profile.firstName,
          lastName: profile.lastName,
          ...formData,
          isDefault:
            (profile?.addresses || []).length === 0 && !profile.address,
        };
        const currentAddresses = profile.addresses || [];
        await setDocument("users", user.uid, {
          ...profile,
          addresses: [...currentAddresses, newAddress],
          updatedAt: new Date().toISOString(),
        });
      }
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsEditing(false);
        setEditingId(null);
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    if (window.confirm(t("settings.confirm_delete_address"))) {
      setLoading(true);
      try {
        const updatedAddresses = (profile.addresses || []).filter(
          (a: any) => a.id !== addressId,
        );
        await setDocument("users", user.uid, {
          ...profile,
          addresses: updatedAddresses,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tighter">
          {t("settings.addresses_title")}
        </h1>
        <button
          onClick={
            isEditing
              ? () => {
                  setIsEditing(false);
                  setEditingId(null);
                }
              : openCreation
          }
          className="bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-black transition-all flex items-center gap-2 shadow-xl shadow-gray-900/10"
        >
          {isEditing ? (
            <>
              <X size={14} weight="bold" /> {t("settings.cancel")}
            </>
          ) : (
            <>
              <Plus size={14} weight="bold" /> {t("settings.add_address")}
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(() => {
          let savedAddresses = profile?.addresses || [];
          if (
            profile?.address &&
            !savedAddresses.some((a: any) => a.id === "root-default")
          ) {
            savedAddresses.unshift({
              id: "root-default",
              firstName: profile.firstName,
              lastName: profile.lastName,
              address: profile.address,
              city: profile.city,
              zipCode: profile.zipCode,
              country: profile.country,
              isDefault: true,
            });
          }

          if (savedAddresses.length === 0 && !isEditing) {
            return (
              <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-100 md:col-span-2">
                <MapPin
                  size={64}
                  weight="thin"
                  className="text-gray-200 mx-auto mb-6"
                />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {t("settings.no_saved_addresses")}
                </p>
              </div>
            );
          }

          return savedAddresses.map((addr: any) => (
            <div
              key={addr.id}
              className={`bg-white p-8 rounded-[2.5rem] border-2 transition-all relative group hover:shadow-2xl hover:shadow-gray-200/50 ${addr.isDefault ? "border-primary/10" : "border-gray-50 hover:border-primary/10"}`}
            >
              {addr.isDefault && (
                <span className="absolute top-8 right-8 bg-primary text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg shadow-sm">
                  {t("settings.primary_address")}
                </span>
              )}

              <div className="space-y-6">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${addr.isDefault ? "bg-primary text-white" : "bg-gray-50 text-gray-400"}`}
                >
                  <MapPin size={24} weight="bold" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 uppercase tracking-tight text-xl mb-2">
                    {addr.city}
                  </h3>
                  <p className="text-sm font-bold text-gray-900">
                    {addr.firstName} {addr.lastName}
                  </p>
                  <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
                    {addr.address}
                    <br />
                    {addr.zipCode} {addr.city}, {addr.country}
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                  <button
                    onClick={() => openEdition(addr)}
                    className="text-[9px] font-black uppercase tracking-widest text-gray-900 hover:underline flex items-center gap-1.5"
                  >
                    <PencilSimple size={14} weight="bold" />{" "}
                    {t("settings.edit")}
                  </button>
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="text-[9px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 flex items-center gap-1.5"
                    >
                      <Trash size={14} weight="bold" /> {t("settings.delete")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ));
        })()}
      </div>

      {isEditing && (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSave}
          className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-gray-200/50 space-y-8 border border-gray-50"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                {t("settings.address_label")}
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 outline-none focus:border-primary transition-all font-bold text-sm text-gray-900"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                  {t("settings.zip_code")}
                </label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) =>
                    setFormData({ ...formData, zipCode: e.target.value })
                  }
                  required
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 outline-none focus:border-primary transition-all font-bold text-sm text-gray-900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                  {t("settings.city")}
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  required
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 outline-none focus:border-primary transition-all font-bold text-sm text-gray-900"
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gray-900 text-white font-black uppercase tracking-widest py-5 rounded-2xl shadow-xl hover:bg-black transition-all active:scale-[0.98]"
          >
            {t("settings.save_address")}
          </button>
        </motion.form>
      )}
    </div>
  );
};

export const Favorites = () => {
  const { toggleWishlist, wishlist } = useWishlist();
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 4;
  const { t, i18n } = useTranslation("account");
  const { localLink } = useLocale();
  const isFR = (i18n.language || "pt").startsWith("fr");

  const totalPages = Math.ceil(wishlist.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = wishlist.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tighter">
          {t("favorites_page.title")}
        </h1>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
          {t("favorites_page.articles_count", { count: wishlist.length })}
        </p>
      </div>

      {wishlist.length > 0 ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentItems.map((product: any) => {
              const displayName = isFR
                ? product.nameFR || product.name
                : product.name;
              return (
                <div
                  key={product.id}
                  className="bg-white p-4 rounded-[2.5rem] border border-[#2F333F] shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all group relative"
                >
                  <div className="aspect-square relative overflow-hidden bg-gray-50 rounded-[2rem] mb-4">
                    <img
                      src={product.image}
                      alt={displayName}
                      className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700"
                    />
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-4 right-4 bg-white shadow-lg p-2.5 rounded-xl text-primary hover:bg-primary hover:text-white transition-all group-hover:rotate-12"
                    >
                      <Heart size={20} weight="fill" />
                    </button>
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      {product.category}
                    </p>
                    <h3 className="text-xs font-black text-gray-900 line-clamp-1 mb-4 uppercase tracking-tight">
                      {displayName}
                    </h3>
                    <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                      <p className="text-sm font-black text-gray-900">
                        {product.price?.toFixed(2)}€
                      </p>
                      <Link
                        to={localLink(`/?product=${product.id}`)}
                        className="text-[9px] font-black uppercase tracking-widest text-gray-900 hover:underline"
                      >
                        {t("favorites_page.details")}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-[#2F333F]/30 hover:border-primary hover:text-primary rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-30 disabled:hover:border-[#2F333F]/30 disabled:hover:text-gray-400 transition-colors cursor-pointer"
              >
                {t("favorites_page.prev")}
              </button>

              <div className="flex items-center gap-1.5 px-2">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-xl text-xs font-black flex items-center justify-center border transition-all cursor-pointer ${
                        isActive
                          ? "bg-primary border-primary text-white shadow-md shadow-primary/20 scale-105"
                          : "bg-white border-[#2F333F]/30 text-gray-500 hover:border-primary hover:text-primary"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-[#2F333F]/30 hover:border-primary hover:text-primary rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-30 disabled:hover:border-[#2F333F]/30 disabled:hover:text-gray-400 transition-colors cursor-pointer"
              >
                {t("favorites_page.next")}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-100">
          <Heart
            size={64}
            weight="fill"
            className="text-gray-200 mx-auto mb-6 opacity-20"
          />
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-8">
            {t("favorites_page.empty")}
          </p>
          <Link
            to={localLink("/boutique")}
            className="inline-block bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest px-10 py-4 rounded-xl shadow-xl hover:bg-black transition-all"
          >
            {t("favorites_page.empty_cta")}
          </Link>
        </div>
      )}
    </div>
  );
};

export const Support = () => {
  const { user, profile } = useOutletContext<any>();
  const { t } = useTranslation("account");
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [subject, setSubject] = React.useState("Question sur ma commande");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setMessage("");
      setTimeout(() => setSuccess(false), 5000);
    }, 1000);
  };

  const fullName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : user?.displayName || "Client";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tighter">
          {t("support_page.title")}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Column */}
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-[#2F333F]/35 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-2">
              {t("support_page.send_request")}
            </h3>
            <p className="text-xs text-gray-400 font-medium">
              {t("support_page.support_desc")}
            </p>
          </div>

          {success ? (
            <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-2xl flex flex-col items-center text-center space-y-2">
              <Check
                size={32}
                className="text-green-600 bg-white p-1.5 rounded-full shadow-sm"
              />
              <p className="text-xs font-bold uppercase tracking-wider">
                {t("support_page.success_title")}
              </p>
              <p className="text-[11px] font-medium opacity-90">
                {t("support_page.success_desc")}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                    {t("support_page.your_name")}
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    disabled
                    className="w-full bg-gray-50 border border-[#2F333F]/35 rounded-xl p-4 outline-none font-medium text-xs text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                    {t("support_page.your_email")}
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full bg-gray-50 border border-[#2F333F]/35 rounded-xl p-4 outline-none font-medium text-xs text-gray-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                  {t("support_page.subject")}
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-gray-50 border border-[#2F333F]/35 rounded-xl p-4 outline-none focus:border-primary transition-all font-medium text-xs text-gray-900 cursor-pointer"
                >
                  <option value="Question sur ma commande">
                    {t("support_page.subject_order")}
                  </option>
                  <option value="Problème technique de livraison">
                    {t("support_page.subject_delivery")}
                  </option>
                  <option value="Retour de produit / Remboursement">
                    {t("support_page.subject_return")}
                  </option>
                  <option value="Autre question">
                    {t("support_page.subject_other")}
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                  {t("support_page.your_message")}
                </label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("support_page.message_placeholder")}
                  required
                  className="w-full bg-gray-50 border border-[#2F333F]/35 rounded-xl p-4 outline-none focus:border-primary transition-all font-medium text-xs text-gray-900 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white font-black uppercase tracking-widest py-4 rounded-xl hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95 text-[10px]"
              >
                <span>
                  {loading
                    ? t("support_page.sending")
                    : t("support_page.send_btn")}
                </span>
                <PaperPlaneTilt size={16} weight="bold" />
              </button>
            </form>
          )}
        </div>

        {/* Info Column */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-[2rem] border border-[#2F333F]/35 flex items-start gap-4 shadow-sm">
              <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0">
                <Phone size={24} weight="bold" />
              </div>
              <div>
                <h3 className="font-black text-gray-900 uppercase text-xs mb-1 tracking-wider">
                  {t("support_page.phone")}
                </h3>
                <p className="text-sm font-bold text-gray-700">
                  +351 000 000 000
                </p>
                <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-widest font-black">
                  {t("support_page.phone_hours")}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-[#2F333F]/35 flex items-start gap-4 shadow-sm">
              <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0">
                <EnvelopeSimple size={24} weight="bold" />
              </div>
              <div>
                <h3 className="font-black text-gray-900 uppercase text-xs mb-1 tracking-wider">
                  {t("support_page.email_direct")}
                </h3>
                <p className="text-sm font-bold text-gray-700">
                  contact@imexmercado.pt
                </p>
                <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-widest font-black">
                  {t("support_page.support_label")}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#2F333F] text-white p-8 rounded-[2.5rem] border border-[#2F333F]/20 relative overflow-hidden flex-grow flex flex-col justify-center">
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 50%, #fff 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />
            <h4 className="font-black uppercase text-sm mb-3 relative z-10 text-white tracking-wider">
              {t("support_page.faq_title")}
            </h4>
            <div className="space-y-3 relative z-10 text-xs text-gray-300">
              <div>
                <p className="font-bold text-white mb-0.5">
                  {t("support_page.faq_q1")}
                </p>
                <p className="opacity-80">{t("support_page.faq_a1")}</p>
              </div>
              <div>
                <p className="font-bold text-white mb-0.5">
                  {t("support_page.faq_q2")}
                </p>
                <p className="opacity-80">{t("support_page.faq_a2")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
