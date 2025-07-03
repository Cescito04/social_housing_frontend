"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserProfile, updateUserProfile } from "../../../services/user";
import { isAuthenticated } from "../../../services/auth";

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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-blue-200 via-white to-blue-300 px-2">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white bg-opacity-95 rounded-3xl shadow-2xl border-2 border-blue-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 py-8 px-6 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center mb-3 border-4 border-blue-200">
            <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm2 6a6 6 0 0 0-12 0"/></svg>
          </div>
          <h1 className="text-4xl font-extrabold text-white text-center tracking-tight drop-shadow mb-1">Mon profil</h1>
          <div className="text-blue-100 text-lg font-medium">{profile?.role === 'proprietaire' ? 'Propriétaire' : 'Locataire'}</div>
        </div>
        <div className="p-8 space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center animate-pulse font-semibold">{error}</div>}
          {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center animate-fade-in font-semibold">{success}</div>}
          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className="block text-sm font-bold text-blue-700 mb-1">Email</label>
              <input name="email" value={profile?.email || ""} disabled className="w-full px-4 py-2 border-2 border-blue-100 rounded-lg bg-gray-100 text-gray-500 font-semibold" />
            </div>
            <div>
              <label className="block text-sm font-bold text-blue-700 mb-1">Nom d'utilisateur</label>
              <input name="username" value={form.username || ""} onChange={handleChange} className="w-full px-4 py-2 border-2 border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md" placeholder="Nom d'utilisateur" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-blue-700 mb-1">Prénom</label>
                <input name="first_name" value={form.first_name || ""} onChange={handleChange} className="w-full px-4 py-2 border-2 border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md" placeholder="Prénom" />
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-700 mb-1">Nom</label>
                <input name="last_name" value={form.last_name || ""} onChange={handleChange} className="w-full px-4 py-2 border-2 border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md" placeholder="Nom" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-blue-700 mb-1">Téléphone</label>
                <input name="telephone" value={form.telephone || ""} onChange={handleChange} className="w-full px-4 py-2 border-2 border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md" placeholder="Téléphone" />
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-700 mb-1">CNI</label>
                <input name="cni" value={form.cni || ""} onChange={handleChange} className="w-full px-4 py-2 border-2 border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md" placeholder="CNI" />
              </div>
            </div>
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-3 rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed" disabled={saving}>
            {saving ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                Enregistrement...
              </>
            ) : (
              <>Enregistrer</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 