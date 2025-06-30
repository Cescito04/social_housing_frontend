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
      await loginUser(email, password);
      setLoading(false);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Erreur de connexion");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-blue-200 px-2">
      <form onSubmit={handleSubmit} className="bg-white bg-opacity-95 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-5 border border-gray-100">
        <div className="flex flex-col items-center mb-2">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 mb-2">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm2 6a6 6 0 0 0-12 0"/></svg>
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 text-center tracking-tight">Connexion</h1>
        </div>
        {error && <div className="text-red-500 text-center font-medium">{error}</div>}
        <input name="email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md" required />
        <input name="password" type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow shadow-sm focus:shadow-md" required />
        <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 rounded-lg shadow hover:from-blue-600 hover:to-blue-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
        <div className="text-center text-sm text-gray-500 mt-2">
          Pas encore de compte ? <a href="/register" className="text-blue-600 hover:underline font-medium">S&apos;inscrire</a>
        </div>
      </form>
    </div>
  );
} 