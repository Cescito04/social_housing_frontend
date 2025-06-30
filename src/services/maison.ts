import { getAccessToken, getRefreshToken, logout } from "./auth";

const API_URL = "http://localhost:8000/api";

export type Maison = {
  id: number;
  adresse: string;
  latitude: string;
  longitude: string;
  description: string;
};

type MaisonsApiResponse = Maison[] | { results: Maison[] };

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
  if (res.status === 204) {
    return undefined as T; // Pas de contenu à parser
  }
  return res.json();
}

export async function getMaisons(): Promise<Maison[]> {
  const res = await fetchWithAuth<MaisonsApiResponse>(`${API_URL}/maisons/`);
  if (Array.isArray(res)) return res;
  if (res && Array.isArray((res as { results?: Maison[] }).results)) return (res as { results: Maison[] }).results;
  return [];
}

export async function getMaison(id: number): Promise<Maison> {
  return fetchWithAuth<Maison>(`${API_URL}/maisons/${id}/`);
}

export async function createMaison(data: {
  adresse: string;
  latitude: string;
  longitude: string;
  description: string;
}) {
  return fetchWithAuth(`${API_URL}/maisons/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteMaison(id: number) {
  return fetchWithAuth(`${API_URL}/maisons/${id}/`, {
    method: "DELETE" });
}

export async function updateMaison(id: number, data: Partial<{
  adresse: string;
  latitude: string;
  longitude: string;
  description: string;
}>) {
  return fetchWithAuth(`${API_URL}/maisons/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
} 