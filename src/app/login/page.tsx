"use client";
import { useState } from "react";
import { loginUser } from "../../services/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await loginUser(email, password);
      setLoading(false);
      if (user && user.role === "locataire") {
        router.push("/");
      } else if (user && user.role === "proprietaire") {
        router.push("/maisons");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Erreur de connexion");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-blue-200 via-white to-blue-300 px-2">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white bg-opacity-95 rounded-3xl shadow-2xl border-2 border-blue-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 py-8 px-6 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center mb-3 border-4 border-blue-200">
            <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm2 6a6 6 0 0 0-12 0"/></svg>
          </div>
          <h1 className="text-4xl font-extrabold text-white text-center tracking-tight drop-shadow mb-1">Connexion</h1>
        </div>
        <div className="p-8 space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center animate-pulse font-semibold">{error}</div>}
          <div>
            <label className="block text-sm font-bold text-blue-700 mb-1">Email</label>
            <input name="email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border-2 border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-blue-700 mb-1">Mot de passe</label>
            <input name="password" type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border-2 border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md" required />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-3 rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed" disabled={loading}>
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                Connexion...
              </>
            ) : (
              <>Se connecter</>
            )}
          </button>
          <div className="text-center text-sm text-gray-500 mt-2">
            Pas encore de compte ? <a href="/register" className="text-blue-600 hover:underline font-medium">S&apos;inscrire</a>
          </div>
        </div>
      </form>
    </div>
  );
} 