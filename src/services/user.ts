import { getAccessToken, getRefreshToken, logout } from "./auth";

const API_URL = "http://localhost:8000/api";

export type UserProfile = {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  telephone: string;
  cni: string;
  role: string;
};

async function fetchWithAuth<T = unknown>(url: string, options: RequestInit = {}, retry = true): Promise<T> {
  const access = getAccessToken();
  if (!access) throw new Error("Not authenticated");
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${access}`,
    "Content-Type": "application/json",
  };
  const res = await fetch(url, { ...options, headers });
  if (res.status === 401 && retry) {
    // Try to refresh token
    const refresh = getRefreshToken();
    if (!refresh) throw new Error("Session expired. Please login again.");
    const refreshRes = await fetch(`${API_URL}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!refreshRes.ok) {
      logout();
      throw new Error("Session expired. Please login again.");
    }
    const data = await refreshRes.json();
    localStorage.setItem("access_token", data.access);
    // Retry original request
    return fetchWithAuth(url, options, false);
  }
  if (!res.ok) {
    let msg = "Error";
    try {
      const err = await res.json();
      msg = err.detail || Object.values(err).join(" ");
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function getUserProfile(): Promise<UserProfile> {
  return fetchWithAuth<UserProfile>(`${API_URL}/me/`);
}

export async function updateUserProfile(data: Partial<{
  username: string;
  first_name: string;
  last_name: string;
  telephone: string;
  cni: string;
}>) {
  return fetchWithAuth(`${API_URL}/me/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
} 