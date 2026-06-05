import React, { useEffect, useState } from "react";
import {
  Package,
  ShoppingCart,
  Calendar,
  User,
  CreditCard,
  CaretRight,
  Funnel,
  Export,
  MagnifyingGlass,
  ArrowClockwise,
  X,
  Truck,
  Check,
  Eye,
} from "@phosphor-icons/react";
import { subscribeToCollection, updateDocument } from "@imexmercado/firebase";
import { sendAutomatedEmail } from "../utils/emailHelper";

export function OrdersView() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Drawer state
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [statusInput, setStatusInput] = useState("");
  const [carrierInput, setCarrierInput] = useState("");
  const [trackingNumInput, setTrackingNumInput] = useState("");
  const [trackingLinkInput, setTrackingLinkInput] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToCollection("orders", (data) => {
      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setOrders(sorted);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing":
        return "bg-orange-50 text-orange-600 border-orange-100";
      case "Shipped":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "Delivered":
        return "bg-green-50 text-green-600 border-green-100";
      case "Cancelled":
        return "bg-red-50 text-red-600 border-red-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  const handleOpenOrder = (order: any) => {
    setSelectedOrder(order);
    setStatusInput(order.status || "Processing");
    setCarrierInput(order.carrier || "");
    setTrackingNumInput(order.trackingNumber || "");
    setTrackingLinkInput(order.trackingLink || "");
  };

  const handleSaveChanges = async () => {
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      const updateData = {
        status: statusInput,
        carrier: carrierInput,
        trackingNumber: trackingNumInput,
        trackingLink: trackingLinkInput,
      };

      await updateDocument("orders", selectedOrder.id, updateData);

      // If status changed to Shipped, trigger the Shipment email!
      if (statusInput === "Shipped" && selectedOrder.status !== "Shipped") {
        const items = selectedOrder.items || [];
        await sendAutomatedEmail("order_shipped", selectedOrder.userEmail, {
          customerName: selectedOrder.userName,
          orderId: selectedOrder.id,
          items: items.map((i: any) => ({
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          totalPrice: selectedOrder.total?.toFixed(2) + "€",
          trackingNumber: trackingNumInput || "N/A",
          trackingLink:
            trackingLinkInput ||
            "https://www.google.com/search?q=" +
              encodeURIComponent(trackingNumInput),
        });
      }

      setSelectedOrder(null);
      alert("✅ Commande mise à jour et synchronisée avec succès !");
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la mise à jour.");
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 md:space-y-8 relative">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-left">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Suivi Commandes
          </h2>
          <p className="text-sm font-medium text-gray-500">
            Gerez le flux de vos ventes en temps réel.
          </p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <button
            disabled={loading}
            className="p-3.5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-all shadow-sm active:scale-90 disabled:opacity-50"
          >
            <ArrowClockwise
              size={20}
              className={loading ? "animate-spin" : ""}
            />
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-gray-100 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-all shadow-sm active:scale-95">
            <Export size={16} weight="bold" />
            <span className="hidden sm:inline">Exporter</span>
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-gray-200 hover:scale-105 transition-transform active:scale-95">
            <Funnel size={16} weight="bold" />
            <span className="hidden sm:inline">Filtrer</span>
            <span className="sm:hidden">Filtres</span>
          </button>
        </div>
      </div>

      {/* Modern Search Field */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <MagnifyingGlass
            size={20}
            className="text-gray-400 group-focus-within:text-primary transition-colors"
          />
        </div>
        <input
          type="text"
          placeholder="Client, Email, ID commande..."
          className="w-full bg-white border border-gray-100 rounded-[2rem] py-5 md:py-6 pl-14 pr-8 text-sm font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary/20 outline-none transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading && orders.length === 0 ? (
          <div className="py-20 text-center animate-pulse">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Synchronisation...
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[2.5rem] border border-gray-100">
            <ShoppingCart
              size={48}
              className="mx-auto text-gray-100 mb-4"
              weight="thin"
            />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Aucune commande
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={`order-${order.id}`}
              onClick={() => handleOpenOrder(order)}
              className="bg-white p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-gray-200 shadow-sm transition-all hover:shadow-xl hover:border-primary/10 group cursor-pointer"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8">
                {/* Order Identity & Customer */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 md:gap-8 flex-grow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                      <ShoppingCart size={22} weight="bold" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-black text-gray-900 tracking-tight">
                        ORD-
                        {order.id.replace("ORD-", "").slice(-6).toUpperCase()}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="h-10 w-px bg-gray-100 hidden sm:block" />

                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 bg-gray-50 border border-gray-100 text-gray-400 rounded-xl flex items-center justify-center font-black text-xs uppercase group-hover:border-primary/20 group-hover:text-primary transition-colors">
                      {order.userName
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("") || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {order.userName}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium truncate max-w-[150px] md:max-w-none">
                        {order.userEmail}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status, Pricing & Actions */}
                <div className="flex items-center justify-between lg:justify-end gap-6 md:gap-10 border-t border-gray-50 pt-6 lg:border-0 lg:pt-0">
                  <div className="text-left lg:text-right">
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.15em] mb-2">
                      Etat
                    </p>
                    <span
                      className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="text-left lg:text-right flex-grow sm:flex-grow-0">
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.15em] mb-1">
                      Montant
                    </p>
                    <p className="text-lg font-black text-gray-900 tracking-tight">
                      {order.total?.toLocaleString("fr-FR")}€
                    </p>
                  </div>

                  <div className="hidden sm:flex p-3 bg-gray-50 text-gray-300 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-all">
                    <CaretRight size={20} weight="bold" />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Slide-out Order Details Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedOrder(null)}
          />

          {/* Drawer content */}
          <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-black uppercase tracking-widest">
                  Détails Commande
                </span>
                <h3 className="text-lg font-black text-gray-900 mt-1">
                  ORD-
                  {selectedOrder.id.replace("ORD-", "").slice(-6).toUpperCase()}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            {/* Scrollable details */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 text-left">
              {/* Customer Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">
                  Client & Livraison
                </h4>
                <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100 space-y-3">
                  <p className="text-sm font-bold text-gray-900">
                    {selectedOrder.userName}
                  </p>
                  <p className="text-xs text-gray-600">
                    Email :{" "}
                    <span className="font-bold text-gray-900">
                      {selectedOrder.userEmail}
                    </span>
                  </p>
                  <p className="text-xs text-gray-600">
                    Tél :{" "}
                    <span className="font-bold text-gray-900">
                      {selectedOrder.userPhone || "Non renseigné"}
                    </span>
                  </p>
                  <hr className="border-gray-100" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                      Adresse de livraison
                    </p>
                    <p className="text-xs text-gray-700 leading-relaxed font-medium">
                      {selectedOrder.shippingAddress?.address}
                      <br />
                      {selectedOrder.shippingAddress?.zipCode}{" "}
                      {selectedOrder.shippingAddress?.city},{" "}
                      {selectedOrder.shippingAddress?.country}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">
                  Articles Commandés
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div
                      key={`item-${idx}`}
                      className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                        />
                      )}
                      <div className="flex-grow min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                          {item.price}€ x {item.quantity}
                        </p>
                      </div>
                      <p className="text-xs font-black text-gray-900">
                        {(item.price * item.quantity).toFixed(2)}€
                      </p>
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-xs font-bold text-gray-500">
                      Livraison :
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      {selectedOrder.shippingPrice
                        ? `${selectedOrder.shippingPrice}€`
                        : "Gratuit"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 border-t border-gray-100">
                    <span className="text-sm font-black text-gray-900">
                      Total :
                    </span>
                    <span className="text-lg font-black text-primary">
                      {selectedOrder.total?.toFixed(2)}€
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit Status panel */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">
                  Modifier l'État & Expédition
                </h4>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 pl-1">
                      Statut
                    </label>
                    <select
                      value={statusInput}
                      onChange={(e) => setStatusInput(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/10 outline-none"
                    >
                      <option value="Processing">Processing (En cours)</option>
                      <option value="Awaiting Payment">
                        Awaiting Payment (En attente de paiement)
                      </option>
                      <option value="Shipped">Shipped (Expédiée)</option>
                      <option value="Delivered">Delivered (Livrée)</option>
                      <option value="Cancelled">Cancelled (Annulée)</option>
                    </select>
                  </div>

                  {statusInput === "Shipped" && (
                    <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-3 animate-in fade-in duration-200">
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">
                        Informations de livraison
                      </p>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 pl-0.5">
                            Transporteur
                          </label>
                          <input
                            type="text"
                            placeholder="DHL, CTT, DPD..."
                            value={carrierInput}
                            onChange={(e) => setCarrierInput(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-xl py-2 px-3 text-xs font-bold focus:ring-2 focus:ring-primary/10 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 pl-0.5">
                            Numéro de suivi
                          </label>
                          <input
                            type="text"
                            placeholder="RF123456789PT"
                            value={trackingNumInput}
                            onChange={(e) =>
                              setTrackingNumInput(e.target.value)
                            }
                            className="w-full bg-white border border-gray-100 rounded-xl py-2 px-3 text-xs font-bold focus:ring-2 focus:ring-primary/10 outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 pl-0.5">
                          Lien de suivi colis
                        </label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={trackingLinkInput}
                          onChange={(e) => setTrackingLinkInput(e.target.value)}
                          className="w-full bg-white border border-gray-100 rounded-xl py-2 px-3 text-xs font-bold focus:ring-2 focus:ring-primary/10 outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors"
              >
                Annuler
              </button>
              <button
                disabled={updating}
                onClick={handleSaveChanges}
                className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95 disabled:opacity-50"
              >
                {updating ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
