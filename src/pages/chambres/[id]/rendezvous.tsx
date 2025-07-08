import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createRendezvous } from "@/services/rendezvous";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function PrendreRendezVousPage() {
  const router = useRouter();
  const params = useParams();
  const chambreId = params && params.id ? Number(Array.isArray(params.id) ? params.id[0] : params.id) : undefined;
  if (!chambreId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-blue-200">
        <div className="bg-white rounded-lg shadow p-8 max-w-md w-full border text-center text-red-600 font-bold">
          Identifiant de chambre invalide ou manquant.
        </div>
      </div>
    );
  }
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!date || !time) {
      setError("Veuillez sélectionner une date et une heure.");
      return;
    }
    const dateTime = new Date(`${date}T${time}`);
    if (dateTime < new Date()) {
      setError("La date/heure doit être dans le futur.");
      return;
    }
    setLoading(true);
    try {
      await createRendezvous({ chambre: chambreId, date_heure: dateTime.toISOString() });
      setSuccess(true);
      setTimeout(() => router.push("/rendezvous"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la prise de rendez-vous.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="locataire">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-blue-200 px-2">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 max-w-md w-full border flex flex-col gap-6">
          <h1 className="text-xl font-extrabold text-blue-800 mb-2 text-center">Prendre rendez-vous</h1>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block mb-2 font-semibold text-blue-800">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full border border-gray-200 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition" required />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-blue-800">Heure</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full border border-gray-200 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition" required />
            </div>
          </div>
          {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-center">{error}</div>}
          {success && <div className="bg-green-100 text-green-700 px-4 py-2 rounded text-center">Demande envoyée !</div>}
          <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded-lg font-bold hover:bg-blue-800 transition" disabled={loading}>
            {loading ? "Envoi..." : "Demander une visite"}
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
} 