// Utility function to safely access localStorage (only on client side)
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
};

export async function loginUser(email: string, password: string) {
  const res = await fetch("http://localhost:8000/api/token/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    let errorMsg = "Identifiants invalides";
    try {
      const err = await res.json();
      errorMsg = err.detail || Object.values(err).join(" ");
    } catch {}
    throw new Error(errorMsg);
  }
  const data = await res.json();
  safeLocalStorage.setItem("access_token", data.access);
  safeLocalStorage.setItem("refresh_token", data.refresh);
  // Décoder le token pour récupérer le nom (si présent)
  let user = null;
  try {
    const payload = JSON.parse(atob(data.access.split(".")[1]));
    user = payload;
    // Si le rôle n'est pas dans le JWT, on le prend dans la réponse backend
    if ((!user.role || user.role === undefined) && data.user && data.user.role) {
      user.role = data.user.role;
    }
    if (user && user.username) safeLocalStorage.setItem("username", user.username);
    if (user && user.first_name) safeLocalStorage.setItem("first_name", user.first_name);
  } catch {}
  return user;
}

export function getAccessToken() {
  return safeLocalStorage.getItem("access_token");
}

export function getRefreshToken() {
  return safeLocalStorage.getItem("refresh_token");
}

export function getUserName() {
  return safeLocalStorage.getItem("first_name") || safeLocalStorage.getItem("username") || "";
}

export function isAuthenticated() {
  return !!getAccessToken();
}

export function logout() {
  safeLocalStorage.removeItem("access_token");
  safeLocalStorage.removeItem("refresh_token");
  safeLocalStorage.removeItem("username");
  safeLocalStorage.removeItem("first_name");
} 