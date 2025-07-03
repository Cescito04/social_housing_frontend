import { getAccessToken, getRefreshToken, logout } from "./auth";
const API_URL = "http://localhost:8000/api";

async function fetchWithAuth<T = unknown>(url: string, options: RequestInit = {}, retry = true): Promise<T> {
  const access = getAccessToken();
  if (!access) {
    console.error("[fetchWithAuth] Aucun token d'authentification trouvé. Redirection vers /login.");
    throw new Error("Not authenticated");
  }
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
    return undefined as T;
  }
  return res.json();
}

export interface Contrat {
  id: number;
  chambre: number;
  maison: number;
  date_debut: string;
  date_fin: string;
  loyer?: number;
  montant_caution: number;
  mode_paiement: string;
  statut: string;
  locataire_info?: {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
    username?: string;
  };
}

export interface ContratCreate {
  chambre: number;
  date_debut: string;
  date_fin: string;
  mode_paiement: string;
  periodicite: string;
  montant_caution: number;
}

export async function getContrats(): Promise<Contrat[]> {
  const data = await fetchWithAuth(`${API_URL}/contrats/`);
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}

export async function createContrat(data: ContratCreate): Promise<Contrat> {
  return fetchWithAuth(`${API_URL}/contrats/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteContrat(id: number): Promise<void> {
  await fetchWithAuth(`${API_URL}/contrats/${id}/`, { method: "DELETE" });
}

export async function updateContrat(id: number, data: Partial<ContratCreate>): Promise<Contrat> {
  return fetchWithAuth(`${API_URL}/contrats/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
} 