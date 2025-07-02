import React from "react";
import { useRouter } from "next/navigation";
import { Chambre } from "../services/chambre";

type ChambreCardProps = {
  chambre: Chambre;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
};

export default function ChambreCard({ chambre, onEdit, onDelete }: ChambreCardProps) {
  const router = useRouter();
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-col gap-2">
      <div className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center overflow-hidden">
        <img
          src={"/room-default.jpg"}
          alt="Chambre"
          className="object-cover w-full h-full"
          style={{ maxHeight: 128 }}
        />
      </div>
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{chambre.titre}</h3>
        <div className="flex gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(chambre.id)}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
              title="Modifier"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(chambre.id)}
              className="p-1 text-red-600 hover:bg-red-50 rounded transition"
              title="Supprimer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-medium text-green-700">{chambre.prix} FCFA</span>
        <span className={`ml-2 text-xs px-2 py-0.5 rounded ${chambre.disponible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {chambre.disponible ? "Disponible" : "Indisponible"}
        </span>
      </div>
      <ul className="text-xs text-gray-700 space-y-0.5 mt-1">
        <li><span className="font-medium">Type :</span> <span className="capitalize">{chambre.type}</span></li>
        <li><span className="font-medium">Taille :</span> {chambre.taille} m²</li>
        <li><span className="font-medium">Meublée :</span> {chambre.meublee ? "Oui" : "Non"}</li>
        <li><span className="font-medium">Salle de bain :</span> {chambre.salle_de_bain ? "Oui" : "Non"}</li>
      </ul>
      {chambre.description && (
        <div className="text-xs text-gray-500 mt-1 line-clamp-2">{chambre.description}</div>
      )}
      {chambre.disponible && (
        <button
          onClick={() => router.push(`/maisons/${chambre.maison}/chambres/${chambre.id}/louer`)}
          className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg shadow hover:bg-blue-700 transition font-semibold"
        >
          Louer cette chambre
        </button>
      )}
    </div>
  );
} 