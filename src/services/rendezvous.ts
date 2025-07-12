import { getAccessToken, getRefreshToken, logout } from "./auth";

const API_URL = "http://localhost:8000/api";

export interface RendezVous {
  id: number;
  chambre: number;
  date_heure: string;
  statut: string;
  maison?: number;
  chambre_info?: any;
}

export interface RendezVousCreate {
  chambre: number;
  date_heure: string;
}

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
  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function getRendezvous(): Promise<RendezVous[]> {
  const data = await fetchWithAuth<RendezVous[] | { results: RendezVous[] }>(`${API_URL}/rendez-vous/`);
  if (Array.isArray(data)) return data;
  if (data && 'results' in data && Array.isArray(data.results)) return data.results;
  return [];
}

export async function createRendezvous(data: RendezVousCreate): Promise<RendezVous> {
  return fetchWithAuth(`${API_URL}/rendez-vous/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteRendezvous(id: number): Promise<void> {
  await fetchWithAuth(`${API_URL}/rendez-vous/${id}/`, { method: "DELETE" });
}

export async function updateRendezvous(id: number, data: Partial<RendezVousCreate & { statut: string }>): Promise<RendezVous> {
  return fetchWithAuth(`${API_URL}/rendez-vous/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
} 