import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  auth,
  setDocument,
  useAuth,
  subscribeToDocument,
  deleteDocument,
} from "@imexmercado/firebase";
console.log(
  "CheckoutPage.tsx Module Loaded - setDocument exists:",
  !!setDocument,
);
import { sendAutomatedEmail } from "../utils/emailHelper";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Truck,
  CreditCard,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  CaretRight,
  House,
  Bank,
  Globe,
  LockKey,
  SealCheck,
  NavigationArrow,
  Check,
  Info,
  Gift,
  PencilSimple,
  ShoppingCart,
  CaretDown,
  CaretUp,
  Eye,
  EyeSlash,
  MapPin,
  Trash,
  EnvelopeSimple,
} from "@phosphor-icons/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { usePayment } from "../context/PaymentContext";
import { useCart } from "../context/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { StripePaymentForm } from "../components/shop/StripePaymentForm";
import {
  useStripe,
  useElements,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {
  CreditCard as SquareCreditCard,
  PaymentForm,
} from "react-square-web-payments-sdk";

function StripePaymentInner({
  isProcessing,
  setIsProcessing,
  nextStep,
  totalPrice,
  saveOrder,
  formData,
}: any) {
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const handleSumbit = async () => {
      if (!stripe || !elements || isProcessing) return;

      setIsProcessing(true);
      try {
        const response = await fetch("/api/create-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: totalPrice,
            currency: "EUR",
            gateway: "stripe",
            orderId: `ORD-STR-${Date.now()}`,
          }),
        });

        const { clientSecret } = await response.json();

        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardNumberElement)!,
          },
        });

        if (result.error) {
          alert(result.error.message);
          // Trigger Cancelled Payment email
          try {
            await sendAutomatedEmail("payment_cancelled", formData.email, {
              customerName: formData.firstName,
              orderId: `ORD-${Date.now().toString().slice(-6).toUpperCase()}`,
              retryUrl:
                window.location.origin +
                "/commande?email=" +
                encodeURIComponent(formData.email),
            });
          } catch (e) {
            console.error("Error sending cancelled payment email:", e);
          }
        } else if (result.paymentIntent.status === "succeeded") {
          await saveOrder("stripe", result.paymentIntent);
          nextStep();
        }
      } catch (err) {
        console.error(err);
        // Trigger Cancelled Payment email
        try {
          await sendAutomatedEmail("payment_cancelled", formData.email, {
            customerName: formData.firstName,
            orderId: `ORD-${Date.now().toString().slice(-6).toUpperCase()}`,
            retryUrl:
              window.location.origin +
              "/commande?email=" +
              encodeURIComponent(formData.email),
          });
        } catch (e) {
          console.error("Error sending cancelled payment email:", e);
        }
      } finally {
        setIsProcessing(false);
      }
    };

    document.addEventListener("STRIPE_SUBMIT", handleSumbit);
    return () => document.removeEventListener("STRIPE_SUBMIT", handleSumbit);
  }, [stripe, elements, isProcessing, totalPrice, formData]);

  return <StripePaymentForm />;
}

export function CheckoutPage() {
  const { t, i18n } = useTranslation(["checkout", "common"]);
  const isFR = i18n.language === "fr";
  const txt = (fr: string, pt: string) => (isFR ? fr : pt);

  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGateway, setSelectedGateway] = useState<string | null>(null);
  const [mbWayPhone, setMbWayPhone] = useState("");
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { config, isLoading: isPaymentLoading, activeGateways } = usePayment();
  const {
    items,
    totalItems,
    totalPrice,
    setDrawerOpen,
    clearCart,
    removeItem,
  } = useCart();
  const [shippingPrice, setShippingPrice] = useState(0);
  const [shippingZones, setShippingZones] = useState<any[]>([]);

  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [authMode, setAuthMode] = useState<"guest" | "login" | "register">(
    "guest",
  );
  const [registerPassword, setRegisterPassword] = useState("");
  console.log("CheckoutPage Render - authMode status:", authMode);
  const [isManualEditing, setIsManualEditing] = useState(false);
  const [showManualAddress, setShowManualAddress] = useState(false);
  const [isAddressSaved, setIsAddressSaved] = useState(false);
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const { user, profile, loading: authLoading } = useAuth();
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [completedOrderDetails, setCompletedOrderDetails] = useState<{
    total: number;
    items: any[];
    shippingPrice?: number;
  } | null>(null);

  const isOrderConfirmed = React.useRef(false);

  // Smart Auto-Scroll to Active Step
  useEffect(() => {
    const activeStepNode = document.getElementById(
      `step-content-${currentStep}`,
    );
    if (activeStepNode) {
      activeStepNode.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentStep]);

  // Security: Redirect to store if cart becomes empty during checkout (except on success)
  useEffect(() => {
    if (
      totalItems === 0 &&
      currentStep !== 4 &&
      !authLoading &&
      !isOrderConfirmed.current
    ) {
      navigate("/boutique");
    }
  }, [totalItems, currentStep, navigate, authLoading]);

  useEffect(() => {
    if (config?.stripe?.enabled && config?.stripe?.publishableKey) {
      setStripePromise(loadStripe(config.stripe.publishableKey));
    }
  }, [config]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "France", // Defaulting to typically expected country
  });

  useEffect(() => {
    const unsubscribe = subscribeToDocument(
      "settings",
      "shipping_zones",
      (data: any) => {
        if (data && data.zones) {
          setShippingZones(data.zones);
        }
      },
    );
    return () => unsubscribe();
  }, []);

  // Prefill email from query parameter if recovering cart
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlEmail = params.get("email");
    if (urlEmail) {
      setFormData((prev) => ({ ...prev, email: urlEmail }));
    }
  }, []);

  useEffect(() => {
    let country = formData.country;
    if (selectedAddressId && profile?.addresses) {
      const addr = profile.addresses.find(
        (a: any) => a.id === selectedAddressId,
      );
      if (addr) country = addr.country;
    }
    const match = shippingZones.find(
      (z) =>
        z.countryCode?.toLowerCase() === country?.toLowerCase() ||
        z.name?.toLowerCase() === country?.toLowerCase(),
    );
    if (match) {
      setShippingPrice(match.price);
    } else {
      setShippingPrice(country ? 4.99 : 0);
    }
  }, [formData.country, selectedAddressId, profile, shippingZones]);

  const finalTotal = totalPrice + shippingPrice;

  // Sync abandoned carts to Firestore
  useEffect(() => {
    if (!formData.email || items.length === 0 || isOrderConfirmed.current)
      return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return;

    const timer = setTimeout(async () => {
      try {
        await setDocument("abandoned_carts", formData.email, {
          email: formData.email,
          customerName:
            `${formData.firstName} ${formData.lastName}`.trim() || "Client",
          phone: formData.phone || "",
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          total: finalTotal,
          updatedAt: new Date().toISOString(),
          checkoutUrl:
            window.location.origin +
            "/commande?email=" +
            encodeURIComponent(formData.email),
        });
      } catch (err) {
        console.error("Error syncing abandoned cart:", err);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData, items, finalTotal]);

  useEffect(() => {
    if (profile && !authLoading) {
      setFormData((prev) => ({
        ...prev,
        firstName: prev.firstName || profile.firstName || "",
        lastName: prev.lastName || profile.lastName || "",
        email: prev.email || profile.email || user?.email || "",
        phone: prev.phone || profile.phone || "",
        address: prev.address || profile.address || "",
        city: prev.city || profile.city || "",
        zipCode: prev.zipCode || profile.zipCode || "",
        country: prev.country || profile.country || "France",
      }));

      // Auto-sélectionner l'adresse par défaut si aucune n'est sélectionnée
      if (!selectedAddressId) {
        if (profile.addresses?.length > 0) {
          const defaultAddr =
            profile.addresses.find((a: any) => a.isDefault) ||
            profile.addresses[0];
          setSelectedAddressId(defaultAddr.id);
        } else if (profile.address) {
          setSelectedAddressId("root-default");
        }
      }
    } else if (user && !authLoading) {
      setFormData((prev) => ({
        ...prev,
        email: prev.email || user.email || "",
      }));
    }
  }, [profile, user, authLoading, selectedAddressId]);

  const handleDeleteAddress = async (addressId: string) => {
    if (!user || !profile?.addresses) return;
    if (
      window.confirm(
        txt(
          "Voulez-vous vraiment supprimer cette adresse ?",
          "Tem a certeza que deseja eliminar este endereço?",
        ),
      )
    ) {
      try {
        const updatedAddresses = profile.addresses.filter(
          (a: any) => a.id !== addressId,
        );
        await setDocument("users", user.uid, {
          ...profile,
          addresses: updatedAddresses,
        });
        // Si nous supprimons l'adresse actuellement sélectionnée (basée sur le contenu et non l'ID car l'ID n'est pas tjs ds formData)
        if (
          formData.address ===
          profile.addresses.find((a: any) => a.id === addressId)?.address
        ) {
          setShowManualAddress(true);
        }
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, formData.email, loginPassword);
      // useAuth will automatically update and pre-fill the form
    } catch (err: any) {
      setAuthError(t("checkout:login_error"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleIdentification = async () => {
    if (authMode === "register") {
      setIsProcessing(true);
      setAuthError(null);
      try {
        const { createUserWithEmailAndPassword, updateProfile } =
          await import("firebase/auth");
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          registerPassword,
        );
        await updateProfile(userCredential.user, {
          displayName: `${formData.firstName} ${formData.lastName}`,
        });

        // Créer le profil initial dans Firestore
        await setDocument("users", userCredential.user.uid, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          createdAt: new Date().toISOString(),
        });

        setCurrentStep(2);
      } catch (err: any) {
        console.error("Erreur Inscription:", err);
        if (err.code === "auth/email-already-in-use") {
          setAuthError(
            txt(
              "Cet email est déjà utilisé. Veuillez vous connecter.",
              "Este e-mail já está em uso. Por favor, inicie sessão.",
            ),
          );
          setAuthMode("login");
        } else {
          setAuthError(
            txt(
              "Une erreur est survenue lors de la création du compte.",
              "Ocorreu um erro ao criar a conta.",
            ),
          );
        }
      } finally {
        setIsProcessing(false);
      }
    } else {
      setCurrentStep(2);
    }
  };

  const saveOrder = async (gateway: string, paymentData: any = {}) => {
    try {
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
      const orderData = {
        id: orderId,
        userId: user?.uid || null,
        userName: `${formData.firstName} ${formData.lastName}`,
        userEmail: formData.email,
        userPhone: formData.phone,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingPrice,
        total: finalTotal,
        status: "Processing",
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        payment: {
          gateway,
          ...paymentData,
        },
        createdAt: new Date().toISOString(),
      };

      await setDocument("orders", orderId, orderData);

      // Delete temporary abandoned cart if it exists
      try {
        await deleteDocument("abandoned_carts", formData.email);
      } catch (e) {
        console.error("Error deleting abandoned cart:", e);
      }

      // Send Order Confirmation email
      try {
        await sendAutomatedEmail("order_confirmation", formData.email, {
          customerName: formData.firstName,
          orderId: orderId,
          items: items.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          totalPrice: finalTotal.toFixed(2) + "€",
        });
      } catch (e) {
        console.error("Error sending order confirmation email:", e);
      }

      // Prevent redirect when cart clears
      isOrderConfirmed.current = true;

      // Sauvegarder les détails pour la page de succès avant vidage du panier
      setCompletedOrderDetails({
        total: finalTotal,
        shippingPrice,
        items: [...items],
      });

      // Nettoyer le panier après commande réussie
      clearCart();

      setConfirmedOrderId(orderId);
      return orderId;
    } catch (err) {
      console.error("Erreur lors de l'enregistrement de la commande:", err);
      return null;
    }
  };

  const handleShippingSubmit = async () => {
    // Si une adresse est déjà sélectionnée (sauvegardée), on passe directement
    if (selectedAddressId) {
      setCurrentStep(3);
      return;
    }

    // Sinon l'utilisateur a rempli le formulaire manuellement
    if (!formData.address || !formData.city) return; // Sécurité

    if (user && saveAddressToProfile) {
      setIsProcessing(true);
      try {
        const newId = `addr-${Date.now()}`;
        const newAddress = {
          id: newId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone,
          isDefault: (profile?.addresses?.length || 0) === 0,
        };
        await setDocument("users", user.uid, {
          ...profile,
          addresses: [...(profile?.addresses || []), newAddress],
          updatedAt: new Date().toISOString(),
        });
        setSelectedAddressId(newId);
      } catch (err) {
        console.error("Erreur sauvegarde adresse:", err);
        setSelectedAddressId("manual-session");
      } finally {
        setIsProcessing(false);
      }
    } else {
      setSelectedAddressId("manual-session");
    }

    setCurrentStep(3);
  };

  const handleCreatePayment = async (
    gateway: string,
    additionalData: any = {},
  ) => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalPrice,
          currency: "EUR",
          gateway,
          orderId: `ORD-${Date.now()}`,
          customer: formData,
          items: items,
          ...additionalData,
        }),
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else if (data.payment) {
        await saveOrder(gateway, data.payment);
        nextStep();
      }

      return data;
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Une erreur est survenue lors du paiement.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!selectedGateway) return;

    if (selectedGateway === "stripe") {
      document.dispatchEvent(new CustomEvent("STRIPE_SUBMIT"));
    } else if (selectedGateway === "bank_transfer") {
      setIsProcessing(true);
      const orderId = await saveOrder("bank_transfer", {
        status: "Awaiting Bank Transfer",
        iban: config?.bank_transfer?.iban,
        beneficiary: config?.bank_transfer?.beneficiary,
      });
      if (orderId) nextStep();
      setIsProcessing(false);
    } else if (selectedGateway === "mbway") {
      if (mbWayPhone.length < 9) {
        alert(
          txt(
            "Veuillez saisir un numéro de téléphone valide à 9 chiffres.",
            "Por favor, insira um número de telemóvel válido com 9 dígitos.",
          ),
        );
        return;
      }
      setIsProcessing(true);
      await new Promise((r) => setTimeout(r, 1500));
      const orderId = await saveOrder("mbway", {
        phone: `+351${mbWayPhone}`,
        merchantId: config?.mbway?.merchantId,
        status: "Awaiting MB WAY Confirmation",
      });
      if (orderId) nextStep();
      setIsProcessing(false);
    } else if (selectedGateway === "multibanco") {
      setIsProcessing(true);
      await new Promise((r) => setTimeout(r, 1000));
      const refPart1 = Math.floor(100 + Math.random() * 900).toString();
      const refPart2 = Math.floor(100 + Math.random() * 900).toString();
      const refPart3 = Math.floor(100 + Math.random() * 900).toString();
      const mockRef = `${refPart1} ${refPart2} ${refPart3}`;
      const orderId = await saveOrder("multibanco", {
        entity: config?.multibanco?.entity || "12345",
        reference: mockRef,
        status: "Awaiting Multibanco Payment",
      });
      if (orderId) nextStep();
      setIsProcessing(false);
    } else if (selectedGateway === "mollie") {
      await handleCreatePayment("mollie");
    } else if (selectedGateway === "payplug") {
      await handleCreatePayment("payplug");
    } else if (selectedGateway === "simulation") {
      setIsProcessing(true);
      await new Promise((r) => setTimeout(r, 1200));
      await saveOrder("simulation", {
        status: "SIMULATED_SUCCESS",
        simulatedAt: new Date().toISOString(),
      });
      setIsProcessing(false);
      nextStep();
    }
  };

  if (currentStep === 4) {
    const displayOrderId =
      confirmedOrderId || `ORD-${Date.now().toString().slice(-8)}`;
    const isPendingPayment =
      selectedGateway === "bank_transfer" ||
      selectedGateway === "multibanco" ||
      selectedGateway === "mbway";
    const displayTotal = completedOrderDetails?.total ?? totalPrice;
    const displayItems = completedOrderDetails?.items ?? items;

    let topLabel = t("checkout:payment_accepted");
    let mainTitle = (
      <>
        {txt("Commande", "Encomenda")}{" "}
        <span className="text-green-500">
          {txt("Confirmée !", "Confirmada!")}
        </span>
      </>
    );
    let topDesc = t("checkout:order_confirmed_desc", {
      name: formData.firstName,
    });
    let badgeLabel = txt("Processing", "Em Processamento");
    let badgeStyle =
      "bg-green-500/20 border border-green-500/30 text-green-400";

    if (selectedGateway === "bank_transfer") {
      topLabel = txt(
        "En attente de virement",
        "A aguardar transferência bancária",
      );
      mainTitle = (
        <>
          {txt("Commande", "Encomenda")}{" "}
          <span className="text-amber-500">
            {txt("Enregistrée", "Registada")}
          </span>
        </>
      );
      topDesc = t("checkout:awaiting_bank_transfer_desc", {
        name: formData.firstName,
      });
      badgeLabel = txt("Awaiting Payment", "Aguardando Pagamento");
      badgeStyle = "bg-amber-500/20 border border-amber-500/30 text-amber-600";
    } else if (selectedGateway === "multibanco") {
      topLabel = txt("En attente de règlement", "A aguardar pagamento");
      mainTitle = (
        <>
          {txt("Commande", "Encomenda")}{" "}
          <span className="text-blue-500">
            {txt("Enregistrée", "Registada")}
          </span>
        </>
      );
      topDesc = t("checkout:awaiting_multibanco_desc", {
        name: formData.firstName,
      });
      badgeLabel = txt("Awaiting Payment", "Aguardando Pagamento");
      badgeStyle = "bg-blue-500/20 border border-blue-500/30 text-blue-600";
    } else if (selectedGateway === "mbway") {
      topLabel = txt(
        "Attente de confirmation MB WAY",
        "A aguardar confirmação MB WAY",
      );
      mainTitle = (
        <>
          {txt("Commande", "Encomenda")}{" "}
          <span className="text-pink-500">
            {txt("Enregistrée", "Registada")}
          </span>
        </>
      );
      topDesc = t("checkout:awaiting_mbway_desc", { name: formData.firstName });
      badgeLabel = txt("Awaiting Payment", "Aguardando Pagamento");
      badgeStyle = "bg-pink-500/20 border border-pink-500/30 text-pink-600";
    }

    return (
      <div
        className={`min-h-screen bg-gradient-to-b ${isPendingPayment ? "from-amber-50/60" : "from-green-50/60"} via-white to-white flex flex-col items-center justify-center p-4 sm:p-8`}
      >
        {/* Success Card without background with green border */}
        <div className="w-full max-w-lg p-6 sm:p-8 border-2 border-[#00A859] rounded-3xl flex flex-col items-center justify-center bg-transparent mb-6 text-center">
          {/* Success Animation */}
          <div className="relative mb-8 flex items-center justify-center">
            <div
              className={`absolute w-40 h-40 rounded-full animate-ping ${isPendingPayment ? "bg-amber-400/10" : "bg-green-400/10"}`}
            />
            <div
              className={`absolute w-32 h-32 rounded-full animate-pulse ${isPendingPayment ? "bg-amber-400/15" : "bg-green-400/15"}`}
            />
            <div
              className={`relative z-10 w-24 h-24 bg-gradient-to-br ${isPendingPayment ? "from-amber-400 to-amber-600 shadow-amber-500/30" : "from-green-400 to-green-600 shadow-green-500/30"} text-white rounded-full flex items-center justify-center shadow-2xl border-4 border-white`}
            >
              {isPendingPayment ? (
                <Info size={48} weight="bold" />
              ) : (
                <CheckCircle size={48} weight="bold" />
              )}
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <p
              className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 ${isPendingPayment ? "text-amber-500" : "text-green-500"}`}
            >
              {topLabel}
            </p>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter mb-3">
              {mainTitle}
            </h1>
            <p className="text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
              {topDesc}
            </p>
          </div>
        </div>

        {/* Order Card with green border */}
        <div className="w-full max-w-lg bg-white rounded-3xl border-2 border-[#00A859] shadow-xl shadow-gray-100/80 overflow-hidden">
          {/* Order Header */}
          <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-0.5">
                {t("checkout:order_reference")}
              </p>
              <p className="text-sm font-black text-white tracking-widest">
                # {displayOrderId.toUpperCase()}
              </p>
            </div>
            <div className={`px-3 py-1.5 rounded-xl ${badgeStyle}`}>
              <span className="text-[10px] font-black uppercase tracking-widest">
                {badgeLabel}
              </span>
            </div>
          </div>

          {/* Items List */}
          <div className="divide-y divide-gray-50">
            {displayItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">📦</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-gray-900 uppercase tracking-tight truncate">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold">
                    {t("checkout:qty")} {item.quantity}
                  </p>
                </div>
                <span className="font-black text-sm text-gray-900 shrink-0">
                  {(item.price * item.quantity).toFixed(2)}€
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 space-y-2">
            <div className="flex justify-between text-xs font-medium text-gray-500">
              <span>{t("checkout:subtotal")}</span>
              <span className="font-bold text-gray-900">
                {(
                  displayTotal -
                  (completedOrderDetails?.shippingPrice ?? shippingPrice)
                ).toFixed(2)}
                €
              </span>
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-500">
              <span>{t("checkout:shipping")}</span>
              <span
                className={
                  (completedOrderDetails?.shippingPrice ?? shippingPrice) === 0
                    ? "font-black text-green-500"
                    : "font-bold text-gray-900"
                }
              >
                {(completedOrderDetails?.shippingPrice ?? shippingPrice) === 0
                  ? t("checkout:free")
                  : `${(completedOrderDetails?.shippingPrice ?? shippingPrice).toFixed(2)}€`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-black text-gray-900 border-t border-gray-200 pt-2 mt-1">
              <span className="uppercase tracking-wide">
                {t("checkout:paid_total")}
              </span>
              <span>{displayTotal.toFixed(2)}€</span>
            </div>
          </div>

          {/* Payment instructions details based on selected gateway */}
          {selectedGateway === "bank_transfer" && (
            <div className="px-6 py-5 border-t border-gray-100 bg-amber-50/40 space-y-3">
              <div className="flex items-center gap-2 text-amber-600">
                <Bank size={18} weight="bold" />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  {t("checkout:bank_transfer_action")}
                </p>
              </div>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                {t("checkout:bank_transfer_instr", {
                  total: `${displayTotal.toFixed(2)}€`,
                })}
              </p>
              <div className="bg-white border border-amber-100 rounded-xl p-3.5 space-y-3 text-xs">
                <div className="flex justify-between items-center gap-2">
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase block">
                      IBAN
                    </span>
                    <span className="font-black text-gray-900 tracking-wider">
                      {config?.bank_transfer?.iban ||
                        "PT50 0003 1234 5678 9012 345"}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      navigator.clipboard.writeText(
                        config?.bank_transfer?.iban ||
                          "PT50 0003 1234 5678 9012 345",
                      );
                      const btn = e.currentTarget;
                      btn.innerText = t("checkout:copied");
                      setTimeout(
                        () => (btn.innerText = t("checkout:copy")),
                        2000,
                      );
                    }}
                    className="text-[9px] font-black uppercase text-primary bg-primary/5 hover:bg-primary/10 px-2.5 py-1.5 rounded-lg transition-colors shrink-0"
                  >
                    {t("checkout:copy")}
                  </button>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase block">
                    BIC
                  </span>
                  <span className="font-black text-gray-900">
                    {config?.bank_transfer?.bic || "MBWAYPT"}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase block">
                    {t("checkout:beneficiary")}
                  </span>
                  <span className="font-black text-gray-900">
                    {config?.bank_transfer?.beneficiary ||
                      "IMEXMERCADO PORTUGAL"}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2 pt-1 border-t border-gray-100">
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase block">
                      {t("checkout:reference_to_indicate")}
                    </span>
                    <span className="font-black text-primary">
                      COMMANDE #{displayOrderId.toUpperCase().slice(-6)}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      navigator.clipboard.writeText(
                        `COMMANDE #${displayOrderId.toUpperCase().slice(-6)}`,
                      );
                      const btn = e.currentTarget;
                      btn.innerText = t("checkout:copied");
                      setTimeout(
                        () => (btn.innerText = t("checkout:copy")),
                        2000,
                      );
                    }}
                    className="text-[9px] font-black uppercase text-primary bg-primary/5 hover:bg-primary/10 px-2.5 py-1.5 rounded-lg transition-colors shrink-0"
                  >
                    {t("checkout:copy")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedGateway === "mbway" && (
            <div className="px-6 py-5 border-t border-gray-100 bg-pink-50/30 space-y-3">
              <div className="flex items-center gap-2 text-pink-600">
                <span className="text-lg">📱</span>
                <p className="text-[10px] font-black uppercase tracking-widest">
                  {t("checkout:mbway_push_sent")}
                </p>
              </div>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                {t("checkout:mbway_push_instr", {
                  total: `${displayTotal.toFixed(2)}€`,
                  phone: `+351 ${mbWayPhone}`,
                })}
              </p>
            </div>
          )}

          {selectedGateway === "multibanco" && (
            <div className="px-6 py-5 border-t border-gray-100 bg-blue-50/30 space-y-3">
              <div className="flex items-center gap-2 text-blue-600">
                <span className="text-lg">🏦</span>
                <p className="text-[10px] font-black uppercase tracking-widest">
                  {t("checkout:multibanco_info")}
                </p>
              </div>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                {t("checkout:multibanco_instr")}
              </p>
              <div className="bg-white border border-blue-100 rounded-xl p-4 flex flex-col gap-3 shadow-sm max-w-sm mx-auto">
                <div className="bg-blue-600 text-white font-black text-center py-2 rounded-lg text-xs uppercase tracking-widest">
                  PAGAMENTO DE SERVIÇOS
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase block">
                      Entidade (Entity)
                    </span>
                    <span className="font-black text-gray-900 text-base">
                      {config?.multibanco?.entity || "12345"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase block">
                      Referência (Ref.)
                    </span>
                    <span className="font-black text-gray-900 text-base tracking-widest">
                      {Math.floor(100 + Math.random() * 900)}{" "}
                      {Math.floor(100 + Math.random() * 900)}{" "}
                      {Math.floor(100 + Math.random() * 900)}
                    </span>
                  </div>
                  <div className="col-span-2 border-t border-gray-100 pt-2">
                    <span className="text-[9px] font-bold text-gray-400 uppercase block">
                      Montante (Amount)
                    </span>
                    <span className="font-black text-primary text-base">
                      {displayTotal.toFixed(2)}€
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delivery Info */}
          {(formData.address || formData.city) && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={16} weight="bold" className="text-blue-500" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">
                  {t("checkout:delivery_address")}
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {formData.firstName} {formData.lastName}
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  {formData.address}
                  {formData.city ? `, ${formData.city}` : ""}
                  {formData.zipCode ? ` ${formData.zipCode}` : ""}
                </p>
              </div>
            </div>
          )}

          {/* Email confirmation note */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-start gap-3 bg-blue-50/50">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <EnvelopeSimple
                size={16}
                weight="bold"
                className="text-blue-500"
              />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-0.5">
                {t("checkout:email_confirmation_title")}
              </p>
              <p className="text-xs text-gray-600 font-medium">
                {t("checkout:email_confirmation_desc", {
                  email: formData.email,
                })}
              </p>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full max-w-lg">
          <Link
            to="/boutique"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:border-gray-900 hover:text-gray-900 transition-all whitespace-nowrap"
          >
            <ShoppingCart size={16} weight="bold" />
            {t("checkout:continue_shopping")}
          </Link>
          {user ? (
            <Link
              to="/compte"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-900/20 whitespace-nowrap"
            >
              <User size={16} weight="bold" />
              {t("checkout:my_space")}
            </Link>
          ) : (
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-900/20 whitespace-nowrap"
            >
              <House size={16} weight="bold" />
              {t("checkout:return_home")}
            </Link>
          )}
        </div>

        <p className="mt-6 text-[10px] text-gray-400 font-medium text-center leading-relaxed">
          {t("checkout:questions_footer")}
          <br />
          IMEXSULTING Lda — NIF : PT 510 236 789 — Rua dos Girassóis, Nº 1 e 1A,
          Alhos Vedros, Portugal
        </p>
      </div>
    );
  }

  // Écran de chargement plein écran supprimé au profit des Skeletons par section

  return (
    <div className="relative lg:min-h-screen bg-white">
      {/* Background Split for Desktop */}
      <div className="hidden lg:block absolute top-0 right-0 bottom-0 w-[45%] bg-[#F5F5F5] border-l border-gray-200 z-0" />

      <div className="relative z-10 w-full max-w-[1600px] lg:px-8 mx-auto flex flex-col-reverse lg:flex-row">
        {/* ─── LEFT COLUMN: CHECKOUT FLOW ─── */}
        <div className="w-full lg:w-[55%] bg-white pb-32 lg:pb-32 pt-1 lg:pt-12 px-4 sm:px-6 lg:pt-12 lg:pr-12 xl:pr-16 lg:min-h-screen">
          <div className="w-full ml-auto">
            {/* DASHBOARD CARD FOR MOBILE (Summary + Stepper) — FULL WIDTH EDITION */}
            <div className="lg:hidden -mt-1 mb-6 bg-white border-b border-gray-100 shadow-sm overflow-hidden relative z-50">
              {/* 1. Summary Header (Repris du bloc Sticky) */}
              <div
                onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                className="bg-gray-50/50 px-4 py-4 flex items-center justify-between cursor-pointer border-b border-gray-100 transition-colors active:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-gray-900 tracking-[0.2em]">
                    {t("checkout:summary")}
                  </span>
                  <motion.div animate={{ rotate: isSummaryExpanded ? 180 : 0 }}>
                    <CaretDown
                      size={10}
                      weight="bold"
                      className="text-primary"
                    />
                  </motion.div>
                </div>
                <span className="text-base font-black text-gray-900 tracking-tighter">
                  {totalPrice.toFixed(2)}€
                </span>
              </div>

              {/* 2. Stepper Navigation integrated in card */}
              <div className="px-4 py-3 bg-white">
                <nav className="flex items-center justify-between">
                  <button
                    onClick={() => setDrawerOpen(true)}
                    className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 transition-colors"
                    title="Consulter mon panier"
                  >
                    {t("checkout:cart_label")}
                  </button>
                  <div className="flex items-center gap-1 text-gray-200">
                    <CaretRight size={8} weight="bold" />
                  </div>
                  <div className="flex-1 flex items-center justify-between px-2">
                    {[
                      { id: 1, label: t("checkout:step_info") },
                      { id: 2, label: t("checkout:step_shipping") },
                      { id: 3, label: t("checkout:step_payment") },
                    ].map((step, idx) => {
                      const isActive = currentStep === step.id;
                      const isCompleted = currentStep > step.id;
                      return (
                        <React.Fragment key={step.id}>
                          <button
                            onClick={() =>
                              isCompleted && setCurrentStep(step.id)
                            }
                            disabled={!isCompleted}
                            className={`text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-all relative py-1 ${
                              isActive
                                ? "text-gray-900"
                                : isCompleted
                                  ? "text-success"
                                  : "text-gray-300"
                            }`}
                          >
                            {step.label}
                            {isActive && (
                              <motion.div
                                layoutId="active-nav-dot"
                                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                              />
                            )}
                          </button>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </nav>
              </div>
            </div>

            {/* DESKTOP ONLY STEPPER (Original version hidden on mobile) */}
            <div className="hidden lg:block mb-12">
              <nav className="flex items-center gap-3 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-2"
                  title="Consulter mon panier"
                >
                  {t("checkout:cart_label")}
                  <CaretRight
                    size={8}
                    weight="bold"
                    className="text-gray-300"
                  />
                </button>
                {[
                  { id: 1, label: t("checkout:step_info") },
                  { id: 2, label: t("checkout:step_shipping") },
                  { id: 3, label: t("checkout:step_payment") },
                ].map((step, idx) => {
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;

                  return (
                    <React.Fragment key={step.id}>
                      <button
                        onClick={() => isCompleted && setCurrentStep(step.id)}
                        disabled={!isCompleted}
                        className={`transition-all duration-300 ${
                          isActive
                            ? "text-gray-900 border-b-2 border-gray-900 pb-0.5"
                            : isCompleted
                              ? "text-success hover:text-gray-900"
                              : "text-gray-300 cursor-default"
                        }`}
                      >
                        {step.label}
                      </button>
                      {idx < 2 && (
                        <CaretRight
                          size={8}
                          weight="bold"
                          className="text-gray-200"
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </nav>
            </div>

            {/* EXPRESS CHECKOUT REMOVED FOR CLASSIC CHRONOLOGICAL FLOW */}

            {/* ACCORDION 1: Contact */}
            <div
              className={`mb-2 lg:mb-6 transition-all duration-300 ${currentStep > 1 ? "opacity-80" : "opacity-100"}`}
            >
              <div
                id="step-content-1"
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 lg:mb-4 h-auto md:h-8 scroll-mt-24"
              >
                <h2 className="font-black text-lg uppercase tracking-tight text-gray-900 border-b-2 border-primary pb-1 self-start">
                  {t("checkout:contact_title")}
                </h2>
                {!authLoading && !user && currentStep === 1 && (
                  <div className="flex gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100 overflow-x-auto no-scrollbar flex-nowrap shrink-0 max-w-full">
                    {[
                      {
                        id: "guest",
                        label: txt("Achat Rapide", "Compra Rápida"),
                        icon: <User size={12} />,
                      },
                      {
                        id: "login",
                        label: txt("Connexion", "Iniciar Sessão"),
                        icon: <LockKey size={12} />,
                      },
                      {
                        id: "register",
                        label: txt("S'inscrire", "Registar-se"),
                        labelDesktop: txt("Créer un compte", "Criar Conta"),
                        icon: <PencilSimple size={12} />,
                      },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => {
                          setAuthMode(mode.id as any);
                          setAuthError(null);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all shrink-0 ${
                          authMode === mode.id
                            ? "bg-white text-gray-900 shadow-sm border border-gray-100"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        {mode.icon}
                        <span className="inline sm:hidden">{mode.label}</span>
                        <span className="hidden sm:inline">
                          {mode.labelDesktop || mode.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {currentStep === 1 ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={authMode}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4 pt-4 pb-1 w-full">
                      {authError && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-[10px] font-bold uppercase tracking-tight border border-red-100 flex items-center gap-2">
                          <div className="w-1 h-1 bg-red-600 rounded-full" />
                          {authError}
                        </div>
                      )}

                      {authLoading ? (
                        /* ─── SKELETON CHARGEMENT ─── */
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 animate-pulse space-y-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                            <div className="space-y-2 flex-1">
                              <div className="h-3 bg-gray-200 rounded w-1/4" />
                              <div className="h-4 bg-gray-200 rounded w-1/2" />
                            </div>
                          </div>
                          <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <div className="h-3 bg-gray-100 rounded w-1/3" />
                              <div className="h-4 bg-gray-200 rounded w-3/4" />
                            </div>
                            <div className="space-y-2">
                              <div className="h-3 bg-gray-100 rounded w-1/3" />
                              <div className="h-4 bg-gray-200 rounded w-3/4" />
                            </div>
                            <div className="col-span-2 space-y-2">
                              <div className="h-3 bg-gray-100 rounded w-1/4" />
                              <div className="h-4 bg-gray-200 rounded w-1/3" />
                            </div>
                          </div>
                          <div className="h-12 bg-gray-200 rounded-xl w-full" />
                        </div>
                      ) : user ? (
                        <div className="space-y-6 pt-2 pb-2">
                          <div className="bg-[#1F222A] border border-[#2F333F] rounded-2xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                            <div className="relative z-10">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-zinc-800 rounded-xl shadow-sm border border-zinc-700 flex items-center justify-center text-amber-500">
                                  <User size={20} weight="bold" />
                                </div>
                                <div>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 leading-none mb-1">
                                    {t("checkout:client_identified")}
                                  </p>
                                  <h3 className="text-sm font-black text-white uppercase tracking-tight">
                                    {profile?.firstName
                                      ? t("checkout:welcome_back", {
                                          name: profile.firstName,
                                        })
                                      : t("checkout:welcome")}
                                  </h3>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 border-t border-[#2F333F] pt-4">
                                <div>
                                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                                    {t("checkout:contact_label")}
                                  </p>
                                  <p className="text-xs font-bold text-white uppercase">
                                    {profile?.firstName} {profile?.lastName}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                                    {t("checkout:email")}
                                  </p>
                                  <p className="text-xs font-bold text-white">
                                    {user.email}
                                  </p>
                                </div>
                                {profile?.phone && (
                                  <div className="sm:col-span-2">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                                      {t("checkout:phone")}
                                    </p>
                                    <p className="text-xs font-bold text-white">
                                      {profile.phone}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className="mt-6 flex items-center justify-end">
                                <button
                                  onClick={() => auth.signOut()}
                                  className="text-[10px] font-black uppercase text-zinc-400 hover:text-red-400 transition-colors"
                                >
                                  {t("checkout:logout")}
                                </button>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => setCurrentStep(2)}
                            disabled={!formData.firstName || !formData.email}
                            className="w-full lg:flex hidden bg-primary text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all mt-4 text-xs disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95 hover:scale-[1.02]"
                          >
                            {t("checkout:continue_shipping")}{" "}
                            <ArrowRight size={16} weight="bold" />
                          </button>
                        </div>
                      ) : authMode === "login" ? (
                        /* ─── LOGIN FORM ─── */
                        <form
                          onSubmit={handleLogin}
                          className="space-y-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100"
                        >
                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">
                              {t("checkout:email")}
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full bg-white border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 px-4 py-3.5 rounded-xl outline-none text-sm font-medium transition-all"
                              placeholder="votre@email.com"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">
                              {t("checkout:password")}
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                value={loginPassword}
                                onChange={(e) =>
                                  setLoginPassword(e.target.value)
                                }
                                className="w-full bg-white border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 px-4 py-3.5 rounded-xl outline-none text-sm font-medium transition-all pr-12"
                                placeholder="••••••••"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                              >
                                {showPassword ? (
                                  <EyeSlash size={16} weight="bold" />
                                ) : (
                                  <Eye size={16} weight="bold" />
                                )}
                              </button>
                            </div>
                          </div>
                          <button
                            type="submit"
                            disabled={
                              isProcessing || !formData.email || !loginPassword
                            }
                            className="w-full bg-gray-900 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:bg-black transition-all mt-2 text-xs disabled:opacity-50 flex items-center justify-center gap-3"
                          >
                            {isProcessing ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              t("checkout:login_btn")
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setAuthMode("register")}
                            className="w-full text-center text-[10px] font-bold text-gray-400 uppercase hover:text-gray-900 transition-colors mt-2"
                          >
                            {t("checkout:no_account")}
                          </button>
                        </form>
                      ) : (
                        /* ─── SIGNUP / GUEST FORM ─── */
                        <div className="space-y-6">
                          {authMode === "guest" && (
                            <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl flex items-start gap-3">
                              <div className="bg-white p-2 rounded-xl shadow-sm text-amber-600 border border-amber-500/10">
                                <Info size={16} weight="bold" />
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-tight text-gray-900">
                                  {t("checkout:express_checkout")}
                                </p>
                                <p className="text-[10px] font-medium text-gray-500 leading-tight mt-0.5">
                                  {t("checkout:express_checkout_desc")}
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">
                                {t("checkout:first_name")}
                              </label>
                              <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="w-full bg-gray-50/50 hover:bg-gray-50/80 border border-[#1F222A] focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 px-4 py-3 rounded-xl outline-none text-sm font-bold transition-all shadow-sm duration-200"
                                placeholder={txt("Votre prénom", "O seu nome")}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">
                                {t("checkout:last_name")}
                              </label>
                              <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="w-full bg-gray-50/50 hover:bg-gray-50/80 border border-[#1F222A] focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 px-4 py-3 rounded-xl outline-none text-sm font-bold transition-all shadow-sm duration-200"
                                placeholder={txt("Votre nom", "O seu apelido")}
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">
                              {t("checkout:email")}
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full bg-gray-50/50 hover:bg-gray-50/80 border border-[#1F222A] focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 px-4 py-3 rounded-xl outline-none text-sm font-bold transition-all shadow-sm duration-200"
                              placeholder="votre@email.com"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">
                              {t("checkout:phone")}
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full bg-gray-50/50 hover:bg-gray-50/80 border border-[#1F222A] focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 px-4 py-3 rounded-xl outline-none text-sm font-bold transition-all shadow-sm duration-200"
                              placeholder="+33 6 12 34 56 78"
                            />
                          </div>

                          {authMode === "register" && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              className="space-y-1"
                            >
                              <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">
                                {t("checkout:password_label")}
                              </label>
                              <div className="relative">
                                <input
                                  type={showPassword ? "text" : "password"}
                                  value={registerPassword}
                                  onChange={(e) =>
                                    setRegisterPassword(e.target.value)
                                  }
                                  className="w-full bg-white border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 px-4 py-3.5 rounded-xl outline-none text-sm font-medium transition-all pr-12"
                                  placeholder={t(
                                    "checkout:password_placeholder",
                                  )}
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                                >
                                  {showPassword ? (
                                    <EyeSlash size={16} weight="bold" />
                                  ) : (
                                    <Eye size={16} weight="bold" />
                                  )}
                                </button>
                              </div>
                            </motion.div>
                          )}

                          <div className="pt-2 space-y-3">
                            <label className="flex items-start gap-3 cursor-pointer group">
                              <div className="relative mt-0.5">
                                <input
                                  type="checkbox"
                                  className="peer sr-only"
                                  defaultChecked
                                />
                                <div className="w-4 h-4 border-2 border-gray-200 rounded peer-checked:bg-gray-900 peer-checked:border-gray-900 transition-all" />
                                <Check
                                  size={10}
                                  weight="bold"
                                  className="absolute top-0.5 left-0.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                                />
                              </div>
                              <span className="text-[11px] font-medium text-gray-500 leading-tight group-hover:text-gray-900 transition-colors">
                                {t("checkout:news_subscribe")}
                              </span>
                            </label>
                          </div>

                          <button
                            onClick={handleIdentification}
                            disabled={
                              isProcessing ||
                              !formData.firstName ||
                              !formData.email ||
                              (authMode === "register" && !registerPassword)
                            }
                            className="w-full lg:block hidden bg-primary text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all mt-4 text-xs disabled:opacity-50 active:scale-95 hover:scale-[1.02]"
                          >
                            {isProcessing ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                            ) : authMode === "register" ? (
                              t("checkout:signup_continue")
                            ) : (
                              t("checkout:continue_shipping")
                            )}
                          </button>

                          <div className="flex justify-center mt-4">
                            <Link
                              to="/boutique"
                              className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-2"
                            >
                              <Bank size={14} weight="bold" />
                              {t("checkout:back_to_shop")}
                            </Link>
                          </div>

                          <p className="text-[9px] text-gray-400 font-medium text-center px-4 mt-6 leading-relaxed uppercase tracking-tighter">
                            {isFR ? (
                              <>
                                En continuant, vous acceptez nos{" "}
                                <Link
                                  to="/cgv"
                                  className="underline hover:text-gray-900"
                                >
                                  Conditions Générales de Vente
                                </Link>{" "}
                                et notre{" "}
                                <Link
                                  to="/confidentialite"
                                  className="underline hover:text-gray-900"
                                >
                                  Politique de Confidentialité
                                </Link>
                                .
                              </>
                            ) : (
                              <>
                                Ao continuar, aceita as nossas{" "}
                                <Link
                                  to="/cgv"
                                  className="underline hover:text-gray-900"
                                >
                                  Condições Gerais de Venda
                                </Link>{" "}
                                e a nossa{" "}
                                <Link
                                  to="/confidentialite"
                                  className="underline hover:text-gray-900"
                                >
                                  Política de Privacidade
                                </Link>
                                .
                              </>
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div
                  className="p-3 bg-gray-50/80 border border-[#00A859] rounded-xl flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-100 transition-all cursor-pointer group"
                  onClick={() => setCurrentStep(1)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex-shrink-0 w-6 h-6 bg-white rounded-lg flex items-center justify-center text-success border border-gray-100 shadow-sm">
                      <Check size={12} weight="bold" />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2 min-w-0 overflow-hidden">
                      <span className="whitespace-nowrap">
                        {t("checkout:delivered_to")}
                      </span>
                      <span className="text-gray-900 truncate lowercase">
                        {user?.email || formData.email}
                      </span>
                    </div>
                  </div>
                  <button className="flex-shrink-0 text-primary group-hover:underline flex items-center gap-1 ml-2">
                    <PencilSimple size={12} weight="bold" />{" "}
                    <span className="hidden xs:inline">
                      {t("checkout:modify")}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* SECTION 2: Shipping */}
            {currentStep >= 2 && (
              <div className="mb-1 lg:mb-6 transition-all duration-300">
                {currentStep === 2 && (
                  <div
                    id="step-content-2"
                    className="flex items-center justify-between mb-1 lg:mb-4 scroll-mt-24"
                  >
                    <h2 className="font-black text-lg uppercase tracking-tight text-gray-900">
                      {t("checkout:shipping_title")}
                    </h2>
                  </div>
                )}

                {currentStep === 2 ? (
                  <AnimatePresence>
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-1 lg:space-y-5 pt-1 pb-0 w-full">
                        {/* SMART MULTI-ADDRESS SELECTION */}
                        {user && (
                          <div className="mb-8 space-y-4">
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-[#00A859] ml-1">
                                {t("checkout:saved_addresses")}
                              </label>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                              {authLoading ? (
                                <>
                                  {[1, 2].map((i) => (
                                    <div
                                      key={i}
                                      className="bg-white border border-gray-100 p-5 rounded-2xl animate-pulse space-y-4"
                                    >
                                      <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-gray-100 rounded-xl" />
                                        <div className="space-y-2 flex-grow">
                                          <div className="h-4 bg-gray-100 rounded w-1/3" />
                                          <div className="h-3 bg-gray-50 rounded w-1/2" />
                                          <div className="h-3 bg-gray-50 rounded w-2/3" />
                                        </div>
                                        <div className="w-5 h-5 bg-gray-100 rounded-full" />
                                      </div>
                                    </div>
                                  ))}
                                </>
                              ) : (
                                (() => {
                                  let savedAddresses = [
                                    ...(profile?.addresses || []),
                                  ];

                                  // Si une adresse "racine" existe et n'est pas déjà dans le tableau (évite les doublons)
                                  if (profile?.address) {
                                    const rootAddressId = "root-default";
                                    const hasRootAlready = savedAddresses.some(
                                      (a) =>
                                        a.id === rootAddressId ||
                                        a.address === profile.address,
                                    );

                                    if (!hasRootAlready) {
                                      savedAddresses.unshift({
                                        id: rootAddressId,
                                        firstName: profile.firstName,
                                        lastName: profile.lastName,
                                        address: profile.address,
                                        city: profile.city,
                                        zipCode: profile.zipCode,
                                        country: profile.country,
                                        phone: profile.phone,
                                        isDefault: true,
                                      });
                                    }
                                  }

                                  if (savedAddresses.length === 0) {
                                    return (
                                      <div className="text-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-100">
                                        <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100/50">
                                          <MapPin
                                            size={24}
                                            weight="duotone"
                                            className="text-gray-300"
                                          />
                                        </div>
                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-relaxed">
                                          {t("checkout:no_saved_addresses")}
                                          <br />
                                          <span className="text-primary/60">
                                            {t(
                                              "checkout:no_saved_addresses_sub",
                                            )}
                                          </span>
                                        </p>
                                      </div>
                                    );
                                  }

                                  return savedAddresses.map((addr: any) => (
                                    <div
                                      key={addr.id}
                                      onClick={() => {
                                        setSelectedAddressId(addr.id);
                                        setFormData((prev) => ({
                                          ...prev,
                                          firstName: addr.firstName,
                                          lastName: addr.lastName,
                                          address: addr.address,
                                          city: addr.city,
                                          zipCode: addr.zipCode,
                                          country: addr.country,
                                          phone: addr.phone,
                                        }));
                                        setShowManualAddress(false); // Sélection exclusive : on ferme le formulaire manuel
                                      }}
                                      className={`bg-white border-2 p-5 rounded-2xl relative cursor-pointer hover:shadow-md transition-all group overflow-hidden ${
                                        selectedAddressId === addr.id
                                          ? "border-[#00A859]"
                                          : "border-gray-100 hover:border-primary/30"
                                      }`}
                                    >
                                      {addr.isDefault && (
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-[#00A859]/5 rounded-bl-full transition-transform group-hover:scale-110" />
                                      )}
                                      <div className="flex items-start justify-between relative z-10">
                                        <div className="flex gap-4">
                                          <div
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                              selectedAddressId === addr.id
                                                ? "bg-[#00A859]/10 text-[#00A859]"
                                                : "bg-gray-50 text-gray-400"
                                            }`}
                                          >
                                            <MapPin size={22} weight="bold" />
                                          </div>
                                          <div>
                                            <div className="flex items-center gap-2 mb-1">
                                              <h4 className="text-sm font-black text-gray-900 uppercase">
                                                {addr.firstName} {addr.lastName}
                                              </h4>
                                              {addr.isDefault && (
                                                <span className="bg-[#00A859]/10 text-[#00A859] text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                                                  {t(
                                                    "checkout:primary_address",
                                                  )}
                                                </span>
                                              )}
                                            </div>
                                            <p className="text-xs text-gray-500 font-medium leading-relaxed">
                                              {addr.address}
                                              <br />
                                              {addr.zipCode} {addr.city},{" "}
                                              {addr.country}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                          {selectedAddressId === addr.id ? (
                                            <div className="bg-[#00A859] text-white p-1.5 rounded-full shadow-sm">
                                              <Check size={14} weight="bold" />
                                            </div>
                                          ) : (
                                            <div className="w-5 h-5 border-2 border-gray-100 rounded-full" />
                                          )}
                                          {!addr.isDefault && (
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteAddress(addr.id);
                                              }}
                                              className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                              title={txt(
                                                "Supprimer",
                                                "Eliminar",
                                              )}
                                            >
                                              <Trash size={18} />
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ));
                                })()
                              )}
                            </div>

                            {!showManualAddress && (
                              <div className="mt-4 text-center">
                                <button
                                  onClick={() => {
                                    // On vide l'adresse actuelle pour désélectionner la liste et marquer l'exclusivité
                                    setFormData((prev) => ({
                                      ...prev,
                                      address: "",
                                      city: "",
                                      zipCode: "",
                                    }));
                                    setShowManualAddress(true);
                                  }}
                                  className="text-[10px] font-black uppercase text-gray-400 hover:text-primary transition-colors border-b border-gray-200 hover:border-primary"
                                >
                                  {t("checkout:use_new_address")}
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {(showManualAddress ||
                          !user ||
                          (profile &&
                            !profile.address &&
                            (!profile.addresses ||
                              profile.addresses.length === 0))) && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                          >
                            {(profile?.address ||
                              (profile?.addresses &&
                                profile.addresses.length > 0)) && (
                              <div className="flex items-center justify-between mb-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-900 ml-1">
                                  {t("checkout:new_address")}
                                </label>
                                <button
                                  onClick={() => setShowManualAddress(false)}
                                  className="text-[9px] font-bold text-gray-400 uppercase hover:text-red-500"
                                >
                                  {t("checkout:cancel")}
                                </button>
                              </div>
                            )}
                            <div className="space-y-1">
                              <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">
                                {t("checkout:country")}
                              </label>
                              <select
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                className="w-full bg-gray-50/50 hover:bg-gray-50/80 border border-[#1F222A] focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 px-4 py-3 rounded-xl outline-none text-sm font-bold transition-all shadow-sm duration-200 appearance-none"
                              >
                                <option value="France">
                                  {txt(
                                    "France métropolitaine",
                                    "França Metropolitana",
                                  )}
                                </option>
                                <option value="Suisse">Suisse</option>
                                <option value="Portugal">Portugal</option>
                                <option value="Belgique">Belgique</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                                {t("checkout:full_address")}
                              </label>
                              <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="w-full bg-gray-50/50 hover:bg-gray-50/80 border border-[#1F222A] focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 px-4 py-3 rounded-xl outline-none text-sm font-bold transition-all shadow-sm duration-200"
                                placeholder={txt(
                                  "Numéro, rue, appartement...",
                                  "Número, rua, apartamento...",
                                )}
                              />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">
                                  {t("checkout:postal_code")}
                                </label>
                                <input
                                  type="text"
                                  name="zipCode"
                                  value={formData.zipCode}
                                  onChange={handleInputChange}
                                  className="w-full bg-gray-50/50 hover:bg-gray-50/80 border border-[#1F222A] focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 px-4 py-3 rounded-xl outline-none text-sm font-bold transition-all shadow-sm duration-200"
                                  placeholder="75001"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">
                                  {t("checkout:city")}
                                </label>
                                <input
                                  type="text"
                                  name="city"
                                  value={formData.city}
                                  onChange={handleInputChange}
                                  className="w-full bg-gray-50/50 hover:bg-gray-50/80 border border-[#1F222A] focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 px-4 py-3 rounded-xl outline-none text-sm font-bold transition-all shadow-sm duration-200"
                                  placeholder="Paris"
                                />
                              </div>
                            </div>

                            {user && (
                              <div className="pt-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                  <div className="relative">
                                    <input
                                      type="checkbox"
                                      className="peer sr-only"
                                      checked={saveAddressToProfile}
                                      onChange={(e) =>
                                        setSaveAddressToProfile(
                                          e.target.checked,
                                        )
                                      }
                                    />
                                    <div className="w-5 h-5 border-2 border-gray-200 rounded-lg group-hover:border-primary peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                                      <Check
                                        size={12}
                                        weight="bold"
                                        className="text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                                      />
                                    </div>
                                  </div>
                                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight group-hover:text-gray-900 transition-colors">
                                    {t("checkout:save_address_label")}
                                  </span>
                                </label>
                              </div>
                            )}
                          </motion.div>
                        )}

                        {/* Mode de Livraison */}
                        <div className="mt-2 pt-6 border-t border-gray-100">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-900 ml-1 mb-4 block">
                            {t("checkout:shipping_method")}
                          </label>
                          <label className="flex items-center justify-between p-4 border-2 border-gray-900 rounded-xl bg-gray-50 cursor-pointer">
                            <div className="flex items-center gap-4">
                              <div className="w-5 h-5 rounded-full border-[5px] border-gray-900 bg-white" />
                              <div>
                                <p className="font-bold text-gray-900 text-sm">
                                  {t("checkout:shipping_standard")}
                                </p>
                                <p className="text-xs text-gray-500 font-medium tracking-tight">
                                  {t("checkout:shipping_standard_desc")}
                                </p>
                              </div>
                            </div>
                            <span className="font-black uppercase tracking-widest text-success border border-success/20 bg-success/10 px-2.5 py-1 rounded text-[10px]">
                              {t("checkout:free")}
                            </span>
                          </label>
                        </div>

                        <button
                          onClick={handleShippingSubmit}
                          disabled={
                            isProcessing ||
                            (!selectedAddressId &&
                              (!formData.address || !formData.city))
                          }
                          className="w-full lg:flex hidden items-center justify-center gap-3 bg-gray-900 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:bg-black transition-all text-xs disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              {selectedAddressId ||
                              (formData.address && formData.city)
                                ? t("checkout:continue_payment")
                                : t("checkout:enter_address")}{" "}
                              <ArrowRight size={14} weight="bold" />
                            </>
                          )}
                        </button>

                        <div className="lg:flex hidden justify-center mt-4">
                          <Link
                            to="/boutique"
                            className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-2"
                          >
                            <Bank size={14} weight="bold" />
                            {t("checkout:back_to_shop")}
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                ) : currentStep > 2 ? (
                  <div
                    className="p-3 bg-gray-50/80 border border-[#00A859] rounded-xl flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-100 transition-all cursor-pointer group"
                    onClick={() => setCurrentStep(2)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex-shrink-0 w-6 h-6 bg-white rounded-lg flex items-center justify-center text-success border border-gray-100 shadow-sm">
                        <Check size={12} weight="bold" />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2 min-w-0">
                        <span className="whitespace-nowrap">
                          {txt("Livré à :", "Entregar em:")}
                        </span>
                        <span className="text-gray-900 font-black truncate">
                          {(() => {
                            if (selectedAddressId) {
                              if (selectedAddressId === "manual-session") {
                                return formData.address
                                  ? `${formData.address}, ${formData.city}`
                                  : txt("Adresse saisie", "Endereço inserido");
                              }
                              const savedAddresses = [
                                ...(profile?.addresses || []),
                                ...(profile?.address
                                  ? [
                                      {
                                        id: "root-default",
                                        address: profile.address,
                                        city: profile.city,
                                      },
                                    ]
                                  : []),
                              ];
                              const selected = savedAddresses.find(
                                (a) => a.id === selectedAddressId,
                              );
                              return selected
                                ? `${selected.address}, ${selected.city}`
                                : txt(
                                    "Adresse sélectionnée",
                                    "Endereço selecionado",
                                  );
                            }
                            return formData.address
                              ? `${formData.address}, ${formData.city}`
                              : txt(
                                  "Adresse non définie",
                                  "Endereço não definido",
                                );
                          })()}
                        </span>
                      </div>
                    </div>
                    <button className="flex-shrink-0 text-primary group-hover:underline flex items-center gap-1 ml-2">
                      <PencilSimple size={12} weight="bold" />{" "}
                      <span className="hidden xs:inline">
                        {t("checkout:modify")}
                      </span>
                    </button>
                  </div>
                ) : null}
              </div>
            )}
            {currentStep >= 3 && (
              <div
                id="step-content-3"
                className="transition-all duration-300 scroll-mt-24 mb-1"
              >
                <div className="flex items-center mb-1 lg:mb-6">
                  <h2 className="font-black text-lg uppercase tracking-tight text-gray-900 border-b-2 border-primary pb-1">
                    {t("checkout:payment_title")}
                  </h2>
                </div>

                {currentStep === 3 && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2 pb-0 lg:pt-4 lg:pb-6 w-full">
                        {/* Payment Gateway Accordion — formulaire inline */}
                        <div className="space-y-3 mb-8">
                          {/* STRIPE */}
                          {activeGateways.includes("stripe") && (
                            <div
                              className={`border-2 rounded-2xl overflow-hidden transition-all ${selectedGateway === "stripe" ? "border-[#00A859]" : "border-[#00A859]/30"}`}
                            >
                              <button
                                onClick={() =>
                                  setSelectedGateway(
                                    selectedGateway === "stripe"
                                      ? null
                                      : "stripe",
                                  )
                                }
                                className={`w-full flex items-center justify-between p-4 transition-all ${selectedGateway === "stripe" ? "bg-gray-50" : "bg-white hover:bg-gray-50"}`}
                              >
                                <div className="flex items-center gap-3">
                                  <CreditCard
                                    size={24}
                                    className={
                                      selectedGateway === "stripe"
                                        ? "text-[#00A859]"
                                        : "text-gray-400"
                                    }
                                    weight={
                                      selectedGateway === "stripe"
                                        ? "fill"
                                        : "regular"
                                    }
                                  />
                                  <span
                                    className={`text-sm font-bold ${selectedGateway === "stripe" ? "text-gray-900" : "text-gray-500"}`}
                                  >
                                    {t("checkout:stripe_payment_desc")}
                                  </span>
                                </div>
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedGateway === "stripe" ? "border-[#00A859]" : "border-gray-300"}`}
                                >
                                  {selectedGateway === "stripe" && (
                                    <div className="w-2.5 h-2.5 bg-[#00A859] rounded-full" />
                                  )}
                                </div>
                              </button>
                              {selectedGateway === "stripe" && (
                                <div className="border-t border-gray-100 bg-[#F8F9FA] p-6">
                                  {stripePromise ? (
                                    <Elements stripe={stripePromise}>
                                      <StripePaymentInner
                                        isProcessing={isProcessing}
                                        setIsProcessing={setIsProcessing}
                                        nextStep={nextStep}
                                        totalPrice={finalTotal}
                                        saveOrder={saveOrder}
                                        formData={formData}
                                      />
                                    </Elements>
                                  ) : (
                                    <div className="p-8 text-center">
                                      <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto"></div>
                                    </div>
                                  )}
                                  <button
                                    onClick={() =>
                                      document.dispatchEvent(
                                        new CustomEvent("STRIPE_SUBMIT"),
                                      )
                                    }
                                    disabled={isProcessing}
                                    className="w-full lg:flex hidden bg-gray-900 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg hover:bg-black transition-all mt-6 text-xs disabled:opacity-50 items-center justify-center gap-3"
                                  >
                                    {isProcessing ? (
                                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      <>
                                        <LockKey size={16} weight="bold" />{" "}
                                        {txt("Payer", "Pagar")}{" "}
                                        {finalTotal.toFixed(2)}€
                                      </>
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          {/* PAYPAL */}
                          {activeGateways.includes("paypal") && (
                            <div
                              className={`border-2 rounded-2xl overflow-hidden transition-all ${selectedGateway === "paypal" ? "border-[#00A859]" : "border-[#00A859]/30"}`}
                            >
                              <button
                                onClick={() =>
                                  setSelectedGateway(
                                    selectedGateway === "paypal"
                                      ? null
                                      : "paypal",
                                  )
                                }
                                className={`w-full flex items-center justify-between p-4 transition-all ${selectedGateway === "paypal" ? "bg-gray-50" : "bg-white hover:bg-gray-50"}`}
                              >
                                <div className="flex items-center gap-3">
                                  <svg
                                    className="h-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M19.16 7.42C19.12 7.37 18.06 6.32 15.65 6.32H8.38C8.01 6.32 7.69 6.57 7.63 6.93L5.27 21.84C5.23 22.09 5.42 22.32 5.67 22.32H9.28C9.58 22.32 9.83 22.1 9.88 21.8L10.33 18.91C10.38 18.55 10.7 18.3 11.07 18.3H12.92C15.86 18.3 18.17 16.63 18.77 12.82C18.89 12.06 18.9 11.3 18.8 10.59C18.72 10.01 18.55 9.46 18.3 8.97C18.01 8.35 17.65 7.85 17.58 7.75C17.5 7.66 17.5 7.53 17.58 7.44C17.65 7.35 17.78 7.29 17.89 7.32C18.33 7.43 18.77 7.45 19.16 7.42Z"
                                      fill="#113984"
                                    />
                                    <path
                                      d="M19.16 7.42C19.12 7.37 18.06 6.32 15.65 6.32H8.38C8.01 6.32 7.69 6.57 7.63 6.93L5.27 21.84C5.23 22.09 5.42 22.32 5.67 22.32H9.28C9.58 22.32 9.83 22.1 9.88 21.8L10.33 18.91C10.38 18.55 10.7 18.3 11.07 18.3H12.92C15.86 18.3 18.17 16.63 18.77 12.82C18.89 12.06 18.9 11.3 18.8 10.59C18.72 10.01 18.55 9.46 18.3 8.97C19.16 10.66 19.34 13.06 18.04 15.4C17.7 16.03 17.26 16.59 16.73 17.07L17.15 14.41C17.2 14.05 16.89 13.8 16.52 13.8H14.67C11.73 13.8 9.42 15.47 8.82 19.28L8.6 20.67L9.88 12.57C9.93 12.21 10.25 11.96 10.62 11.96H12.47C15.41 11.96 17.72 10.29 18.32 6.48C18.34 6.33 18.35 6.18 18.36 6.03C18.81 6.39 19.19 6.87 19.16 7.42Z"
                                      fill="#179BD7"
                                    />
                                  </svg>
                                  <span
                                    className={`text-sm font-bold ${selectedGateway === "paypal" ? "text-gray-900" : "text-gray-500"}`}
                                  >
                                    PayPal
                                  </span>
                                </div>
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedGateway === "paypal" ? "border-[#00A859]" : "border-gray-300"}`}
                                >
                                  {selectedGateway === "paypal" && (
                                    <div className="w-2.5 h-2.5 bg-[#00A859] rounded-full" />
                                  )}
                                </div>
                              </button>
                              {selectedGateway === "paypal" && (
                                <div
                                  className="border-t border-gray-100 bg-[#F8F9FA] p-6 text-center"
                                  style={{ isolation: "isolate" }}
                                >
                                  <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-4">
                                    {txt(
                                      "Finaliser votre commande",
                                      "Finalizar a sua encomenda",
                                    )}
                                  </p>
                                  <div
                                    style={{ position: "relative", zIndex: 1 }}
                                  >
                                    <PayPalScriptProvider
                                      options={{
                                        clientId:
                                          config?.paypal?.clientId || "",
                                        currency: "EUR",
                                      }}
                                    >
                                      <PayPalButtons
                                        style={{
                                          layout: "vertical",
                                          shape: "rect",
                                          label: "pay",
                                          height: 45,
                                        }}
                                        createOrder={(data, actions) =>
                                          actions.order.create({
                                            intent: "CAPTURE",
                                            purchase_units: [
                                              {
                                                amount: {
                                                  currency_code: "EUR",
                                                  value: finalTotal.toFixed(2),
                                                },
                                              },
                                            ],
                                          })
                                        }
                                        onApprove={async (data, actions) => {
                                          if (actions.order) {
                                            const orderDetails =
                                              await actions.order.capture();
                                            await saveOrder(
                                              "paypal",
                                              orderDetails,
                                            );
                                          } else {
                                            await saveOrder("paypal", data);
                                          }
                                          nextStep();
                                          return Promise.resolve();
                                        }}
                                      />
                                    </PayPalScriptProvider>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* BANK TRANSFER */}
                          {(activeGateways.includes("bank_transfer") ||
                            true) && (
                            <div
                              className={`border-2 rounded-2xl overflow-hidden transition-all ${selectedGateway === "bank_transfer" ? "border-[#00A859]" : "border-[#00A859]/30"}`}
                            >
                              <button
                                onClick={() =>
                                  setSelectedGateway(
                                    selectedGateway === "bank_transfer"
                                      ? null
                                      : "bank_transfer",
                                  )
                                }
                                className={`w-full flex items-center justify-between p-4 transition-all ${selectedGateway === "bank_transfer" ? "bg-gray-50" : "bg-white hover:bg-gray-50"}`}
                              >
                                <div className="flex items-center gap-3">
                                  <Bank
                                    size={24}
                                    className={
                                      selectedGateway === "bank_transfer"
                                        ? "text-[#00A859]"
                                        : "text-gray-400"
                                    }
                                    weight={
                                      selectedGateway === "bank_transfer"
                                        ? "fill"
                                        : "regular"
                                    }
                                  />
                                  <span
                                    className={`text-sm font-bold ${selectedGateway === "bank_transfer" ? "text-gray-900" : "text-gray-500"}`}
                                  >
                                    {txt(
                                      "Virement Bancaire",
                                      "Transferência Bancária",
                                    )}
                                  </span>
                                </div>
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedGateway === "bank_transfer" ? "border-[#00A859]" : "border-gray-300"}`}
                                >
                                  {selectedGateway === "bank_transfer" && (
                                    <div className="w-2.5 h-2.5 bg-[#00A859] rounded-full" />
                                  )}
                                </div>
                              </button>
                              {selectedGateway === "bank_transfer" && (
                                <div className="border-t border-gray-100 bg-[#F8F9FA] p-6">
                                  <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 space-y-4 shadow-sm">
                                    <div className="flex items-center gap-3 text-primary">
                                      <Info size={18} weight="bold" />
                                      <p className="text-[10px] font-black uppercase tracking-widest">
                                        {t("checkout:bank_transfer_info")}
                                      </p>
                                    </div>
                                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                                      {t("checkout:bank_transfer_desc")}
                                    </p>
                                    <div className="grid grid-cols-1 gap-3 pt-2">
                                      <div className="p-3 bg-[#1F222A]/5 rounded-lg border border-[#1F222A]">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">
                                          {t("checkout:beneficiary")}
                                        </p>
                                        <p className="text-xs font-black text-gray-900">
                                          {config?.bank_transfer?.beneficiary ||
                                            "IMEXMERCADO SARL"}
                                        </p>
                                      </div>
                                      <div className="p-3 bg-[#1F222A]/5 rounded-lg border border-[#1F222A]">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">
                                          IBAN
                                        </p>
                                        <p className="text-xs font-black text-gray-900 tracking-widest">
                                          {config?.bank_transfer?.iban ||
                                            "FR76 3000 6000 0123 4567 8901 234"}
                                        </p>
                                      </div>
                                      <div className="p-3 bg-[#1F222A]/5 rounded-lg border border-[#1F222A]">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">
                                          BIC
                                        </p>
                                        <p className="text-xs font-black text-gray-900 tracking-widest">
                                          {config?.bank_transfer?.bic ||
                                            "IMEXFR2P"}
                                        </p>
                                      </div>
                                      <div className="p-3 bg-[#1F222A]/5 rounded-lg border border-[#1F222A]">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">
                                          {t("checkout:reference_to_indicate")}
                                        </p>
                                        <p className="text-xs font-black text-primary">
                                          {txt("COMMANDE #", "ENCOMENDA #")}
                                          {Date.now().toString().slice(-6)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <button
                                    onClick={async () => {
                                      setIsProcessing(true);
                                      const orderId = await saveOrder(
                                        "bank_transfer",
                                        {
                                          status: "Awaiting Bank Transfer",
                                          iban: config?.bank_transfer?.iban,
                                          beneficiary:
                                            config?.bank_transfer?.beneficiary,
                                        },
                                      );
                                      if (orderId) nextStep();
                                      setIsProcessing(false);
                                    }}
                                    disabled={isProcessing}
                                    className="w-full lg:flex hidden bg-gray-900 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg hover:bg-black transition-all text-xs disabled:opacity-50 items-center justify-center gap-3"
                                  >
                                    {isProcessing ? (
                                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      t("checkout:confirm_order")
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          {/* MB WAY */}
                          {activeGateways.includes("mbway") && (
                            <div
                              className={`border-2 rounded-2xl overflow-hidden transition-all ${selectedGateway === "mbway" ? "border-[#00A859]" : "border-[#00A859]/30"}`}
                            >
                              <button
                                onClick={() =>
                                  setSelectedGateway(
                                    selectedGateway === "mbway"
                                      ? null
                                      : "mbway",
                                  )
                                }
                                className={`w-full flex items-center justify-between p-4 transition-all ${selectedGateway === "mbway" ? "bg-gray-50" : "bg-white hover:bg-gray-50"}`}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-xl">📱</span>
                                  <span
                                    className={`text-sm font-bold ${selectedGateway === "mbway" ? "text-gray-900" : "text-gray-500"}`}
                                  >
                                    MB WAY
                                  </span>
                                </div>
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedGateway === "mbway" ? "border-[#00A859]" : "border-gray-300"}`}
                                >
                                  {selectedGateway === "mbway" && (
                                    <div className="w-2.5 h-2.5 bg-[#00A859] rounded-full" />
                                  )}
                                </div>
                              </button>
                              {selectedGateway === "mbway" && (
                                <div className="border-t border-gray-100 bg-[#F8F9FA] p-6">
                                  <div className="space-y-4 mb-6">
                                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">
                                      {t("checkout:mbway_phone_label")}
                                    </label>
                                    <div className="flex gap-2">
                                      <span className="bg-white border border-[#1F222A] px-3 py-3 rounded-xl text-sm font-bold flex items-center justify-center text-gray-500 shrink-0">
                                        +351
                                      </span>
                                      <input
                                        type="tel"
                                        placeholder="912 345 678"
                                        value={mbWayPhone}
                                        onChange={(e) =>
                                          setMbWayPhone(
                                            e.target.value
                                              .replace(/\D/g, "")
                                              .slice(0, 9),
                                          )
                                        }
                                        className="w-full bg-white border border-[#1F222A] focus:border-gray-900 focus:ring-1 focus:ring-gray-900 px-4 py-3 rounded-xl outline-none text-sm font-bold transition-all shadow-sm"
                                        required
                                      />
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-medium">
                                      {t("checkout:mbway_phone_desc")}
                                    </p>
                                  </div>
                                  <button
                                    onClick={async () => {
                                      if (mbWayPhone.length < 9) {
                                        alert(
                                          txt(
                                            "Veuillez saisir un numéro de téléphone valide à 9 chiffres.",
                                            "Por favor, insira um número de telemóvel válido com 9 dígitos.",
                                          ),
                                        );
                                        return;
                                      }
                                      setIsProcessing(true);
                                      await new Promise((r) =>
                                        setTimeout(r, 1500),
                                      );
                                      const orderId = await saveOrder("mbway", {
                                        phone: `+351${mbWayPhone}`,
                                        merchantId: config?.mbway?.merchantId,
                                        status: "Awaiting MB WAY Confirmation",
                                      });
                                      if (orderId) nextStep();
                                      setIsProcessing(false);
                                    }}
                                    disabled={
                                      isProcessing || mbWayPhone.length < 9
                                    }
                                    className="w-full lg:flex hidden bg-gray-900 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg hover:bg-black transition-all text-xs disabled:opacity-50 items-center justify-center gap-3"
                                  >
                                    {isProcessing ? (
                                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      t("checkout:mbway_pay_btn")
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          {/* MULTIBANCO */}
                          {activeGateways.includes("multibanco") && (
                            <div
                              className={`border-2 rounded-2xl overflow-hidden transition-all ${selectedGateway === "multibanco" ? "border-[#2F333F]" : "border-[#2F333F]/30"}`}
                            >
                              <button
                                onClick={() =>
                                  setSelectedGateway(
                                    selectedGateway === "multibanco"
                                      ? null
                                      : "multibanco",
                                  )
                                }
                                className={`w-full flex items-center justify-between p-4 transition-all ${selectedGateway === "multibanco" ? "bg-gray-50" : "bg-white hover:bg-gray-50"}`}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-xl">🏦</span>
                                  <span
                                    className={`text-sm font-bold ${selectedGateway === "multibanco" ? "text-gray-900" : "text-gray-500"}`}
                                  >
                                    {txt("Multibanco", "Multibanco")}
                                  </span>
                                </div>
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedGateway === "multibanco" ? "border-[#2F333F]" : "border-gray-300"}`}
                                >
                                  {selectedGateway === "multibanco" && (
                                    <div className="w-2.5 h-2.5 bg-[#2F333F] rounded-full" />
                                  )}
                                </div>
                              </button>
                              {selectedGateway === "multibanco" && (
                                <div className="border-t border-gray-100 bg-[#F8F9FA] p-6 text-center">
                                  <p className="text-xs font-medium text-gray-500 mb-6 max-w-xs mx-auto">
                                    {t("checkout:multibanco_desc")}
                                  </p>
                                  <button
                                    onClick={async () => {
                                      setIsProcessing(true);
                                      await new Promise((r) =>
                                        setTimeout(r, 1000),
                                      );

                                      const refPart1 = Math.floor(
                                        100 + Math.random() * 900,
                                      ).toString();
                                      const refPart2 = Math.floor(
                                        100 + Math.random() * 900,
                                      ).toString();
                                      const refPart3 = Math.floor(
                                        100 + Math.random() * 900,
                                      ).toString();
                                      const mockRef = `${refPart1} ${refPart2} ${refPart3}`;

                                      const orderId = await saveOrder(
                                        "multibanco",
                                        {
                                          entity:
                                            config?.multibanco?.entity ||
                                            "12345",
                                          reference: mockRef,
                                          status: "Awaiting Multibanco Payment",
                                        },
                                      );
                                      if (orderId) nextStep();
                                      setIsProcessing(false);
                                    }}
                                    disabled={isProcessing}
                                    className="w-full lg:flex hidden bg-gray-900 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg hover:bg-black transition-all text-xs disabled:opacity-50 items-center justify-center gap-3"
                                  >
                                    {isProcessing ? (
                                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      t("checkout:generate_reference")
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          {/* MOLLIE */}
                          {activeGateways.includes("mollie") && (
                            <div
                              className={`border-2 rounded-2xl overflow-hidden transition-all ${selectedGateway === "mollie" ? "border-[#2F333F]" : "border-[#2F333F]/30"}`}
                            >
                              <button
                                onClick={() =>
                                  setSelectedGateway(
                                    selectedGateway === "mollie"
                                      ? null
                                      : "mollie",
                                  )
                                }
                                className={`w-full flex items-center justify-between p-4 transition-all ${selectedGateway === "mollie" ? "bg-gray-50" : "bg-white hover:bg-gray-50"}`}
                              >
                                <div className="flex items-center gap-3">
                                  <Globe
                                    size={24}
                                    className={
                                      selectedGateway === "mollie"
                                        ? "text-[#2F333F]"
                                        : "text-gray-400"
                                    }
                                    weight={
                                      selectedGateway === "mollie"
                                        ? "fill"
                                        : "regular"
                                    }
                                  />
                                  <span
                                    className={`text-sm font-bold ${selectedGateway === "mollie" ? "text-gray-900" : "text-gray-500"}`}
                                  >
                                    Mollie (Bancontact / iDEAL)
                                  </span>
                                </div>
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedGateway === "mollie" ? "border-[#2F333F]" : "border-gray-300"}`}
                                >
                                  {selectedGateway === "mollie" && (
                                    <div className="w-2.5 h-2.5 bg-[#2F333F] rounded-full" />
                                  )}
                                </div>
                              </button>
                              {selectedGateway === "mollie" && (
                                <div className="border-t border-gray-100 bg-gray-900 p-8 text-center relative overflow-hidden">
                                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_white_0%,_transparent_70%)]" />
                                  <div className="relative z-10 w-16 h-16 bg-white/10 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                                    <LockKey
                                      size={32}
                                      weight="duotone"
                                      className="text-white"
                                    />
                                  </div>
                                  <h4 className="text-white font-black uppercase tracking-widest text-sm mb-2">
                                    {t("checkout:secure_redirection")}
                                  </h4>
                                  <p className="text-white/60 text-xs font-medium max-w-xs mx-auto mb-6">
                                    {t("checkout:mollie_desc")}
                                  </p>
                                  <button
                                    onClick={() =>
                                      handleCreatePayment("mollie")
                                    }
                                    disabled={isProcessing}
                                    className="w-full lg:flex hidden bg-white text-gray-900 font-black uppercase tracking-widest py-4 rounded-xl hover:bg-gray-100 transition-all text-xs disabled:opacity-50 items-center justify-center gap-3"
                                  >
                                    {isProcessing ? (
                                      <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      <>
                                        <LockKey size={16} weight="bold" />{" "}
                                        {txt("Payer", "Pagar")}{" "}
                                        {finalTotal.toFixed(2)}€
                                      </>
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          {/* PAYPLUG */}
                          {activeGateways.includes("payplug") && (
                            <div
                              className={`border-2 rounded-2xl overflow-hidden transition-all ${selectedGateway === "payplug" ? "border-[#2F333F]" : "border-[#2F333F]/30"}`}
                            >
                              <button
                                onClick={() =>
                                  setSelectedGateway(
                                    selectedGateway === "payplug"
                                      ? null
                                      : "payplug",
                                  )
                                }
                                className={`w-full flex items-center justify-between p-4 transition-all ${selectedGateway === "payplug" ? "bg-gray-50" : "bg-white hover:bg-gray-50"}`}
                              >
                                <div className="flex items-center gap-3">
                                  <LockKey
                                    size={24}
                                    className={
                                      selectedGateway === "payplug"
                                        ? "text-[#2F333F]"
                                        : "text-gray-400"
                                    }
                                    weight={
                                      selectedGateway === "payplug"
                                        ? "fill"
                                        : "regular"
                                    }
                                  />
                                  <span
                                    className={`text-sm font-bold ${selectedGateway === "payplug" ? "text-gray-900" : "text-gray-500"}`}
                                  >
                                    PayPlug ({txt("Sécurisé", "Seguro")})
                                  </span>
                                </div>
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedGateway === "payplug" ? "border-[#2F333F]" : "border-gray-300"}`}
                                >
                                  {selectedGateway === "payplug" && (
                                    <div className="w-2.5 h-2.5 bg-[#2F333F] rounded-full" />
                                  )}
                                </div>
                              </button>
                              {selectedGateway === "payplug" && (
                                <div className="border-t border-gray-100 bg-gray-900 p-8 text-center relative overflow-hidden">
                                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_white_0%,_transparent_70%)]" />
                                  <div className="relative z-10 w-16 h-16 bg-white/10 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                                    <LockKey
                                      size={32}
                                      weight="duotone"
                                      className="text-white"
                                    />
                                  </div>
                                  <h4 className="text-white font-black uppercase tracking-widest text-sm mb-2">
                                    {t("checkout:secure_redirection")}
                                  </h4>
                                  <p className="text-white/60 text-xs font-medium max-w-xs mx-auto mb-6">
                                    {t("checkout:payplug_desc")}
                                  </p>
                                  <button
                                    onClick={() =>
                                      handleCreatePayment("payplug")
                                    }
                                    disabled={isProcessing}
                                    className="w-full lg:flex hidden bg-white text-gray-900 font-black uppercase tracking-widest py-4 rounded-xl hover:bg-gray-100 transition-all text-xs disabled:opacity-50 items-center justify-center gap-3"
                                  >
                                    {isProcessing ? (
                                      <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      <>
                                        <LockKey size={16} weight="bold" />{" "}
                                        {txt("Payer", "Pagar")}{" "}
                                        {finalTotal.toFixed(2)}€
                                      </>
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          {/* SQUARE */}
                          {activeGateways.includes("square") && (
                            <div
                              className={`border-2 rounded-2xl overflow-hidden transition-all ${selectedGateway === "square" ? "border-[#2F333F]" : "border-[#2F333F]/30"}`}
                            >
                              <button
                                onClick={() =>
                                  setSelectedGateway(
                                    selectedGateway === "square"
                                      ? null
                                      : "square",
                                  )
                                }
                                className={`w-full flex items-center justify-between p-4 transition-all ${selectedGateway === "square" ? "bg-gray-50" : "bg-white hover:bg-gray-50"}`}
                              >
                                <div className="flex items-center gap-3">
                                  <Bank
                                    size={24}
                                    className={
                                      selectedGateway === "square"
                                        ? "text-[#2F333F]"
                                        : "text-gray-400"
                                    }
                                    weight={
                                      selectedGateway === "square"
                                        ? "fill"
                                        : "regular"
                                    }
                                  />
                                  <span
                                    className={`text-sm font-bold ${selectedGateway === "square" ? "text-gray-900" : "text-gray-500"}`}
                                  >
                                    Terminal Square
                                  </span>
                                </div>
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedGateway === "square" ? "border-[#2F333F]" : "border-gray-300"}`}
                                >
                                  {selectedGateway === "square" && (
                                    <div className="w-2.5 h-2.5 bg-[#2F333F] rounded-full" />
                                  )}
                                </div>
                              </button>
                              {selectedGateway === "square" && (
                                <div className="border-t border-gray-100 bg-[#F8F9FA] p-6 text-center">
                                  {!config?.square?.applicationId ||
                                  config?.square?.applicationId.includes(
                                    "sample",
                                  ) ? (
                                    <div className="space-y-3 p-4">
                                      <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500 border border-amber-100">
                                        ⚠️
                                      </div>
                                      <h4 className="font-black text-gray-900 text-xs uppercase tracking-wider">
                                        {t(
                                          "checkout:square_credentials_required",
                                        )}
                                      </h4>
                                      <p className="text-[11px] font-medium text-gray-500 max-w-xs mx-auto leading-relaxed">
                                        {isFR ? (
                                          <>
                                            Veuillez renseigner un{" "}
                                            <strong>Application ID</strong> et
                                            un <strong>Location ID</strong>{" "}
                                            valides dans l'admin pour activer le
                                            terminal de paiement Square.
                                          </>
                                        ) : (
                                          <>
                                            Por favor, preencha um{" "}
                                            <strong>Application ID</strong> e{" "}
                                            <strong>Location ID</strong> válidos
                                            no painel de administração para
                                            ativar o terminal de pagamento
                                            Square.
                                          </>
                                        )}
                                      </p>
                                    </div>
                                  ) : (
                                    <PaymentForm
                                      applicationId={
                                        config.square.applicationId
                                      }
                                      locationId={config.square.locationId}
                                      cardTokenizeResponseReceived={async (
                                        token,
                                      ) => {
                                        if (token.status === "OK") {
                                          await handleCreatePayment("square", {
                                            sourceId: token.token,
                                          });
                                        }
                                      }}
                                    >
                                      <SquareCreditCard
                                        buttonProps={{
                                          css: {
                                            backgroundColor: "#111827",
                                            color: "#fff",
                                            fontSize: "12px",
                                            fontWeight: "900",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.15em",
                                            padding: "16px",
                                            borderRadius: "12px",
                                            marginTop: "24px",
                                            width: "100%",
                                          },
                                        }}
                                      />
                                    </PaymentForm>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {/* MODE TEST — SIMULATION */}
                          <div
                            className={`border-2 border-dashed rounded-2xl overflow-hidden transition-all ${selectedGateway === "simulation" ? "border-orange-400 bg-orange-50/50" : "border-[#2F333F]/30 bg-gray-50/30"}`}
                          >
                            <button
                              onClick={() =>
                                setSelectedGateway(
                                  selectedGateway === "simulation"
                                    ? null
                                    : "simulation",
                                )
                              }
                              className="w-full flex items-center justify-between p-4 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${selectedGateway === "simulation" ? "bg-orange-100" : "bg-gray-100"}`}
                                >
                                  🧪
                                </div>
                                <div className="text-left">
                                  <span
                                    className={`text-sm font-black block ${selectedGateway === "simulation" ? "text-orange-700" : "text-gray-600"}`}
                                  >
                                    {t("checkout:test_mode_title")}
                                  </span>
                                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">
                                    {t("checkout:test_mode_subtitle")}
                                  </span>
                                </div>
                              </div>
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedGateway === "simulation" ? "border-orange-400" : "border-gray-300"}`}
                              >
                                {selectedGateway === "simulation" && (
                                  <div className="w-2.5 h-2.5 bg-orange-400 rounded-full" />
                                )}
                              </div>
                            </button>
                            {selectedGateway === "simulation" && (
                              <div className="border-t border-dashed border-orange-200 bg-orange-50 p-6 text-center">
                                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-orange-200 shadow-sm text-2xl">
                                  🧪
                                </div>
                                <h4 className="font-black text-orange-700 uppercase tracking-widest text-sm mb-1">
                                  {txt("Paiement Simulé", "Pagamento Simulado")}
                                </h4>
                                <p className="text-xs font-medium text-gray-500 mb-5 max-w-xs mx-auto">
                                  {t("checkout:test_mode_desc")}
                                </p>
                                <button
                                  onClick={async () => {
                                    setIsProcessing(true);
                                    await new Promise((r) =>
                                      setTimeout(r, 1200),
                                    );
                                    await saveOrder("simulation", {
                                      status: "SIMULATED_SUCCESS",
                                      simulatedAt: new Date().toISOString(),
                                    });
                                    setIsProcessing(false);
                                    nextStep();
                                  }}
                                  disabled={isProcessing}
                                  className="w-full lg:flex hidden bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-orange-500/20 transition-all text-xs items-center justify-center gap-3 disabled:opacity-50"
                                >
                                  {isProcessing ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <>
                                      {t("checkout:confirm_test_order")} —{" "}
                                      {totalPrice.toFixed(2)}€
                                    </>
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ─── RIGHT COLUMN: STICKY ORDER SUMMARY ─── */}
        <div className="w-full lg:w-[45%] bg-[#F5F5F5] lg:min-h-screen lg:pl-12 pt-0 lg:pt-12 pb-0 lg:pb-8 border-b lg:border-b-0 border-gray-200">
          <div className="w-full max-w-xl mr-auto sticky top-0 lg:top-12 z-40 lg:z-10">
            {/* Mobile ONLY: Updated to Card approach */}
            {isSummaryExpanded && (
              <div className="lg:hidden p-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between sticky top-0 z-[60] backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <ShoppingCart
                    size={18}
                    weight="bold"
                    className="text-gray-900"
                  />
                  <span className="text-xs font-black uppercase tracking-widest text-gray-900">
                    {t("checkout:summary")}
                  </span>
                </div>
                <button
                  onClick={() => setIsSummaryExpanded(false)}
                  className="p-2 bg-primary/10 rounded-lg border border-primary/20 text-primary hover:bg-primary/20 transition-all shadow-sm flex items-center justify-center translate-y-1"
                >
                  <CaretUp size={16} weight="bold" />
                </button>
              </div>
            )}

            <AnimatePresence>
              {(isSummaryExpanded || window.innerWidth >= 1024) && (
                <motion.div
                  initial={
                    window.innerWidth < 1024 ? { height: 0, opacity: 0 } : {}
                  }
                  animate={
                    window.innerWidth < 1024
                      ? { height: "auto", opacity: 1 }
                      : {}
                  }
                  exit={
                    window.innerWidth < 1024 ? { height: 0, opacity: 0 } : {}
                  }
                  className="overflow-hidden bg-[#F5F5F5] lg:bg-transparent"
                >
                  <div className="px-6 sm:px-8 lg:px-0 pt-8 lg:pt-0 pb-8">
                    <div className="hidden lg:flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                      <h3 className="text-xl font-black tracking-tighter text-gray-900 uppercase">
                        {t("checkout:summary")}
                      </h3>
                      <div className="bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                          {totalItems} {t("checkout:items")}
                        </span>
                      </div>
                    </div>

                    {/* Cart Items — rééinjectés dans la colonne droite */}
                    <div className="mb-8 bg-white border border-[#2F333F] rounded-2xl overflow-hidden shadow-sm">
                      <div className="flex items-center justify-between px-5 py-4 border-b border-[#2F333F]">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                          {t("checkout:article_plur")}
                        </h4>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                          {totalItems} {t("checkout:items")}
                        </span>
                      </div>
                      <div className="divide-y divide-[#2F333F]">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 px-5 py-4"
                          >
                            <div className="relative shrink-0">
                              <div className="w-14 h-14 bg-gray-50 rounded-xl border border-[#2F333F] flex items-center justify-center overflow-hidden">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-2xl">📦</span>
                                )}
                              </div>
                              <span className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full font-black border-2 border-white">
                                {item.quantity}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-black text-gray-900 uppercase tracking-tight truncate">
                                {item.name}
                              </h5>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                {item.category ||
                                  txt("Service Premium", "Serviço Premium")}
                              </p>
                              <span className="text-[9px] px-1.5 py-0.5 bg-success/10 text-success rounded font-bold uppercase tracking-widest mt-1 inline-block">
                                {t("checkout:in_stock")}
                              </span>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <span className="font-black text-sm text-gray-900 tracking-tight">
                                {(item.price * item.quantity).toFixed(2)}€
                              </span>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                title={txt(
                                  "Retirer l'article",
                                  "Remover artigo",
                                )}
                              >
                                <Trash size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Promo Code Field */}
                    <div className="bg-white p-5 rounded-2xl border border-[#2F333F] shadow-sm mb-8">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">
                        {t("checkout:coupon")}
                      </p>
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder={t("checkout:coupon_placeholder")}
                          className="flex-1 min-w-0 bg-white border border-gray-200 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 rounded-xl px-3 py-3 text-sm font-medium outline-none transition-all placeholder:text-gray-400"
                        />
                        <button className="flex-shrink-0 bg-primary text-white font-black text-[10px] px-4 py-3 rounded-xl uppercase tracking-widest transition-all hover:bg-primary/90 shadow-md shadow-primary/10 active:scale-95">
                          {t("checkout:coupon_btn")}
                        </button>
                      </div>
                    </div>

                    {/* Price breakdown */}
                    <div className="space-y-4 text-sm mb-8 bg-white/50 p-6 rounded-2xl border border-[#2F333F]">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                          {t("checkout:subtotal")}
                        </span>
                        <span className="font-black text-gray-900">
                          {totalPrice.toFixed(2)}€
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-[#2F333F]">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                          {t("checkout:shipping")}
                        </span>
                        <div className="flex items-center gap-2">
                          {shippingPrice === 0 ? (
                            <>
                              <span className="text-[10px] font-black uppercase tracking-widest text-success">
                                {t("checkout:free")}
                              </span>
                              <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                            </>
                          ) : (
                            <span className="font-bold text-gray-900">
                              {shippingPrice.toFixed(2)}€
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Total */}
                    {/* Total */}
                    <div className="bg-gray-900 rounded-3xl p-8 flex justify-between items-center mb-8 shadow-[0_20px_40px_rgba(0,0,0,0.1)] relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/10 transition-colors" />
                      <div className="relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1 block">
                          {t("checkout:total_to_pay")}
                        </span>
                        <h2 className="text-white text-3xl font-black tracking-tighter uppercase">
                          {t("checkout:total")}
                        </h2>
                      </div>
                      <div className="relative z-10 text-right">
                        <span className="text-[10px] font-black text-white/30 mb-1 block uppercase">
                          EUR
                        </span>
                        <span className="text-4xl font-black text-white tracking-tighter">
                          {finalTotal.toFixed(2)}
                          <span className="text-2xl ml-0.5">€</span>
                        </span>
                      </div>
                    </div>

                    {/* FOOTER OF SUMMARY: CLOSE BUTTON */}
                    <div className="mt-4 mb-12 lg:hidden">
                      <button
                        onClick={() => setIsSummaryExpanded(false)}
                        className="w-full py-4 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        {t("checkout:close_summary")}
                        <CaretUp size={14} weight="bold" />
                      </button>
                    </div>

                    {/* Unified Trust Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                      <div className="bg-white p-2 rounded-xl border border-gray-100 flex items-center gap-2 shadow-sm">
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                          <ShieldCheck size={18} weight="fill" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-gray-900 leading-none">
                            {t("checkout:secured")}
                          </p>
                          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">
                            {t("checkout:ssl_badge")}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-gray-100 flex items-center gap-2 shadow-sm">
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                          <CheckCircle size={18} weight="fill" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-gray-900 leading-none">
                            {t("checkout:warranty")}
                          </p>
                          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">
                            {t("checkout:satisfaction")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ─── MOBILE ONLY: STICKY BOTTOM ACTION BAR (Shopify Pro Style) ─── */}
      {currentStep < 4 &&
        !(
          currentStep === 3 &&
          (selectedGateway === "paypal" || selectedGateway === "square")
        ) && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 p-3.5 z-[100] shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
            <button
              onClick={() => {
                if (currentStep === 1) handleIdentification();
                else if (currentStep === 2) handleShippingSubmit();
                else if (currentStep === 3) handlePaymentSubmit();
              }}
              disabled={
                isProcessing ||
                (currentStep === 1 &&
                  (!formData.firstName || !formData.email)) ||
                (currentStep === 2 &&
                  !selectedAddressId &&
                  (!formData.address || !formData.city)) ||
                (currentStep === 3 &&
                  selectedGateway === "mbway" &&
                  mbWayPhone.length < 9)
              }
              className="w-full bg-primary disabled:bg-gray-150 disabled:text-gray-400 !text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-primary/20 disabled:shadow-none active:scale-95 transition-all text-[11px] flex items-center justify-center gap-3"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {currentStep === 1 &&
                    (authMode === "register"
                      ? t("checkout:signup_continue")
                      : t("checkout:continue_shipping"))}
                  {currentStep === 2 &&
                    (selectedAddressId || formData.address
                      ? t("checkout:pass_secure_payment")
                      : t("checkout:enter_address"))}
                  {currentStep === 3 &&
                    (selectedGateway === "bank_transfer"
                      ? t("checkout:confirm_order")
                      : selectedGateway === "multibanco"
                        ? t("checkout:generate_reference")
                        : selectedGateway === "mbway"
                          ? t("checkout:mbway_pay_btn")
                          : txt("Valider & Payer", "Validar & Pagar") +
                            " " +
                            finalTotal.toFixed(2) +
                            "€")}
                  {!isProcessing && <ArrowRight size={16} weight="bold" />}
                </>
              )}
            </button>
          </div>
        )}
    </div>
  );
}
