import React from "react";
import { motion } from "framer-motion";
import { Link, useOutletContext } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle,
  MagnifyingGlass,
  Warning,
  Check,
} from "@phosphor-icons/react";
import { getCollection, useAuth } from "@imexmercado/firebase";
import { useTranslation } from "react-i18next";
import { useSEO } from "../hooks/useSEO";

export function TrackingPage() {
  useSEO("tracking");
  const { t } = useTranslation(["tracking"]);

  const [orderIdInput, setOrderIdInput] = React.useState("");
  const [emailInput, setEmailInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [foundOrder, setFoundOrder] = React.useState<any | null>(null);
  const [searched, setSearched] = React.useState(false);

  // Try to get parent dashboard layout context (user, orders)
  let dashboardContext: any = null;
  try {
    dashboardContext = useOutletContext();
  } catch (e) {
    // Silently ignore if not nested inside the Account Dashboard
  }

  const isInDashboard = !!(dashboardContext && typeof dashboardContext.orders !== "undefined");

  // Fallback to direct useAuth if accessed via public route but user is logged in
  const authContext = useAuth();
  const currentUser = dashboardContext?.user || authContext?.user;
  const userOrders = dashboardContext?.orders || [];

  // 1. Auto-prefill email from auth state
  React.useEffect(() => {
    if (currentUser?.email && !emailInput) {
      setEmailInput(currentUser.email);
    }
  }, [currentUser, emailInput]);

  // 2. Auto-prefill the latest order ID if the user has orders in dashboard context
  React.useEffect(() => {
    if (userOrders && userOrders.length > 0 && !orderIdInput) {
      const latestOrder = userOrders[0];
      if (latestOrder && latestOrder.id) {
        setOrderIdInput(latestOrder.id.toUpperCase());
      }
    }
  }, [userOrders, orderIdInput]);

  const performSearch = async (orderId: string, email: string) => {
    if (!orderId.trim() || !email.trim()) {
      setError(t("tracking:errors.all_fields"));
      return;
    }

    setLoading(true);
    setError(null);
    setFoundOrder(null);
    setSearched(true);

    try {
      const orders = await getCollection("orders");
      const cleanInputId = orderId
        .trim()
        .toLowerCase()
        .replace("imx-", "")
        .replace("#", "");
      const cleanEmail = email.trim().toLowerCase();

      const matched = orders.find((order: any) => {
        const orderEmail = (order.userEmail || "").toLowerCase();
        const fullId = (order.id || "").toLowerCase();
        const shortId = fullId.slice(-6);

        const emailMatches = orderEmail === cleanEmail;
        const idMatches =
          fullId === cleanInputId ||
          fullId.includes(cleanInputId) ||
          shortId === cleanInputId;

        return emailMatches && idMatches;
      });

      if (matched) {
        setFoundOrder(matched);
      } else {
        setError(t("tracking:errors.not_found"));
      }
    } catch (err) {
      console.error(err);
      setError(t("tracking:errors.network"));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(orderIdInput, emailInput);
  };

  // 3. Trigger auto-search once when pre-filled fields are successfully populated
  React.useEffect(() => {
    if (
      isInDashboard &&
      orderIdInput &&
      emailInput &&
      !searched &&
      !loading &&
      !foundOrder
    ) {
      performSearch(orderIdInput, emailInput);
    }
  }, [
    isInDashboard,
    orderIdInput,
    emailInput,
    searched,
    loading,
    foundOrder,
  ]);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  // Determine current timeline status steps
  const status = (foundOrder?.status || "").toLowerCase();
  const isPrepDone = true;
  const isTransitDone =
    status === "shipped" || status === "sent" || status === "delivered";
  const isDeliveredDone = status === "delivered";

  return (
    <div className="bg-bg min-h-screen font-sans selection:bg-primary/10 pb-24">
      {/* ─── Breadcrumbs ─── */}
      <div className="bg-white border-b border-gray-50">
        <div className="container mx-auto px-4 py-4 md:py-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">
          <Link to="/" className="hover:text-primary transition-colors">
            {t("tracking:breadcrumb_home")}
          </Link>
          <span className="text-gray-200">/</span>
          <span className="text-gray-900">
            {t("tracking:breadcrumb_current")}
          </span>
        </div>
      </div>

      {/* ─── Main Unified Card ─── */}
      <section className="container mx-auto px-4 pt-6 md:pt-12">
        <motion.div
          {...fadeIn}
          className="bg-white rounded-3xl border-2 border-[#2F333F]/35 shadow-xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column: Tracking Form */}
            <div className="p-6 md:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-gray-100 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-16 -mt-16 pointer-events-none opacity-50" />

              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 text-primary shadow-inner relative z-10">
                <MagnifyingGlass size={32} weight="duotone" />
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4 relative z-10 leading-tight">
                {t("tracking:title_main")} <br />
                <span className="text-primary">{t("tracking:title_sub")}</span>
              </h1>
              <p className="text-sm md:text-base text-gray-500 max-w-md leading-relaxed font-medium mb-10 relative z-10">
                {t("tracking:description")}
              </p>

              <form
                className="space-y-4 md:space-y-6 relative z-10"
                onSubmit={handleSearch}
              >
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 text-xs font-bold">
                    <Warning size={18} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                    {t("tracking:fields.order_number")}
                  </label>
                  {isInDashboard && userOrders.length > 0 ? (
                    <select
                      value={orderIdInput}
                      onChange={(e) => {
                        setOrderIdInput(e.target.value);
                        performSearch(e.target.value, emailInput);
                      }}
                      required
                      className="w-full bg-gray-50 border border-[#2F333F]/35 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-bold text-sm cursor-pointer"
                    >
                      <option value="" disabled>
                        {t("tracking:fields.placeholder_order")}
                      </option>
                      {userOrders.map((order: any) => (
                        <option key={order.id} value={order.id.toUpperCase()}>
                          IMX-{order.id.slice(-6).toUpperCase()} ({order.total?.toFixed(2)}€ - {new Date(order.createdAt).toLocaleDateString()})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={orderIdInput}
                      onChange={(e) => setOrderIdInput(e.target.value)}
                      placeholder={t("tracking:fields.placeholder_order")}
                      required
                      className="w-full bg-gray-50 border border-[#2F333F]/35 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-bold text-sm"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                    {t("tracking:fields.email")}
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="votre@email.com"
                    required
                    className="w-full bg-gray-50 border border-[#2F333F]/35 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-bold text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 text-white font-black uppercase tracking-widest py-4 rounded-xl hover:bg-primary transition-all shadow-lg active:scale-95 text-xs mt-4 disabled:opacity-50 cursor-pointer"
                >
                  {loading
                    ? t("tracking:fields.btn_searching")
                    : t("tracking:fields.btn_search")}
                </button>
              </form>
            </div>

            {/* Right Column: Information & Timeline Visual */}
            <div className="bg-gray-50/50 p-6 md:p-16 flex flex-col justify-center">
              {loading || (isInDashboard && !orderIdInput && !searched) ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {t("tracking:fields.btn_searching")}
                  </p>
                </div>
              ) : foundOrder ? (
                <div className="space-y-8">
                  <div className="bg-green-50 border border-green-200 p-6 rounded-2xl flex gap-4 items-start shadow-sm">
                    <div className="bg-green-100 text-green-600 p-2 rounded-lg shrink-0 mt-1">
                      <Check size={20} weight="bold" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-green-900 mb-1">
                        {t("tracking:success.identified")}
                      </p>
                      <p className="text-xs text-green-800 font-medium leading-relaxed">
                        {t("tracking:success.order_owner", {
                          id: foundOrder.id.slice(-6).toUpperCase(),
                        })}
                        <span className="font-bold">{foundOrder.userName}</span>
                        .
                      </p>
                    </div>
                  </div>

                  <h3 className="font-black text-gray-900 uppercase tracking-tighter text-lg">
                    {t("tracking:success.status_title")}
                  </h3>

                  {/* Dynamic Timeline */}
                  <div className="relative pl-6 space-y-8 before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-gray-200">
                    {/* Step 1 */}
                    <div
                      className={`relative z-10 flex items-center gap-6 ${isPrepDone ? "" : "opacity-40"}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center absolute -left-[27px] ${isPrepDone ? "border-primary" : "border-gray-300"}`}
                      >
                        {isPrepDone && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                      <div className="bg-white p-5 rounded-xl border border-[#2F333F]/35 shadow-sm flex-1">
                        <p className="text-sm font-bold text-gray-900">
                          {t("tracking:success.step_prep")}
                        </p>
                        <p className="text-[10px] uppercase text-gray-400 font-black mt-1">
                          {t("tracking:success.step_prep_sub")}
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div
                      className={`relative z-10 flex items-center gap-6 ${isTransitDone ? "" : "opacity-40"}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center absolute -left-[27px] ${isTransitDone ? "border-primary" : "border-gray-300"}`}
                      >
                        {isTransitDone && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                      <div className="bg-white p-5 rounded-xl border border-[#2F333F]/35 flex-1">
                        <p className="text-sm font-bold text-gray-900">
                          {t("tracking:success.step_transit")}
                        </p>
                        <p className="text-[10px] uppercase text-gray-400 font-black mt-1">
                          {t("tracking:success.step_transit_sub")}
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div
                      className={`relative z-10 flex items-center gap-6 ${isDeliveredDone ? "" : "opacity-40"}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center absolute -left-[27px] ${isDeliveredDone ? "border-primary" : "border-gray-300"}`}
                      >
                        {isDeliveredDone && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                      <div className="bg-white p-5 rounded-xl border border-[#2F333F]/35 flex-1">
                        <p className="text-sm font-bold text-gray-900">
                          {t("tracking:success.step_delivered")}
                        </p>
                        <p className="text-[10px] uppercase text-gray-400 font-black mt-1">
                          {t("tracking:success.step_delivered_sub")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery details card */}
                  <div className="bg-white p-6 rounded-2xl border border-[#2F333F]/35 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-900">
                      {t("tracking:success.details_title")}
                    </h4>
                    <div className="text-xs text-gray-600 space-y-1.5">
                      <p>
                        <span className="font-bold text-gray-900">
                          {t("tracking:success.address_label")}
                        </span>{" "}
                        {foundOrder.shippingAddress.address},{" "}
                        {foundOrder.shippingAddress.zipCode}{" "}
                        {foundOrder.shippingAddress.city},{" "}
                        {foundOrder.shippingAddress.country}
                      </p>
                      <p>
                        <span className="font-bold text-gray-900">
                          {t("tracking:success.total_label")}
                        </span>{" "}
                        {foundOrder.total?.toFixed(2)}€
                      </p>
                      <p>
                        <span className="font-bold text-gray-900">
                          {t("tracking:success.items_label")}
                        </span>{" "}
                        {foundOrder.items
                          ?.map((it: any) => `${it.name} (x${it.quantity})`)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                </div>
              ) : searched ? (
                <div className="text-center p-8 bg-white border border-red-100 rounded-3xl space-y-4">
                  <Warning size={48} className="text-red-400 mx-auto" />
                  <h4 className="font-black text-red-600 uppercase text-sm">
                    {t("tracking:errors.not_found")}
                  </h4>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                    {t("tracking:errors.not_found")}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Info Alert */}
                  <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex gap-4 items-start shadow-sm">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg shrink-0 mt-1">
                      <Package size={20} weight="fill" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-900 mb-1">
                        {t("tracking:info.update_title")}
                      </p>
                      <p className="text-xs text-blue-800 font-medium leading-relaxed">
                        {t("tracking:info.update_desc")}
                      </p>
                    </div>
                  </div>

                  <h3 className="font-black text-gray-900 uppercase tracking-tighter text-lg mb-8">
                    {t("tracking:info.pathway_title")}
                  </h3>

                  {/* Static Timeline Illustration */}
                  <div className="relative pl-6 space-y-8 before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-gray-200">
                    {/* Step 1 */}
                    <div className="relative z-10 flex items-center gap-6">
                      <div className="w-6 h-6 rounded-full bg-white border-2 border-primary flex items-center justify-center absolute -left-[27px]">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      </div>
                      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex-1">
                        <p className="text-sm font-bold text-gray-900">
                          {t("tracking:success.step_prep")}
                        </p>
                        <p className="text-[10px] uppercase text-gray-400 font-black mt-1">
                          Alhos Vedros, PT
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative z-10 flex items-center gap-6 opacity-60">
                      <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center absolute -left-[27px]">
                        <Truck
                          size={12}
                          className="text-gray-400"
                          weight="bold"
                        />
                      </div>
                      <div className="bg-white p-5 rounded-xl border border-gray-100 flex-1">
                        <p className="text-sm font-bold text-gray-500">
                          {t("tracking:success.step_transit")}
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative z-10 flex items-center gap-6 opacity-60">
                      <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center absolute -left-[27px]">
                        <CheckCircle
                          size={12}
                          className="text-gray-400"
                          weight="bold"
                        />
                      </div>
                      <div className="bg-white p-5 rounded-xl border border-gray-100 flex-1">
                        <p className="text-sm font-bold text-gray-500">
                          {t("tracking:success.step_delivered")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
