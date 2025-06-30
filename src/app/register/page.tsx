"use client";
import { useState } from "react";
import { registerUser } from "../../services/api";

interface RegisterForm {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  telephone: string;
  cni: string;
  role: string;
  password: string;
  password_confirmation: string;
}

const initialForm: RegisterForm = {
  email: "",
  username: "",
  first_name: "",
  last_name: "",
  telephone: "",
  cni: "",
  role: "",
  password: "",
  password_confirmation: "",
};

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [errors, setErrors] = useState<Partial<RegisterForm> | string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = (data: RegisterForm) => {
    const newErrors: Partial<RegisterForm> = {};
    if (!data.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) newErrors.email = "Email invalide";
    if (!data.username) newErrors.username = "Nom d'utilisateur requis";
    if (!data.first_name) newErrors.first_name = "Prénom requis";
    if (!data.last_name) newErrors.last_name = "Nom requis";
    if (!data.telephone.match(/^\d{8,15}$/)) newErrors.telephone = "Téléphone invalide";
    if (!data.cni) newErrors.cni = "CNI requis";
    if (!data.role) newErrors.role = "Rôle requis";
    if (data.password.length < 6) newErrors.password = "Mot de passe trop court";
    if (data.password !== data.password_confirmation) newErrors.password_confirmation = "Les mots de passe ne correspondent pas";
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);
    setSuccess(null);
    const validation = validate(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setLoading(true);
    try {
      const res = await registerUser(form);
      setSuccess("Inscription réussie ! Vous pouvez vous connecter.");
      setForm(initialForm);
      if (res.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem("jwt", res.token);
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        setErrors(err.message || "Erreur lors de l'inscription");
      } else {
        setErrors("Erreur lors de l'inscription");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-blue-200 px-2">
      <form onSubmit={handleSubmit} className="bg-white bg-opacity-95 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-5 border border-gray-100">
        <div className="flex flex-col items-center mb-2">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 mb-2">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 7.5v-2A2.5 2.5 0 0 0 14 3h-4A2.5 2.5 0 0 0 7.5 5.5v2m9 0v2A2.5 2.5 0 0 1 14 12h-4a2.5 2.5 0 0 1-2.5-2.5v-2m9 0h-9m9 0V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7.5"/></svg>
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 text-center tracking-tight">Inscription</h1>
        </div>
        {typeof errors === "string" && <div className="text-red-500 text-center font-medium">{errors}</div>}
        {success && <div className="text-green-600 text-center font-medium">{success}</div>}
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md" />
        {errors && typeof errors !== "string" && errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
        <input name="username" placeholder="Nom d'utilisateur" value={form.username} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md" />
        {errors && typeof errors !== "string" && errors.username && <div className="text-red-500 text-sm">{errors.username}</div>}
        <input name="first_name" placeholder="Prénom" value={form.first_name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md" />
        {errors && typeof errors !== "string" && errors.first_name && <div className="text-red-500 text-sm">{errors.first_name}</div>}
        <input name="last_name" placeholder="Nom" value={form.last_name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md" />
        {errors && typeof errors !== "string" && errors.last_name && <div className="text-red-500 text-sm">{errors.last_name}</div>}
        <input name="telephone" placeholder="Téléphone" value={form.telephone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md" />
        {errors && typeof errors !== "string" && errors.telephone && <div className="text-red-500 text-sm">{errors.telephone}</div>}
        <input name="cni" placeholder="CNI" value={form.cni} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md" />
        {errors && typeof errors !== "string" && errors.cni && <div className="text-red-500 text-sm">{errors.cni}</div>}
        <select name="role" value={form.role} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md">
          <option value="">Sélectionnez un rôle</option>
          <option value="locataire">Locataire</option>
          <option value="proprietaire">Propriétaire</option>
        </select>
        {errors && typeof errors !== "string" && errors.role && <div className="text-red-500 text-sm">{errors.role}</div>}
        <input name="password" type="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md" />
        {errors && typeof errors !== "string" && errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
        <input name="password_confirmation" type="password" placeholder="Confirmer le mot de passe" value={form.password_confirmation} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md" />
        {errors && typeof errors !== "string" && errors.password_confirmation && <div className="text-red-500 text-sm">{errors.password_confirmation}</div>}
        <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 rounded-lg shadow hover:from-blue-600 hover:to-blue-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400" disabled={loading}>
          {loading ? "Inscription..." : "S'inscrire"}
        </button>
        <div className="text-center text-sm text-gray-500 mt-2">
          Déjà inscrit ? <a href="/login" className="text-blue-600 hover:underline font-medium">Se connecter</a>
        </div>
      </form>
    </div>
  );
} 