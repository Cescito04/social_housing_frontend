// Utilitaire fetch local pour les appels API contrats
const API_URL = "http://localhost:8000/api";
import { getAccessToken } from "./auth";

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const access = getAccessToken();
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${access}`,
    "Content-Type": "application/json",
  };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export interface Contrat {
  id: number;
  chambre: number;
  maison: number;
  date_debut: string;
  date_fin: string;
  loyer: number;
  caution: number;
  mode_paiement: string;
  statut: string;
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