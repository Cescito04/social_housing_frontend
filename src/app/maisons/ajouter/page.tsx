"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createMaison } from "../../../services/maison";
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

export default function AjouterMaisonPage() {
  const [form, setForm] = useState<MaisonForm>(initialForm);
  const [errors, setErrors] = useState<Partial<MaisonForm> | string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    setErrors(null);
    
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await createMaison({
        ...form,
        latitude: form.latitude.trim(),
        longitude: form.longitude.trim(),
      });
      
      // Redirect to maison list with success message
      router.push("/maisons?success=created");
    } catch (err) {
      if (err instanceof Error) {
        setErrors(err.message);
      } else {
        setErrors("Une erreur est survenue lors de la création de la maison");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/maisons");
  };

  return (
    <ProtectedRoute requiredRole="proprietaire">
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
                    Ajouter une maison
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Créez une nouvelle propriété immobilière
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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow ${
                      errors && typeof errors !== "string" && errors.adresse
                        ? "border-red-300 focus:ring-red-400"
                        : "border-gray-300"
                    }`}
                    placeholder="123 Rue de la Paix, 75001 Paris"
                  />
                  {errors && typeof errors !== "string" && errors.adresse && (
                    <p className="text-red-600 text-sm mt-1">{errors.adresse}</p>
                  )}
                </div>

                {/* Coordinates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow ${
                        errors && typeof errors !== "string" && errors.latitude
                          ? "border-red-300 focus:ring-red-400"
                          : "border-gray-300"
                      }`}
                      placeholder="48.8566"
                    />
                    {errors && typeof errors !== "string" && errors.latitude && (
                      <p className="text-red-600 text-sm mt-1">{errors.latitude}</p>
                    )}
                  </div>

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
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow ${
                        errors && typeof errors !== "string" && errors.longitude
                          ? "border-red-300 focus:ring-red-400"
                          : "border-gray-300"
                      }`}
                      placeholder="2.3522"
                    />
                    {errors && typeof errors !== "string" && errors.longitude && (
                      <p className="text-red-600 text-sm mt-1">{errors.longitude}</p>
                    )}
                  </div>
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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow resize-none ${
                      errors && typeof errors !== "string" && errors.description
                        ? "border-red-300 focus:ring-red-400"
                        : "border-gray-300"
                    }`}
                    placeholder="Décrivez votre propriété (type de logement, nombre de pièces, équipements, etc.)"
                  />
                  {errors && typeof errors !== "string" && errors.description && (
                    <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">
                    {form.description.length}/500 caractères
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Création en cours...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Créer la maison
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 