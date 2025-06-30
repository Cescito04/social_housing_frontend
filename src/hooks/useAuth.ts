import { useEffect, useState } from "react";
import { getUserName, isAuthenticated, logout } from "../services/auth";
import { useRouter } from "next/navigation";

export function useAuth(redirectTo: string = "/login") {
  const [user, setUser] = useState<string | null>(null);
  const [auth, setAuth] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const authStatus = isAuthenticated();
    setAuth(authStatus);
    setUser(getUserName());
    if (!authStatus) {
      router.replace(redirectTo);
    }
  }, [router, redirectTo]);

  const handleLogout = () => {
    logout();
    setAuth(false);
    setUser(null);
    router.replace("/login");
  };

  return { user, auth, logout: handleLogout };
} 