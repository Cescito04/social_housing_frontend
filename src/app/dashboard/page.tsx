"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserName, isAuthenticated, getAccessToken } from "../../services/auth";

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user name safely on client side
    setName(getUserName());
    
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    const token = getAccessToken();
    const payload = token ? parseJwt(token) : null;
    console.log("JWT payload:", payload); // DEBUG
    setRole(payload?.role || null);

    if (payload?.role === "proprietaire") {
      router.replace("/maisons");
      return;
    }
    setLoading(false);
  }, [router]);

  // Affiche un écran de chargement tant que la vérification/redirection est en cours
  if (loading || role === "proprietaire") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-blue-200">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span className="text-gray-700">Redirection...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-blue-200">
      <div className="bg-white bg-opacity-95 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-5 border border-gray-100 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Bienvenue {name ? name : "!"}
        </h1>
        <p className="text-gray-700">
          Vous êtes connecté à votre espace sécurisé.
        </p>
        {role === "locataire" && (
          <a
            href="/profile"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Voir mon profil
          </a>
        )}
      </div>
    </div>
  );
} 