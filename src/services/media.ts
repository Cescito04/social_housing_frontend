import { getAccessToken, getRefreshToken, logout } from "./auth";

const API_URL = "http://localhost:8000/api";

export type Media = {
  id: number;
  chambre: number;
  url: string;
  type: 'photo' | 'video';
  description: string;
  cree_le: string;
};

export type CreateMediaPayload = {
  chambre: number;
  file: File;
  description: string;
};

type MediasApiResponse = Media[] | { results: Media[] };

async function fetchWithAuth<T = unknown>(url: string, options: RequestInit = {}, retry = true): Promise<T> {
  const access = getAccessToken();
  if (!access) {
    console.error("[fetchWithAuth] Aucun token d'authentification trouvé. Redirection vers /login.");
    throw new Error("Not authenticated");
  }

  // Utilise Headers natif pour éviter les soucis de merge
  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${access}`);

  // Ne pas ajouter Content-Type pour FormData, laisser le navigateur le faire
  if (!options.body || !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

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

export async function getMedias(chambreId: number): Promise<Media[]> {
  const res = await fetchWithAuth<MediasApiResponse>(`${API_URL}/medias/?chambre=${chambreId}`);
  if (Array.isArray(res)) return res;
  if (res && Array.isArray((res as { results?: Media[] }).results)) return (res as { results: Media[] }).results;
  return [];
}

export async function getMedia(id: number): Promise<Media> {
  return fetchWithAuth<Media>(`${API_URL}/medias/${id}/`);
}

export async function createMedia(data: CreateMediaPayload): Promise<Media> {
  const formData = new FormData();
  formData.append('chambre', data.chambre.toString());
  formData.append('file', data.file);
  formData.append('description', data.description);
  
  // Déterminer le type basé sur l'extension du fichier
  const fileExtension = data.file.name.split('.').pop()?.toLowerCase();
  const isVideo = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(fileExtension || '');
  formData.append('type', isVideo ? 'video' : 'photo');

  return fetchWithAuth<Media>(`${API_URL}/medias/`, {
    method: "POST",
    body: formData,
  });
}

export async function updateMedia(id: number, data: Partial<Omit<Media, "id" | "cree_le">>): Promise<Media> {
  return fetchWithAuth<Media>(`${API_URL}/medias/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteMedia(id: number): Promise<void> {
  return fetchWithAuth(`${API_URL}/medias/${id}/`, {
    method: "DELETE",
  });
}

// Fonction utilitaire pour valider les fichiers
export function validateFile(file: File): { isValid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm'];
  
  if (file.size > maxSize) {
    return { isValid: false, error: "Le fichier est trop volumineux (max 10MB)" };
  }
  
  if (![...allowedImageTypes, ...allowedVideoTypes].includes(file.type)) {
    return { isValid: false, error: "Type de fichier non supporté" };
  }
  
  return { isValid: true };
} 