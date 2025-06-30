"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getMaison, updateMaison } from "../../../services/maison";
import ProtectedRoute from "../../../components/ProtectedRoute";

interface MaisonForm {
  adresse: string;
  latitude: string;
  longitude: string;
  description: string;
}

const initialForm: MaisonForm = {
  adresse: "",
  latitude: "",
  longitude: "",
  description: "",
};

function EditerMaisonContent() {
  const [form, setForm] = useState<MaisonForm>(initialForm);
  const [errors, setErrors] = useState<Partial<MaisonForm> | string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [maisonId, setMaisonId] = useState<number | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("id");
    if (!id || isNaN(Number(id))) {
      router.push("/maisons");
      return;
    }
    setMaisonId(Number(id));
    loadMaison(Number(id));
  }, [searchParams, router]);

  const loadMaison = async (id: number) => {
    setLoading(true);
    setErrors(null);
    try {
      const maison = await getMaison(id);
      setForm({
        adresse: maison.adresse,
        latitude: maison.latitude,
        longitude: maison.longitude,
        description: maison.description,
      });
    } catch (err) {
      setErrors(err instanceof Error ? err.message : "Erreur de chargement de la maison");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (data: MaisonForm): Partial<MaisonForm> => {
    const newErrors: Partial<MaisonForm> = {};
    
    if (!data.adresse.trim()) {
      newErrors.adresse = "L'adresse est requise";
    }
    
    if (!data.latitude.trim()) {
      newErrors.latitude = "La latitude est requise";
    } else if (isNaN(Number(data.latitude)) || Number(data.latitude) < -90 || Number(data.latitude) > 90) {
      newErrors.latitude = "La latitude doit être un nombre entre -90 et 90";
    }
    
    if (!data.longitude.trim()) {
      newErrors.longitude = "La longitude est requise";
    } else if (isNaN(Number(data.longitude)) || Number(data.longitude) < -180 || Number(data.longitude) > 180) {
      newErrors.longitude = "La longitude doit être un nombre entre -180 et 180";
    }
    
    if (!data.description.trim()) {
      newErrors.description = "La description est requise";
    } else if (data.description.length < 10) {
      newErrors.description = "La description doit contenir au moins 10 caractères";
    }
    
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors && typeof errors !== "string" && errors[name as keyof MaisonForm]) {
      setErrors(prev => {
        if (typeof prev === "string") return prev;
        const newErrors = { ...prev };
        delete newErrors[name as keyof MaisonForm];
        return Object.keys(newErrors).length === 0 ? null : newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!maisonId) return;
    
    setErrors(null);
    
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      await updateMaison(maisonId, {
        ...form,
        latitude: form.latitude.trim(),
        longitude: form.longitude.trim(),
      });
      
      // Redirect to maison list with success message
      router.push("/maisons?success=updated");
    } catch (err) {
      if (err instanceof Error) {
        setErrors(err.message);
      } else {
        setErrors("Une erreur est survenue lors de la mise à jour de la maison");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/maisons");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-blue-200">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span className="text-gray-700">Chargement de la maison...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-blue-200 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white bg-opacity-95 rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={handleCancel}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                title="Retour"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">
                  Modifier la maison
                </h1>
                <p className="text-gray-600 mt-1">
                  Modifiez les informations de votre propriété
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white bg-opacity-95 rounded-2xl shadow-xl p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {errors && typeof errors === "string" && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors}
                  </div>
                </div>
              )}

              {/* Adresse */}
              <div>
                <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse *
                </label>
                <input
                  type="text"
                  id="adresse"
                  name="adresse"
                  value={form.adresse}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                    errors && typeof errors !== "string" && errors.adresse
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="123 Rue de la Paix, 75001 Paris"
                />
                {errors && typeof errors !== "string" && errors.adresse && (
                  <p className="mt-1 text-sm text-red-600">{errors.adresse}</p>
                )}
              </div>

              {/* Latitude */}
              <div>
                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude *
                </label>
                <input
                  type="number"
                  id="latitude"
                  name="latitude"
                  step="any"
                  value={form.latitude}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                    errors && typeof errors !== "string" && errors.latitude
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="48.8566"
                />
                {errors && typeof errors !== "string" && errors.latitude && (
                  <p className="mt-1 text-sm text-red-600">{errors.latitude}</p>
                )}
              </div>

              {/* Longitude */}
              <div>
                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude *
                </label>
                <input
                  type="number"
                  id="longitude"
                  name="longitude"
                  step="any"
                  value={form.longitude}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                    errors && typeof errors !== "string" && errors.longitude
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="2.3522"
                />
                {errors && typeof errors !== "string" && errors.longitude && (
                  <p className="mt-1 text-sm text-red-600">{errors.longitude}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none ${
                    errors && typeof errors !== "string" && errors.description
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Décrivez votre propriété (type de logement, nombre de pièces, équipements, etc.)"
                />
                {errors && typeof errors !== "string" && errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:from-blue-600 hover:to-blue-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Sauvegarde...
                    </div>
                  ) : (
                    "Sauvegarder"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditerMaisonPage() {
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
        <EditerMaisonContent />
      </Suspense>
    </ProtectedRoute>
  );
} 