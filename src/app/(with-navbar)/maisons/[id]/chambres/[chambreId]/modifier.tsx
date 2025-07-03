"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getChambre, updateChambre } from "../../../../../services/chambre";
import ChambreForm, { ChambreFormValues } from "../../../../../components/ChambreForm";
import ProtectedRoute from "../../../../../components/ProtectedRoute";

export default function ModifierChambrePage() {
  const router = useRouter();
  const params = useParams();
  const maisonId = Number(params.id);
  const chambreId = Number(params.chambreId);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string | Partial<Record<keyof ChambreFormValues, string>> | null>(null);
  const [initialValues, setInitialValues] = useState<ChambreFormValues | null>(null);

  useEffect(() => {
    const fetchChambre = async () => {
      try {
        const chambre = await getChambre(chambreId);
        setInitialValues({
          titre: chambre.titre,
          description: chambre.description,
          taille: chambre.taille,
          type: chambre.type,
          meublee: chambre.meublee,
          salle_de_bain: chambre.salle_de_bain,
          prix: Number(chambre.prix),
          disponible: chambre.disponible,
        });
      } catch (err) {
        setErrors(err instanceof Error ? err.message : "Erreur de chargement de la chambre");
      }
    };
    if (chambreId) fetchChambre();
  }, [chambreId]);

  const validateForm = (data: ChambreFormValues): Partial<Record<keyof ChambreFormValues, string>> => {
    const newErrors: Partial<Record<keyof ChambreFormValues, string>> = {};
    if (!data.titre.trim()) newErrors.titre = "Le titre est requis";
    if (!data.description.trim()) newErrors.description = "La description est requise";
    if (!data.taille.trim()) newErrors.taille = "La taille est requise";
    if (!data.type.trim()) newErrors.type = "Le type est requis";
    const prixValue = Number(data.prix);
    if (!prixValue || prixValue <= 0) newErrors.prix = "Le prix doit être positif";
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
      await updateChambre(chambreId, {
        ...values,
        prix: Number(values.prix),
        maison: maisonId,
      });
      router.push(`/maisons/${maisonId}/chambres?success=updated`);
    } catch (err) {
      setErrors(err instanceof Error ? err.message : "Erreur lors de la modification de la chambre");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/maisons/${maisonId}/chambres`);
  };

  if (!initialValues) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <ProtectedRoute requiredRole="proprietaire">
      <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-blue-200 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
              <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Modifier la chambre</h1>
            </div>
            <div className="bg-white bg-opacity-95 rounded-2xl shadow-xl p-8 border border-gray-100">
              <ChambreForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                loading={loading}
                errors={errors}
                onCancel={handleCancel}
                submitLabel="Enregistrer les modifications"
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 