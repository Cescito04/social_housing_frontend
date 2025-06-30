export interface RegisterPayload {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  telephone: string;
  cni: string;
  role: string;
  password: string;
  password_confirmation: string;
}

export async function registerUser(data: RegisterPayload) {
  const res = await fetch("http://localhost:8000/api/register/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    let errorMsg = "Erreur lors de l'inscription";
    try {
      const err = await res.json();
      errorMsg = err.detail || Object.values(err).join(" ");
    } catch {}
    throw new Error(errorMsg);
  }
  return res.json();
} 