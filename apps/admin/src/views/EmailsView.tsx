import React, { useEffect, useState } from "react";
import {
  Envelope,
  List,
  Calendar,
  User,
  Trash,
  ArrowClockwise,
  PaperPlaneTilt,
  Eye,
  X,
  Check,
  FloppyDisk,
  Flame,
} from "@phosphor-icons/react";
import {
  subscribeToCollection,
  subscribeToDocument,
  setDocument,
  deleteDocument,
} from "@imexmercado/firebase";
import { seedEmailTemplates } from "@imexmercado/firebase";
import { sendAutomatedEmail } from "../utils/emailHelper";

export function EmailsView() {
  const [activeTab, setActiveTab] = useState<
    "templates" | "abandoned" | "logs"
  >("templates");

  // States
  const [templates, setTemplates] = useState<any>(null);
  const [abandonedCarts, setAbandonedCarts] = useState<any[]>([]);
  const [emailLogs, setEmailLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  // Template editor states
  const [selectedTemplateKey, setSelectedTemplateKey] =
    useState<string>("order_confirmation");
  const [editedSubject, setEditedSubject] = useState("");
  const [editedBody, setEditedBody] = useState("");
  const [savingTemplate, setSavingTemplate] = useState(false);

  // Modal / Log View state
  const [viewingLog, setViewingLog] = useState<any>(null);

  // Real-time subscriptions
  useEffect(() => {
    setLoading(true);

    // Subscribe to templates settings
    const unsubscribeTemplates = subscribeToDocument(
      "settings",
      "email_templates",
      (data) => {
        setTemplates(data);
        if (data && data[selectedTemplateKey]) {
          setEditedSubject(data[selectedTemplateKey].subject || "");
          setEditedBody(data[selectedTemplateKey].body || "");
        }
        setLoading(false);
      },
    );

    // Subscribe to abandoned carts
    const unsubscribeCarts = subscribeToCollection(
      "abandoned_carts",
      (data) => {
        const sorted = [...data].sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );
        setAbandonedCarts(sorted);
      },
    );

    // Subscribe to email logs
    const unsubscribeLogs = subscribeToCollection("email_logs", (data) => {
      const sorted = [...data].sort(
        (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime(),
      );
      setEmailLogs(sorted);
    });

    return () => {
      unsubscribeTemplates();
      unsubscribeCarts();
      unsubscribeLogs();
    };
  }, []);

  // Update editor inputs when template key changes
  useEffect(() => {
    if (templates && templates[selectedTemplateKey]) {
      setEditedSubject(templates[selectedTemplateKey].subject || "");
      setEditedBody(templates[selectedTemplateKey].body || "");
    }
  }, [selectedTemplateKey, templates]);

  const handleSeedDefaults = async () => {
    setSeeding(true);
    try {
      await seedEmailTemplates();
      alert("✅ Templates par défaut initialisés avec succès !");
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'initialisation des templates.");
    } finally {
      setSeeding(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!templates) return;
    setSavingTemplate(true);
    try {
      const updatedTemplates = {
        ...templates,
        [selectedTemplateKey]: {
          ...templates[selectedTemplateKey],
          subject: editedSubject,
          body: editedBody,
        },
      };
      // remove metadata id before saving to setting document
      delete updatedTemplates.id;

      await setDocument("settings", "email_templates", updatedTemplates);
      alert("✅ Template sauvegardé avec succès !");
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la sauvegarde.");
    } finally {
      setSavingTemplate(false);
    }
  };

  const handleSendRelance = async (cart: any) => {
    if (
      !confirm(`Envoyer l'email de relance panier abandonné à ${cart.email} ?`)
    )
      return;
    try {
      const success = await sendAutomatedEmail("abandoned_cart", cart.email, {
        customerName: cart.customerName || "Client",
        checkoutUrl: cart.checkoutUrl,
        items: cart.items,
        totalPrice: cart.total?.toFixed(2) + "€",
      });
      if (success) {
        alert(
          "📧 Relance panier abandonné simulée avec succès ! (Vérifiez les logs)",
        );
      } else {
        alert("Erreur lors de l'envoi de la relance.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCart = async (cartId: string) => {
    if (!confirm("Supprimer ce panier abandonné de la liste ?")) return;
    try {
      await deleteDocument("abandoned_carts", cartId);
    } catch (e) {
      console.error(e);
    }
  };

  const placeholders: Record<string, string[]> = {
    abandoned_cart: ["{customer_name}", "{cart_items}", "{checkout_url}"],
    payment_cancelled: ["{customer_name}", "{order_id}", "{retry_url}"],
    order_confirmation: [
      "{customer_name}",
      "{order_id}",
      "{order_items}",
      "{total_price}",
    ],
    order_shipped: [
      "{customer_name}",
      "{order_id}",
      "{tracking_number}",
      "{tracking_link}",
    ],
  };

  return (
    <div className="space-y-6 md:space-y-8 text-left max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Automations & Messages
          </h2>
          <p className="text-sm font-medium text-gray-500">
            Visualisez les logs, relancez les paniers perdus et éditez vos
            templates d'email.
          </p>
        </div>
        {!loading && (
          <button
            disabled={seeding}
            onClick={handleSeedDefaults}
            className="flex items-center justify-center gap-2 bg-amber-500 text-slate-900 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-amber-500/10 hover:scale-105 transition-transform"
          >
            <Flame size={16} weight="fill" />
            Réinitialiser les Templates par défaut
          </button>
        )}
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-gray-200 gap-6">
        <button
          onClick={() => setActiveTab("templates")}
          className={`pb-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === "templates" ? "border-primary text-gray-900" : "border-transparent text-gray-400"}`}
        >
          Templates de messages
        </button>
        <button
          onClick={() => setActiveTab("abandoned")}
          className={`pb-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 relative ${activeTab === "abandoned" ? "border-primary text-gray-900" : "border-transparent text-gray-400"}`}
        >
          Paniers abandonnés
          {abandonedCarts.length > 0 && (
            <span className="absolute -top-1 -right-3 w-4 h-4 bg-amber-500 text-white rounded-full flex items-center justify-center text-[8px] font-black">
              {abandonedCarts.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`pb-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === "logs" ? "border-primary text-gray-900" : "border-transparent text-gray-400"}`}
        >
          Logs d'envoi
        </button>
      </div>

      {/* Loading view */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Chargement des données...
          </p>
        </div>
      ) : (
        <>
          {/* TAB 1: TEMPLATES EDITOR */}
          {activeTab === "templates" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Templates Navigation Sidebar */}
              <div className="lg:col-span-3 space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                  Choisir un type
                </h4>
                {templates &&
                  Object.keys(templates)
                    .filter((k) => k !== "id")
                    .map((key) => (
                      <button
                        key={key}
                        onClick={() => setSelectedTemplateKey(key)}
                        className={`w-full flex items-center gap-3 p-4 rounded-2xl text-left border transition-all ${selectedTemplateKey === key ? "bg-primary border-primary text-white shadow-xl shadow-primary/20" : "bg-white border-gray-150 text-gray-700 hover:bg-gray-50"}`}
                      >
                        <Envelope
                          size={20}
                          weight={
                            selectedTemplateKey === key ? "fill" : "regular"
                          }
                        />
                        <span className="text-xs font-bold truncate">
                          {templates[key].name || key}
                        </span>
                      </button>
                    ))}
              </div>

              {/* Editor Workspace */}
              <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inputs block */}
                <div className="bg-white rounded-3xl border border-gray-150 p-6 md:p-8 space-y-6 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <h3 className="font-black text-gray-900 text-sm uppercase tracking-wider">
                        Configuration
                      </h3>
                      <span className="text-[9px] bg-gray-100 text-gray-500 font-extrabold px-3 py-1 rounded-full uppercase">
                        Édition
                      </span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 pl-1">
                        Objet de l'email
                      </label>
                      <input
                        type="text"
                        className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/10 outline-none"
                        value={editedSubject}
                        onChange={(e) => setEditedSubject(e.target.value)}
                        placeholder="Objet de l'email"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 pl-1">
                          Corps HTML
                        </label>
                        <span className="text-[8px] font-bold text-gray-300 uppercase">
                          Tags valides :{" "}
                          {(placeholders[selectedTemplateKey] || placeholders[selectedTemplateKey.replace(/_(fr|pt)$/, "")])?.join(", ")}
                        </span>
                      </div>
                      <textarea
                        rows={12}
                        className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-xs font-mono focus:ring-2 focus:ring-primary/10 outline-none leading-relaxed"
                        value={editedBody}
                        onChange={(e) => setEditedBody(e.target.value)}
                        placeholder="Corps de l'email en HTML..."
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
                    <button
                      onClick={handleSaveTemplate}
                      disabled={savingTemplate}
                      className="flex items-center justify-center gap-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-6 py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                    >
                      <FloppyDisk size={16} weight="fill" />
                      {savingTemplate
                        ? "Sauvegarde..."
                        : "Sauvegarder le Template"}
                    </button>
                  </div>
                </div>

                {/* HTML Live Preview Block */}
                <div className="bg-white rounded-3xl border border-gray-150 p-6 md:p-8 flex flex-col">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                    <h3 className="font-black text-gray-900 text-sm uppercase tracking-wider">
                      Aperçu Visuel
                    </h3>
                    <span className="text-[9px] bg-green-50 text-green-600 font-extrabold px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
                      <Eye size={12} weight="bold" /> Temps Réel
                    </span>
                  </div>

                  {/* Sandbox iframe for HTML rendering */}
                  <div className="flex-1 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 h-[400px]">
                    <iframe
                      title="Email Preview"
                      srcDoc={editedBody
                        .replaceAll("{customer_name}", "Jean Dupont")
                        .replaceAll("{order_id}", "ORD-SAMPLE123")
                        .replaceAll("{total_price}", "149.99€")
                        .replaceAll("{checkout_url}", "#")
                        .replaceAll("{retry_url}", "#")
                        .replaceAll("{tracking_number}", "RF123456789PT")
                        .replaceAll("{tracking_link}", "#")
                        .replaceAll(
                          "{cart_items}",
                          `<table style="width:100%; border-collapse:collapse;"><tr style="border-bottom:1px solid #E5E7EB;"><td style="padding:8px 0; font-family:sans-serif; font-size:13px; font-weight:700;">Sony WH-1000XM5 x1</td><td style="text-align:right; font-family:sans-serif; font-size:13px; font-weight:900;">349.00€</td></tr></table>`,
                        )
                        .replaceAll(
                          "{order_items}",
                          `<table style="width:100%; border-collapse:collapse;"><tr style="border-bottom:1px solid #E5E7EB;"><td style="padding:8px 0; font-family:sans-serif; font-size:13px; font-weight:700;">Sony WH-1000XM5 x1</td><td style="text-align:right; font-family:sans-serif; font-size:13px; font-weight:900;">349.00€</td></tr></table>`,
                        )}
                      className="w-full h-full border-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ABANDONED CARTS */}
          {activeTab === "abandoned" && (
            <div className="bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-sm">
              <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-wider">
                  Paniers Abandonnés Actifs
                </h3>
                <span className="text-[9px] bg-amber-500/20 text-amber-700 font-extrabold px-3 py-1 rounded-full uppercase">
                  {abandonedCarts.length} Perdus
                </span>
              </div>

              {abandonedCarts.length === 0 ? (
                <div className="py-20 text-center text-gray-400">
                  <List size={40} className="mx-auto text-gray-200 mb-3" />
                  <p className="text-xs font-bold">
                    Aucun panier abandonné détecté pour le moment.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <th className="py-4 px-6">Client / Contact</th>
                        <th className="py-4 px-6">Articles</th>
                        <th className="py-4 px-6">Valeur</th>
                        <th className="py-4 px-6">Dernière activité</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
                      {abandonedCarts.map((cart) => (
                        <tr
                          key={cart.id}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <p className="font-bold text-gray-900">
                              {cart.customerName}
                            </p>
                            <p className="text-[10px] text-gray-400 font-bold">
                              {cart.email}
                            </p>
                            {cart.phone && (
                              <p className="text-[9px] text-gray-400 font-medium">
                                {cart.phone}
                              </p>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <div className="space-y-1">
                              {cart.items?.map((item: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-1.5"
                                >
                                  <span className="text-[10px] text-gray-400 font-bold">
                                    x{item.quantity}
                                  </span>
                                  <span className="truncate max-w-[120px] inline-block text-[11px] font-bold text-gray-900">
                                    {item.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 px-6 font-black text-gray-900">
                            {cart.total?.toFixed(2)}€
                          </td>
                          <td className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                            {new Date(cart.updatedAt).toLocaleString()}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleSendRelance(cart)}
                                className="flex items-center gap-1 bg-amber-500 text-slate-900 font-black uppercase text-[9px] tracking-wider px-3.5 py-2 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md shadow-amber-500/10"
                              >
                                <PaperPlaneTilt size={12} weight="bold" />{" "}
                                Relancer
                              </button>
                              <button
                                onClick={() => handleDeleteCart(cart.id)}
                                className="p-2 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-xl transition-colors"
                              >
                                <Trash size={16} weight="bold" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EMAIL LOGS */}
          {activeTab === "logs" && (
            <div className="bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-sm">
              <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-wider">
                  Historique des envois simulés
                </h3>
                <span className="text-[9px] bg-slate-100 text-slate-700 font-extrabold px-3 py-1 rounded-full uppercase">
                  {emailLogs.length} Envoyés
                </span>
              </div>

              {emailLogs.length === 0 ? (
                <div className="py-20 text-center text-gray-400">
                  <List size={40} className="mx-auto text-gray-200 mb-3" />
                  <p className="text-xs font-bold">
                    Aucun email envoyé pour l'instant.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <th className="py-4 px-6">Destinataire</th>
                        <th className="py-4 px-6">Type / Événement</th>
                        <th className="py-4 px-6">Objet</th>
                        <th className="py-4 px-6">Date d'envoi</th>
                        <th className="py-4 px-6">Statut</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
                      {emailLogs.map((log, index) => (
                        <tr
                          key={log.id || index}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="py-4 px-6 font-bold text-gray-900">
                            {log.recipientEmail}
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-[9px] bg-gray-100 text-gray-600 font-extrabold px-2.5 py-1 rounded uppercase tracking-wider">
                              {log.type?.replace("_", " ")}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-900 font-bold truncate max-w-[200px]">
                            {log.subject}
                          </td>
                          <td className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                            {new Date(log.sentAt).toLocaleString()}
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center gap-1 text-[9px] text-green-600 font-black uppercase tracking-widest">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>{" "}
                              {log.status || "Sent"}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => setViewingLog(log)}
                              className="inline-flex items-center gap-1.5 p-2 bg-gray-50 hover:bg-primary/10 text-gray-500 hover:text-primary rounded-xl font-bold uppercase text-[9px] tracking-wider transition-all"
                            >
                              <Eye size={14} weight="bold" /> Aperçu HTML
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* HTML Log Modal */}
      {viewingLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={() => setViewingLog(null)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh] z-10 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-[9px] bg-primary/10 text-primary px-3 py-1 rounded-full font-black uppercase tracking-widest w-fit mb-1">
                  Log Email
                </p>
                <h3 className="text-sm font-black text-gray-900">
                  Destinataire :{" "}
                  <span className="text-gray-500 font-bold">
                    {viewingLog.recipientEmail}
                  </span>
                </h3>
              </div>
              <button
                onClick={() => setViewingLog(null)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
              <div className="bg-white p-4 rounded-xl border border-gray-150">
                <p className="text-xs text-gray-500 font-medium">
                  Objet :{" "}
                  <span className="font-black text-gray-900">
                    {viewingLog.subject}
                  </span>
                </p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-1">
                  Date d'envoi : {new Date(viewingLog.sentAt).toLocaleString()}
                </p>
              </div>

              {/* Render HTML Body inside iframe sandbox */}
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-150 h-[380px]">
                <iframe
                  title="Sent HTML Preview"
                  srcDoc={viewingLog.body}
                  className="w-full h-full border-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-100 flex items-center justify-end bg-white">
              <button
                onClick={() => setViewingLog(null)}
                className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-6 py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-transform"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
