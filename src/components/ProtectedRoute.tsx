"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getAccessToken } from "../services/auth";

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "proprietaire" | "locataire";
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    const token = getAccessToken();
    const payload = token ? parseJwt(token) : null;
    setRole(payload?.role || null);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated()) return;
    if (requiredRole && role) {
      if (role !== requiredRole) {
        alert(`Accès refusé : vous devez être ${requiredRole} pour accéder à cette page.`);
        router.replace("/dashboard");
        return;
      }
    }
    setIsAuthorized(true);
  }, [router, requiredRole, role, loading]);

  if (isAuthorized === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-blue-200">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span className="text-gray-700">Vérification des permissions...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 