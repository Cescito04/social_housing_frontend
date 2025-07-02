'use client';
import React, { useEffect, useState } from 'react';
import { getContrats, deleteContrat, Contrat } from '../../services/contrat';
import ContratCard from '../../components/ContratCard';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useRouter } from 'next/navigation';

export default function ContratsPage() {
  const [contrats, setContrats] = useState<Contrat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadContrats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getContrats();
      setContrats(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement des contrats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContrats();
  }, []);

  const handleCancel = async (id: number) => {
    if (!window.confirm('Annuler ce contrat ?')) return;
    try {
      await deleteContrat(id);
      setContrats(contrats.filter(c => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'annulation');
    }
  };

  return (
    <ProtectedRoute requiredRole="locataire">
      <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-blue-200 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Mes contrats de location</h1>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}
          {loading ? (
            <div className="text-center py-12">Chargement...</div>
          ) : contrats.length === 0 ? (
            <div className="text-center py-12">Aucun contrat trouvé</div>
          ) : (
            contrats.map(contrat => (
              <ContratCard key={contrat.id} contrat={contrat} onCancel={handleCancel} />
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 