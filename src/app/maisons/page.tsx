"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getMaisons, deleteMaison } from "../../services/maison";
import ProtectedRoute from "../../components/ProtectedRoute";
import MapView from "../../components/MapView";

interface Maison {
  id: number;
  adresse: string;
  latitude: string;
  longitude: string;
  description: string;
}

function MaisonsContent() {
  const [maisons, setMaisons] = useState<Maison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const loadMaisons = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMaisons();
      console.log('Maisons API response:', data); // DEBUG
      setMaisons(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement des maisons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaisons();
  }, []);

  // Handle success messages from URL params
  useEffect(() => {
    const successParam = searchParams.get("success");
    if (successParam === "created") {
      setSuccess("Maison créée avec succès !");
      // Clear the URL parameter
      router.replace("/maisons", { scroll: false });
    } else if (successParam === "updated") {
      setSuccess("Maison modifiée avec succès !");
      // Clear the URL parameter
      router.replace("/maisons", { scroll: false });
    }
  }, [searchParams, router]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette maison ?")) return;
    
    setDeleting(id);
    setError(null);
    setSuccess(null);
    
    try {
      await deleteMaison(id);
      setMaisons(maisons.filter((m) => m.id !== id));
      setSuccess("Maison supprimée avec succès !");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/maisons/editer?id=${id}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-blue-200">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span className="text-gray-700">Chargement des maisons...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-blue-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white bg-opacity-95 rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                  Mes Maisons
                </h1>
                <p className="text-gray-600">
                  Gérez vos propriétés immobilières
                </p>
              </div>
              <a
                href="/maisons/ajouter"
                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200 font-semibold flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Ajouter une maison
              </a>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {success}
              </div>
            </div>
          )}

          {/* Maisons List */}
          <div className="bg-white bg-opacity-95 rounded-2xl shadow-xl p-6 border border-gray-100">
            {Array.isArray(maisons) && maisons.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucune maison trouvée
                </h3>
                <p className="text-gray-600 mb-6">
                  Commencez par ajouter votre première propriété
                </p>
                <a
                  href="/maisons/ajouter"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Ajouter ma première maison
                </a>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.isArray(maisons) && maisons.map((maison) => (
                  <div
                    key={maison.id}
                    className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {maison.adresse}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(maison.id)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                          title="Modifier"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(maison.id)}
                          disabled={deleting === maison.id}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition disabled:opacity-50"
                          title="Supprimer"
                        >
                          {deleting === maison.id ? (
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => router.push(`/maisons/${maison.id}/chambres`)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                          title="Gérer les chambres"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {/* Carte individuelle pour cette maison */}
                    <div className="mb-4">
                      <div className="h-48 rounded-lg overflow-hidden border border-gray-200">
                        <MapView 
                          latitude={maison.latitude}
                          longitude={maison.longitude}
                          adresse={maison.adresse}
                          className="h-full"
                        />
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {maison.description}
                    </p>
                    <div className="flex justify-end items-center text-sm text-gray-500">
                      <div className="flex gap-2">
                        <span>Lat: {parseFloat(maison.latitude).toFixed(4)}</span>
                        <span>Lng: {parseFloat(maison.longitude).toFixed(4)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MaisonsPage() {
  return (
    <ProtectedRoute requiredRole="proprietaire">
      <Suspense fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-blue-200">
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="text-gray-700">Chargement...</span>
          </div>
        </div>
      }>
        <MaisonsContent />
      </Suspense>
    </ProtectedRoute>
  );
} 