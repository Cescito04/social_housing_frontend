"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createChambre, Equipement } from "../../../../../services/chambre";
import ChambreForm, { ChambreFormValues } from "../../../../../components/ChambreForm";
import ProtectedRoute from "../../../../../components/ProtectedRoute";

// TODO: Remplacer par un vrai fetch des équipements si API disponible
const equipementsFictifs: Equipement[] = [
  { id: 1, nom: "Climatisation" },
  { id: 2, nom: "Salle de bain privée" },
  { id: 3, nom: "Balcon" },
  { id: 4, nom: "Wi-Fi" },
];

export default function AjouterChambrePage() {
  const router = useRouter();
  const params = useParams();
  const maisonId = Number(Array.isArray(params.id) ? params.id[0] : params.id);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ChambreFormValues> | string | null>(null);

  const validateForm = (data: ChambreFormValues): Partial<ChambreFormValues> => {
    const newErrors: Partial<ChambreFormValues> = {};
    if (!data.titre.trim()) newErrors.titre = "Le titre est requis";
    if (!data.description.trim()) newErrors.description = "La description est requise";
    if (!data.taille.trim()) newErrors.taille = "La taille est requise";
    if (!data.type.trim()) newErrors.type = "Le type est requis";
    if (!data.prix || data.prix <= 0) newErrors.prix = "Le prix doit être positif";
    return newErrors;
  };

  const handleSubmit = async (values: ChambreFormValues) => {
    setErrors(null);
    const validationErrors = validateForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      await createChambre({
        ...values,
        maison: maisonId,
      });
      router.push(`/maisons/${maisonId}/chambres?success=created`);
    } catch (err) {
      setErrors(err instanceof Error ? err.message : "Erreur lors de la création de la chambre");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/maisons/${maisonId}/chambres`);
  };

  return (
    <ProtectedRoute requiredRole="proprietaire">
      <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-blue-200 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
              <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Ajouter une chambre</h1>
            </div>
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-xl p-8 border border-gray-100">
              <ChambreForm
                onSubmit={handleSubmit}
                loading={loading}
                errors={errors as Partial<Record<keyof ChambreFormValues, string>> | string | null}
                onCancel={handleCancel}
                submitLabel="Créer la chambre"
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 