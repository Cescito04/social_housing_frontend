import { getAccessToken, getRefreshToken, logout } from "./auth";

const API_URL = "http://localhost:8000/api";

export type Equipement = {
  id: number;
  nom: string;
};

export type Chambre = {
  id: number;
  maison: number;
  titre: string;
  description: string;
  taille: string;
  type: string;
  meublee: boolean;
  salle_de_bain: boolean;
  prix: number;
  disponible: boolean;
};

type ChambresApiResponse = Chambre[] | { results: Chambre[] };

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
  console.log("[fetchWithAuth] Authorization header:", headers.Authorization);
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

export async function getChambres(maisonId: number): Promise<Chambre[]> {
  const res = await fetchWithAuth<ChambresApiResponse>(`${API_URL}/chambres/?maison_id=${maisonId}`);
  if (Array.isArray(res)) return res;
  if (res && Array.isArray((res as { results?: Chambre[] }).results)) return (res as { results: Chambre[] }).results;
  return [];
}

export async function getChambre(id: number): Promise<Chambre> {
  return fetchWithAuth<Chambre>(`${API_URL}/chambres/${id}/`);
}

export async function createChambre(data: Omit<Chambre, "id">) {
  return fetchWithAuth(`${API_URL}/chambres/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateChambre(id: number, data: Partial<Omit<Chambre, "id">>) {
  return fetchWithAuth(`${API_URL}/chambres/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteChambre(id: number) {
  return fetchWithAuth(`${API_URL}/chambres/${id}/`, {
    method: "DELETE" });
} 