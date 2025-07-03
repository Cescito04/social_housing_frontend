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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-blue-200 via-white to-blue-300 px-2">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white bg-opacity-95 rounded-3xl shadow-2xl border-2 border-blue-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 py-8 px-6 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center mb-3 border-4 border-blue-200">
            <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 7.5v-2A2.5 2.5 0 0 0 14 3h-4A2.5 2.5 0 0 0 7.5 5.5v2m9 0v2A2.5 2.5 0 0 1 14 12h-4a2.5 2.5 0 0 1-2.5-2.5v-2m9 0h-9m9 0V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7.5"/></svg>
          </div>
          <h1 className="text-4xl font-extrabold text-white text-center tracking-tight drop-shadow mb-1">Inscription</h1>
        </div>
        <div className="p-8 space-y-6">
          {typeof errors === "string" && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center animate-pulse font-semibold">{errors}</div>}
          {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center animate-fade-in font-semibold">{success}</div>}
          <div>
            <label className="block text-sm font-bold text-blue-700 mb-1">Email</label>
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full px-4 py-2 border-2 border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md" />
            {errors && typeof errors !== "string" && errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
          </div>
          <div>
            <label className="block text-sm font-bold text-blue-700 mb-1">Nom d'utilisateur</label>
            <input name="username" placeholder="Nom d'utilisateur" value={form.username} onChange={handleChange} className="w-full px-4 py-2 border-2 border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md" />
            {errors && typeof errors !== "string" && errors.username && <div className="text-red-500 text-sm mt-1">{errors.username}</div>}
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-bold text-blue-700 mb-1">Prénom</label>
              <input name="first_name" placeholder="Prénom" value={form.first_name} onChange={handleChange} className="w-full px-4 py-2 border-2 border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md" />
              {errors && typeof errors !== "string" && errors.first_name && <div className="text-red-500 text-sm mt-1">{errors.first_name}</div>}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-blue-700 mb-1">Nom</label>
              <input name="last_name" placeholder="Nom" value={form.last_name} onChange={handleChange} className="w-full px-4 py-2 border-2 border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md" />
              {errors && typeof errors !== "string" && errors.last_name && <div className="text-red-500 text-sm mt-1">{errors.last_name}</div>}
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-bold text-blue-700 mb-1">Téléphone</label>
              <input name="telephone" placeholder="Téléphone" value={form.telephone} onChange={handleChange} className="w-full px-4 py-2 border-2 border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md" />
              {errors && typeof errors !== "string" && errors.telephone && <div className="text-red-500 text-sm mt-1">{errors.telephone}</div>}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-blue-700 mb-1">CNI</label>
              <input name="cni" placeholder="CNI" value={form.cni} onChange={handleChange} className="w-full px-4 py-2 border-2 border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md" />
              {errors && typeof errors !== "string" && errors.cni && <div className="text-red-500 text-sm mt-1">{errors.cni}</div>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-blue-700 mb-1">Rôle</label>
            <select name="role" value={form.role} onChange={handleChange} className="w-full px-4 py-2 border-2 border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md">
              <option value="">Sélectionnez un rôle</option>
              <option value="locataire">Locataire</option>
              <option value="proprietaire">Propriétaire</option>
            </select>
            {errors && typeof errors !== "string" && errors.role && <div className="text-red-500 text-sm mt-1">{errors.role}</div>}
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-bold text-blue-700 mb-1">Mot de passe</label>
              <input name="password" type="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} className="w-full px-4 py-2 border-2 border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md" />
              {errors && typeof errors !== "string" && errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-blue-700 mb-1">Confirmer le mot de passe</label>
              <input name="password_confirmation" type="password" placeholder="Confirmer le mot de passe" value={form.password_confirmation} onChange={handleChange} className="w-full px-4 py-2 border-2 border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md" />
              {errors && typeof errors !== "string" && errors.password_confirmation && <div className="text-red-500 text-sm mt-1">{errors.password_confirmation}</div>}
            </div>
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-3 rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed" disabled={loading}>
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                Inscription...
              </>
            ) : (
              <>S'inscrire</>
            )}
          </button>
          <div className="text-center text-sm text-gray-500 mt-2">
            Déjà inscrit ? <a href="/login" className="text-blue-600 hover:underline font-medium">Se connecter</a>
          </div>
        </div>
      </form>
    </div>
  );
} 