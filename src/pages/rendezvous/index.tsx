import React, { useEffect, useState, PropsWithChildren } from "react";
import { getRendezvous, deleteRendezvous, RendezVous } from "@/services/rendezvous";
import RdvCard from "@/components/RdvCard";
import ProtectedRoute from "@/components/ProtectedRoute";

const RendezVousListPage: React.FC = () => {
  const [rdvs, setRdvs] = useState<RendezVous[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRdvs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRendezvous();
      setRdvs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement des rendez-vous");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRdvs(); }, []);

  const handleCancel = async (id: number) => {
    if (!window.confirm("Annuler ce rendez-vous ?")) return;
    try {
      await deleteRendezvous(id);
      setRdvs(rdvs.filter((r) => r.id !== id));
    } catch (err) {
      alert("Erreur lors de l'annulation");
    }
  };

  return (
    <ProtectedRoute requiredRole="locataire">
      <React.Fragment>
        <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-blue-200 py-8">
          <div className="container mx-auto px-4 max-w-2xl">
            <h1 className="text-3xl font-extrabold text-blue-900 mb-8 text-center">Mes rendez-vous</h1>
            {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
            {loading ? (
              <div className="text-center py-12">Chargement...</div>
            ) : rdvs.length === 0 ? (
              <div className="text-center py-12">Aucun rendez-vous trouvé</div>
            ) : (
              rdvs.map((rdv) => <RdvCard key={rdv.id} rdv={rdv} onCancel={handleCancel} />)
            )}
          </div>
        </div>
      </React.Fragment>
    </ProtectedRoute>
  );
};

export default RendezVousListPage; 