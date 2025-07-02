"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { getChambres, deleteChambre, Chambre } from "../../../../services/chambre";
import ChambreCard from "../../../../components/ChambreCard";
import ProtectedRoute from "../../../../components/ProtectedRoute";

export default function ChambresListPage() {
  const router = useRouter();
  const params = useParams();
  const maisonId = Number(Array.isArray(params.id) ? params.id[0] : params.id);
  const [chambres, setChambres] = useState<Chambre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const loadChambres = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getChambres(maisonId);
      setChambres(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement des chambres");
    } finally {
      setLoading(false);
    }
  }, [maisonId]);

  useEffect(() => {
    if (!maisonId) return;
    loadChambres();
  }, [maisonId]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette chambre ?")) return;
    setDeleting(id);
    setError(null);
    try {
      await deleteChambre(id);
      setChambres(chambres.filter((c) => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/maisons/${maisonId}/chambres/${id}/modifier`);
  };

  const handleAdd = () => {
    router.push(`/maisons/${maisonId}/chambres/ajouter`);
  };

  return (
    <ProtectedRoute requiredRole="proprietaire">
      <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-blue-200 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-xl p-6 mb-8 border border-gray-100 flex justify-between items-center">
              <h1 className="text-2xl font-extrabold text-gray-900">Chambres de la maison</h1>
              <button
                onClick={handleAdd}
                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200 font-semibold flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Ajouter une chambre
              </button>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}
            <div className="grid gap-6 md:grid-cols-2">
              {loading ? (
                <div className="col-span-2 text-center py-12">Chargement...</div>
              ) : chambres.length === 0 ? (
                <div className="col-span-2 text-center py-12">Aucune chambre trouvée</div>
              ) : (
                chambres.map((chambre) => (
                  <ChambreCard
                    key={chambre.id}
                    chambre={chambre}
                    onEdit={handleEdit}
                    onDelete={deleting === chambre.id ? undefined : handleDelete}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 