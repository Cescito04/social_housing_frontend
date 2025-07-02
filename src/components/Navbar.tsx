"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "../services/auth";

export default function Navbar() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="w-full bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 shadow-lg px-4 py-2 flex items-center justify-between relative z-20">
      {/* Logo texte */}
      <div className="flex items-center gap-2 select-none">
        <span className="text-2xl font-extrabold text-white tracking-tight">SocialHousing</span>
      </div>
      {/* Desktop links */}
      <div className="hidden md:flex flex-1 justify-center gap-10">
        <Link href="/" className="text-white font-semibold text-lg px-4 py-2 rounded-lg hover:bg-blue-800 hover:text-blue-100 focus:outline-none focus:ring-2 focus:ring-white transition">Accueil</Link>
        <Link href="/profile" className="text-white font-semibold text-lg px-4 py-2 rounded-lg hover:bg-blue-800 hover:text-blue-100 focus:outline-none focus:ring-2 focus:ring-white transition">Profil</Link>
        <Link href="/contrats" className="text-white font-semibold text-lg px-4 py-2 rounded-lg hover:bg-blue-800 hover:text-blue-100 focus:outline-none focus:ring-2 focus:ring-white transition">Contrats</Link>
      </div>
      {/* Déconnexion bouton desktop */}
      <div className="hidden md:flex">
        <button
          onClick={handleLogout}
          className="bg-white text-blue-700 font-bold px-6 py-2 rounded-lg shadow hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-700 transition border border-blue-200"
        >
          Déconnexion
        </button>
      </div>
      {/* Burger menu mobile */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white focus:outline-none focus:ring-2 focus:ring-white">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 shadow-lg flex flex-col items-center py-4 gap-4 md:hidden animate-fade-in z-30">
          <Link href="/" className="text-white font-semibold text-lg px-4 py-2 rounded-lg hover:bg-blue-800 hover:text-blue-100 focus:outline-none focus:ring-2 focus:ring-white transition w-full text-center" onClick={() => setMenuOpen(false)}>Accueil</Link>
          <Link href="/profile" className="text-white font-semibold text-lg px-4 py-2 rounded-lg hover:bg-blue-800 hover:text-blue-100 focus:outline-none focus:ring-2 focus:ring-white transition w-full text-center" onClick={() => setMenuOpen(false)}>Profil</Link>
          <Link href="/contrats" className="text-white font-semibold text-lg px-4 py-2 rounded-lg hover:bg-blue-800 hover:text-blue-100 focus:outline-none focus:ring-2 focus:ring-white transition w-full text-center" onClick={() => setMenuOpen(false)}>Contrats</Link>
          <button
            onClick={() => { setMenuOpen(false); handleLogout(); }}
            className="bg-white text-blue-700 font-bold px-6 py-2 rounded-lg shadow hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-700 transition border border-blue-200 w-full"
          >
            Déconnexion
          </button>
        </div>
      )}
    </nav>
  );
} 