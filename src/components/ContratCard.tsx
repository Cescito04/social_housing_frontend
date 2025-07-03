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
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-2xl shadow-xl p-8 border-4 border-blue-300 mb-6 transition-transform hover:scale-[1.02] hover:shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <span className={`px-4 py-2 rounded-full text-base font-extrabold uppercase tracking-wide shadow ${statusColors[contrat.statut] || 'bg-gray-100 text-gray-800'}`}>
          {contrat.statut}
        </span>
        {onCancel && contrat.statut === 'en_cours' && (
          <button
            onClick={() => onCancel(contrat.id)}
            className="text-red-700 hover:underline text-sm font-bold px-3 py-1 border border-red-200 rounded-lg bg-red-50 hover:bg-red-100 transition"
          >
            Annuler
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg text-blue-900 font-bold mt-2">
        <div className="mb-1"><span className="text-blue-700 font-extrabold">Chambre :</span> <span className="font-bold">{contrat.chambre}</span></div>
        <div className="mb-1"><span className="text-blue-700 font-extrabold">Maison :</span> <span className="font-bold">{contrat.maison}</span></div>
        <div className="mb-1"><span className="text-blue-700 font-extrabold">Début :</span> <span className="font-bold">{contrat.date_debut}</span></div>
        <div className="mb-1"><span className="text-blue-700 font-extrabold">Fin :</span> <span className="font-bold">{contrat.date_fin}</span></div>
        <div className="mb-1"><span className="text-green-700 font-extrabold">Loyer :</span> <span className="font-bold">{contrat.loyer} FCFA</span></div>
        <div className="mb-1"><span className="text-yellow-700 font-extrabold">Caution :</span> <span className="font-bold">{contrat.montant_caution} FCFA</span></div>
        <div className="mb-1"><span className="text-purple-700 font-extrabold">Paiement :</span> <span className="font-bold">{contrat.mode_paiement}</span></div>
        {contrat.locataire_info && (
          <div className="mb-1 md:col-span-2">
            <span className="text-pink-700 font-extrabold">Locataire :</span> 
            <span className="font-bold">{contrat.locataire_info.first_name} {contrat.locataire_info.last_name} ({contrat.locataire_info.email})</span>
          </div>
        )}
      </div>
    </div>
  );
} 