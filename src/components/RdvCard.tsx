import React from "react";
import { RendezVous } from "@/services/rendezvous";

type RdvCardProps = {
  rdv: RendezVous;
  onCancel?: (id: number) => void;
};

export default function RdvCard({ rdv, onCancel }: RdvCardProps) {
  return (
    <div className="bg-white rounded-xl shadow p-4 border mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <div className="font-bold text-blue-800 text-lg mb-1">Chambre n°{rdv.chambre}</div>
        <div className="text-gray-700 text-sm mb-1">Date/heure : <span className="font-semibold">{new Date(rdv.date_heure).toLocaleString()}</span></div>
        <div className="text-gray-700 text-sm mb-1">Statut : <span className={`font-bold ${rdv.statut === 'en_attente' ? 'text-yellow-600' : rdv.statut === 'confirme' ? 'text-green-600' : 'text-red-600'}`}>{rdv.statut.replace('_', ' ')}</span></div>
      </div>
      {onCancel && rdv.statut === 'en_attente' && (
        <button
          className="mt-2 md:mt-0 bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold hover:bg-red-200 transition"
          onClick={() => onCancel(rdv.id)}
        >
          Annuler
        </button>
      )}
    </div>
  );
} 