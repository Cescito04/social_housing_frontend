import React, { useState } from "react";

export type ChambreFormValues = {
  titre: string;
  description: string;
  taille: string;
  type: string;
  meublee: boolean;
  salle_de_bain: boolean;
  prix: number;
  disponible: boolean;
};

type ChambreFormProps = {
  initialValues?: ChambreFormValues;
  onSubmit: (values: ChambreFormValues) => void;
  loading?: boolean;
  errors?: Partial<Record<keyof ChambreFormValues, string>> | string | null;
  submitLabel?: string;
  onCancel?: () => void;
  title?: string;
};

const defaultValues: ChambreFormValues = {
  titre: "",
  description: "",
  taille: "",
  type: "simple",
  meublee: false,
  salle_de_bain: false,
  prix: 0,
  disponible: true,
};

const iconClass = "w-5 h-5 text-blue-400 mr-2";

export default function ChambreForm({
  initialValues = defaultValues,
  onSubmit,
  loading = false,
  errors = null,
  submitLabel = "Enregistrer",
  onCancel,
  title,
}: ChambreFormProps) {
  const [form, setForm] = useState<ChambreFormValues>(initialValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      prix: Number(form.prix),
    });
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-2xl p-8 sm:p-10 border border-gray-100">
      {title && <h2 className="text-2xl font-bold text-blue-700 mb-8 text-center">{title}</h2>}
      <form onSubmit={handleSubmit} className="space-y-7">
        {errors && typeof errors === "string" && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center font-medium">
            {errors}
          </div>
        )}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
            <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0V5a4 4 0 00-8 0v2m8 0a4 4 0 01-8 0" /></svg>
            Titre *
          </label>
          <input
            type="text"
            name="titre"
            value={form.titre}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-lg bg-gray-50 text-black placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors && typeof errors !== "string" && errors.titre ? "border-red-400" : "border-gray-300"}`}
            placeholder="Ex: Chambre lumineuse"
          />
          {errors && typeof errors !== "string" && errors.titre && (
            <p className="text-red-600 text-xs mt-1">{errors.titre}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
            <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 17l4 4 4-4m-4-5v9" /></svg>
            Description *
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-lg bg-gray-50 text-black placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors && typeof errors !== "string" && errors.description ? "border-red-400" : "border-gray-300"}`}
            placeholder="Décrivez la chambre"
            rows={3}
          />
          {errors && typeof errors !== "string" && errors.description && (
            <p className="text-red-600 text-xs mt-1">{errors.description}</p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
              <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 21V7a2 2 0 00-2-2H6a2 2 0 00-2 2v14" /></svg>
              Taille (m²) *
            </label>
            <input
              type="text"
              name="taille"
              value={form.taille}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-lg bg-gray-50 text-black placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors && typeof errors !== "string" && errors.taille ? "border-red-400" : "border-gray-300"}`}
              placeholder="20"
            />
            {errors && typeof errors !== "string" && errors.taille && (
              <p className="text-red-600 text-xs mt-1">{errors.taille}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
              <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6" /></svg>
              Type *
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 rounded-lg bg-gray-50 text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              <option value="simple">Simple</option>
              <option value="appartement">Appartement</option>
              <option value="maison">Maison</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
              <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6" /></svg>
              Meublée
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <span className="relative">
                <input
                  type="checkbox"
                  name="meublee"
                  checked={form.meublee}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 transition-all"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-4 transition-all"></div>
              </span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
              <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 21h8M12 17v4m-4-4a4 4 0 018 0" /></svg>
              Salle de bain
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <span className="relative">
                <input
                  type="checkbox"
                  name="salle_de_bain"
                  checked={form.salle_de_bain}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 transition-all"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-4 transition-all"></div>
              </span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
              <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              Disponible
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <span className="relative">
                <input
                  type="checkbox"
                  name="disponible"
                  checked={form.disponible}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 transition-all"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-4 transition-all"></div>
              </span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
            <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V4m0 8v8" /></svg>
            Prix (FCFA) *
          </label>
          <input
            type="number"
            name="prix"
            value={form.prix}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-lg bg-gray-50 text-black placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors && typeof errors !== "string" && errors.prix ? "border-red-400" : "border-gray-300"}`}
            placeholder="50000"
          />
          {errors && typeof errors !== "string" && errors.prix && (
            <p className="text-red-600 text-xs mt-1">{errors.prix}</p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 pt-8">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Enregistrement...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {submitLabel}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 