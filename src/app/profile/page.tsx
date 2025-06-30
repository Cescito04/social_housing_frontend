"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserProfile, updateUserProfile } from "../../services/user";
import { isAuthenticated } from "../../services/auth";

interface UserProfile {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  telephone: string;
  cni: string;
  role: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<Partial<UserProfile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    setLoading(true);
    getUserProfile()
      .then((data) => {
        setProfile(data);
        setForm({
          username: data.username,
          first_name: data.first_name,
          last_name: data.last_name,
          telephone: data.telephone,
          cni: data.cni,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Erreur de chargement du profil");
        setLoading(false);
      });
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateUserProfile(form);
      setProfile({ ...profile!, ...form });
      setSuccess("Profil mis à jour avec succès !");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-blue-200">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
          <span className="text-gray-700">Chargement du profil...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-blue-200 px-2">
      <form onSubmit={handleSubmit} className="bg-white bg-opacity-95 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-5 border border-gray-100">
        <div className="flex flex-col items-center mb-2">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 mb-2">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm2 6a6 6 0 0 0-12 0"/></svg>
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 text-center tracking-tight">Mon profil</h1>
        </div>
        {error && <div className="text-red-500 text-center font-medium">{error}</div>}
        {success && <div className="text-green-600 text-center font-medium">{success}</div>}
        <input name="email" value={profile?.email || ""} disabled className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500" />
        <input name="username" value={form.username || ""} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md" placeholder="Nom d'utilisateur" />
        <input name="first_name" value={form.first_name || ""} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md" placeholder="Prénom" />
        <input name="last_name" value={form.last_name || ""} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md" placeholder="Nom" />
        <input name="telephone" value={form.telephone || ""} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md" placeholder="Téléphone" />
        <input name="cni" value={form.cni || ""} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md" placeholder="CNI" />
        <input name="role" value={profile?.role || ""} disabled className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500" />
        <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 rounded-lg shadow hover:from-blue-600 hover:to-blue-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400" disabled={saving}>
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </div>
  );
} 