import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  EnvelopeSimple,
  Lock,
  User,
  Key,
  ArrowRight,
  Check,
  PaperPlaneTilt,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  Package,
  Eye,
  EyeSlash,
} from "@phosphor-icons/react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, setDocument } from "@imexmercado/firebase";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function LoginPage() {
  const { t } = useTranslation(["auth"]);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/compte");
    } catch (err: any) {
      setError(
        err.message === "Firebase: Error (auth/invalid-credential)."
          ? t("auth:login.error_credentials")
          : t("auth:login.error_general"),
      );
    } finally {
      setLoading(false);
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="bg-bg min-h-screen py-10 md:py-20 px-0 md:px-4">
      <section className="container mx-auto px-4">
        <motion.div
          {...fadeIn}
          className="bg-white rounded-3xl border-2 border-gray-200 shadow-xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column: Why Join Us */}
            <div className="bg-gray-50/50 p-6 md:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-gray-100 relative">
              <div className="absolute top-0 left-0 w-40 h-40 bg-primary/10 rounded-br-full -ml-4 -mt-4 pointer-events-none opacity-50" />

              <div className="inline-block bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg mb-8 w-fit relative z-10">
                {t("auth:login.badge")}
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-8 relative z-10">
                {t("auth:login.title_main")} <br /> sur vos{" "}
                <span className="text-primary italic-none">
                  {t("auth:login.title_accent")}
                </span>
              </h1>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-10 max-w-md relative z-10">
                {t("auth:login.description")}
              </p>

              <ul className="space-y-6 relative z-10 border-t border-gray-100 pt-8">
                {[
                  {
                    title: t("auth:login.benefit1_title"),
                    desc: t("auth:login.benefit1_desc"),
                  },
                  {
                    title: t("auth:login.benefit2_title"),
                    desc: t("auth:login.benefit2_desc"),
                  },
                  {
                    title: t("auth:login.benefit3_title"),
                    desc: t("auth:login.benefit3_desc"),
                  },
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="bg-white border border-gray-100 text-primary w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                      <Check size={16} weight="bold" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm uppercase text-gray-900">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column: Login Form */}
            <div className="p-6 md:p-16 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                <div className="mb-10 text-center lg:text-left">
                  <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900">
                    {t("auth:login.title")}
                  </h2>
                  <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest font-bold">
                    {t("auth:login.subtitle")}
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                  {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold uppercase tracking-tight border border-red-100">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                        {t("auth:login.email_label")}
                      </label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                          <EnvelopeSimple size={20} weight="bold" />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t("auth:login.email_placeholder")}
                          required
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 pl-12 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center pr-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                          {t("auth:login.password_label")}
                        </label>
                        <Link
                          to="/mot-de-passe-oublie"
                          className="text-[10px] font-black uppercase text-primary hover:text-gray-900 transition-colors"
                        >
                          {t("auth:login.forgot_link")}
                        </Link>
                      </div>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                          <Lock size={20} weight="bold" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={t("auth:login.password_placeholder")}
                          required
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 pl-12 pr-12 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors focus:outline-none"
                        >
                          {showPassword ? (
                            <EyeSlash size={18} weight="bold" />
                          ) : (
                            <Eye size={18} weight="bold" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-900 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg hover:bg-primary transition-all flex items-center justify-center gap-3 active:scale-[0.98] group mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>
                      {loading
                        ? t("auth:login.btn_submit_loading")
                        : t("auth:login.btn_submit")}
                    </span>
                    {!loading && (
                      <ArrowRight
                        size={18}
                        weight="bold"
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    )}
                  </button>

                  <div className="text-center pt-8">
                    <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">
                      {t("auth:login.new_member")}{" "}
                      <Link
                        to="/inscription"
                        className="text-primary hover:text-gray-900 border-b border-primary/30 hover:border-gray-900 transition-colors pb-0.5"
                      >
                        {t("auth:login.create_account")}
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

export function RegisterPage() {
  const { t } = useTranslation(["auth"]);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [zipCode, setZipCode] = React.useState("");
  const [city, setCity] = React.useState("");
  const [country, setCountry] = React.useState("France");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(t("auth:register.error_password_match"));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Update Auth Profile
      await updateProfile(user, { displayName: `${firstName} ${lastName}` });

      // Save extra info to Firestore
      await setDocument("users", user.uid, {
        firstName,
        lastName,
        email,
        phone,
        addresses: [
          {
            id: "initial-addr",
            firstName,
            lastName,
            address,
            city,
            zipCode,
            country,
            phone,
            isDefault: true,
          },
        ],
        createdAt: new Date().toISOString(),
      });

      navigate("/compte");
    } catch (err: any) {
      setError(
        err.message.includes("email-already-in-use")
          ? t("auth:register.error_email_use")
          : t("auth:register.error_general"),
      );
    } finally {
      setLoading(false);
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="bg-bg min-h-screen py-10 md:py-20 px-0 md:px-4">
      <section className="container mx-auto px-4">
        <motion.div
          {...fadeIn}
          className="bg-white rounded-3xl border-2 border-gray-200 shadow-xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column: Register Form */}
            <div className="p-6 md:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-gray-100">
              <div className="max-w-md mx-auto w-full">
                <div className="mb-10 text-center lg:text-left">
                  <h1 className="text-3xl font-black uppercase tracking-tight text-gray-900 leading-none mb-2">
                    {t("auth:register.title")}
                  </h1>
                  <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">
                    {t("auth:register.subtitle")}
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleRegister}>
                  {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold uppercase tracking-tight border border-red-100 animate-shake">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                          {t("auth:register.firstname_label")}
                        </label>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                            <User size={18} weight="bold" />
                          </div>
                          <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 pl-12 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                          {t("auth:register.lastname_label")}
                        </label>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                            <User size={18} weight="bold" />
                          </div>
                          <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 pl-12 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                        {t("auth:register.email_label")}
                      </label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                          <EnvelopeSimple size={18} weight="bold" />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 pl-12 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                        {t("auth:register.phone_label")}
                      </label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                          <Phone size={18} weight="bold" />
                        </div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 pl-12 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                        {t("auth:register.address_label")}
                      </label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                          <MapPin size={18} weight="bold" />
                        </div>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          required
                          placeholder={t("auth:register.address_placeholder")}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 pl-12 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                          {t("auth:register.zipcode_label")}
                        </label>
                        <input
                          type="text"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          required
                          placeholder="75001"
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                          {t("auth:register.city_label")}
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required
                          placeholder="Paris"
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                        {t("auth:register.country_label")}
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm appearance-none"
                      >
                        <option value="France">
                          {t("auth:register.country_opt_fr")}
                        </option>
                        <option value="Suisse">
                          {t("auth:register.country_opt_ch")}
                        </option>
                        <option value="Portugal">
                          {t("auth:register.country_opt_pt")}
                        </option>
                        <option value="Belgique">
                          {t("auth:register.country_opt_be")}
                        </option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                          {t("auth:register.password_label")}
                        </label>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                            <Lock size={18} weight="bold" />
                          </div>
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 pl-12 pr-12 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors focus:outline-none"
                          >
                            {showPassword ? (
                              <EyeSlash size={16} weight="bold" />
                            ) : (
                              <Eye size={16} weight="bold" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                          {t("auth:register.confirm_password_label")}
                        </label>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                            <Lock size={18} weight="bold" />
                          </div>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 pl-12 pr-12 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors focus:outline-none"
                          >
                            {showConfirmPassword ? (
                              <EyeSlash size={16} weight="bold" />
                            ) : (
                              <Eye size={16} weight="bold" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-1 py-1">
                    <label className="flex items-start gap-4 cursor-pointer group">
                      <input
                        type="checkbox"
                        required
                        className="mt-1 w-5 h-5 rounded-lg text-primary border-gray-200 focus:ring-primary transition-all"
                      />
                      <span className="text-[11px] text-gray-500 leading-tight group-hover:text-gray-900 transition-colors uppercase tracking-tight font-bold">
                        {t("auth:register.terms_agree")}
                        <Link
                          to="/cgv"
                          className="text-primary hover:underline underline-offset-4"
                        >
                          {t("auth:register.terms_link")}
                        </Link>
                        {t("auth:register.privacy_and")}
                        <Link
                          to="/confidentialite"
                          className="text-primary hover:underline underline-offset-4"
                        >
                          {t("auth:register.privacy_link")}
                        </Link>
                        .
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-900 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg hover:bg-primary transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <span>
                      {loading
                        ? t("auth:register.btn_submit_loading")
                        : t("auth:register.btn_submit")}
                    </span>
                    {!loading && (
                      <PaperPlaneTilt
                        size={18}
                        weight="bold"
                        className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                      />
                    )}
                  </button>

                  <div className="text-center pt-6 border-t border-gray-50">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      {t("auth:register.already_member")}{" "}
                      <Link
                        to="/connexion"
                        className="text-primary hover:text-gray-900 border-b border-primary/30 hover:border-gray-900 transition-colors pb-0.5"
                      >
                        {t("auth:register.login_link")}
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column: Visual & Trust */}
            <div className="bg-gray-50/50 p-6 md:p-16 flex flex-col justify-center items-center text-center">
              <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 max-w-sm w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <ShieldCheck
                    size={48}
                    className="text-primary mb-6"
                    weight="duotone"
                  />
                  <h3 className="font-black text-gray-900 uppercase tracking-tighter text-lg mb-4">
                    {t("auth:register.trust_title")}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">
                    {t("auth:register.trust_desc")}
                  </p>

                  <div className="w-full space-y-4 text-left border-t border-gray-100 pt-8">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                        <Truck size={16} weight="bold" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider text-gray-900">
                        {t("auth:register.trust_shipping")}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-green-50 text-green-600 p-2 rounded-lg">
                        <Package size={16} weight="bold" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider text-gray-900">
                        {t("auth:register.trust_guarantee")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

export function ForgotPasswordPage() {
  const { t } = useTranslation(["auth"]);
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err: any) {
      setError(t("auth:forgot.error_message"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white p-6 md:p-10 rounded-3xl border-2 border-gray-200 shadow-xl overflow-hidden text-center relative pointer-events-auto">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-16 -mt-16 pointer-events-none opacity-50" />

          <div className="bg-gray-50 border border-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center text-gray-900 mx-auto mb-8 relative z-10">
            <Key size={28} weight="duotone" />
          </div>

          <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900 mb-4 relative z-10">
            {t("auth:forgot.title")}
          </h1>
          <p className="text-gray-500 text-sm mb-10 leading-relaxed font-medium relative z-10">
            {t("auth:forgot.description")}
          </p>

          <form
            className="space-y-6 text-left relative z-10"
            onSubmit={handleReset}
          >
            {success && (
              <div className="bg-success text-white p-4 rounded-xl text-xs font-bold uppercase tracking-tight shadow-md">
                {t("auth:forgot.success_message")}
              </div>
            )}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold uppercase tracking-tight border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                {t("auth:forgot.recovery_label")}
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                  <EnvelopeSimple size={18} weight="bold" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 pl-12 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg hover:bg-primary transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading
                ? t("auth:forgot.btn_submit_loading")
                : t("auth:forgot.btn_submit")}
            </button>
          </form>

          <Link
            to="/connexion"
            className="inline-block mt-8 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors relative z-10 border-b border-transparent hover:border-gray-900 pb-0.5"
          >
            {t("auth:forgot.back_login")}
          </Link>
        </div>
      </div>
    </div>
  );
}
