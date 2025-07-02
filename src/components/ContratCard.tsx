import React from 'react';
import { Contrat } from '../services/contrat';

interface ContratCardProps {
  contrat: Contrat;
  onCancel?: (id: number) => void;
}

const statusColors: Record<string, string> = {
  'en_cours': 'bg-yellow-100 text-yellow-800',
  'signe': 'bg-green-100 text-green-800',
  'termine': 'bg-gray-100 text-gray-800',
};

export default function ContratCard({ contrat, onCancel }: ContratCardProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-100 mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[contrat.statut] || 'bg-gray-100 text-gray-800'}`}>
          {contrat.statut}
        </span>
        {onCancel && contrat.statut === 'en_cours' && (
          <button
            onClick={() => onCancel(contrat.id)}
            className="text-red-600 hover:underline text-xs"
          >
            Annuler
          </button>
        )}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Chambre :</span> {contrat.chambre}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Maison :</span> {contrat.maison}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Début :</span> {contrat.date_debut}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Fin :</span> {contrat.date_fin}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Loyer :</span> {contrat.loyer} FCFA
      </div>
      <div className="mb-2">
        <span className="font-semibold">Caution :</span> {contrat.caution} FCFA
      </div>
      <div className="mb-2">
        <span className="font-semibold">Paiement :</span> {contrat.mode_paiement}
      </div>
    </div>
  );
} 