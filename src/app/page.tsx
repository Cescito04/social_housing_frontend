"use client";
import React, { useEffect, useState } from "react";
import { getMaisons, Maison } from "../services/maison";
import { getChambres, Chambre } from "../services/chambre";
import ChambreCard from "../components/ChambreCard";
import ProtectedRoute from "../components/ProtectedRoute";

interface MaisonWithChambres extends Maison {
  chambres: Chambre[];
}

export default function HomePage() {
  const [maisons, setMaisons] = useState<MaisonWithChambres[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaisonsEtChambres = async () => {
      setLoading(true);
      setError(null);
      try {
        const maisonsData = await getMaisons();
        const maisonsWithChambres: MaisonWithChambres[] = await Promise.all(
          maisonsData.map(async (maison) => {
            const chambres = await getChambres(maison.id);
            // On ne garde que les chambres disponibles
            return { ...maison, chambres: chambres.filter(c => c.disponible) };
          })
        );
        setMaisons(maisonsWithChambres.filter(m => m.chambres.length > 0));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement des maisons et chambres");
      } finally {
        setLoading(false);
      }
    };
    fetchMaisonsEtChambres();
  }, []);

  return (
    <ProtectedRoute requiredRole="locataire">
      <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-blue-200 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Maisons & Chambres disponibles</h1>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}
          {loading ? (
            <div className="text-center py-12 text-lg">Chargement...</div>
          ) : maisons.length === 0 ? (
            <div className="text-center py-12 text-gray-600">Aucune chambre disponible actuellement</div>
          ) : (
            <div className="space-y-10">
              {maisons.map((maison) => (
                <div key={maison.id} className="bg-white bg-opacity-95 rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                    <div>
                      <h2 className="text-2xl font-bold text-blue-700 mb-1">{maison.adresse}</h2>
                      <p className="text-gray-600 text-sm mb-1">{maison.description}</p>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>Lat: {parseFloat(maison.latitude).toFixed(4)}</span>
                        <span>Lng: {parseFloat(maison.longitude).toFixed(4)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {maison.chambres.map((chambre) => (
                      <ChambreCard
                        key={chambre.id}
                        chambre={chambre}
                        onEdit={undefined}
                        onDelete={undefined}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
