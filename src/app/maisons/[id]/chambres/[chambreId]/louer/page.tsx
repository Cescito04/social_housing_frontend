'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createContrat } from '../../../../../../services/contrat';
import ProtectedRoute from '../../../../../../components/ProtectedRoute';
import { getChambre } from '../../../../../../services/chambre';

const MODE_PAIEMENT_OPTIONS = [
  { value: "cash", label: "Cash" },
  { value: "virement", label: "Virement" },
  { value: "mobile money", label: "Mobile Money" },
];
const PERIODICITE_OPTIONS = [
  { value: "journalier", label: "Journalier" },
  { value: "hebdomadaire", label: "Hebdomadaire" },
  { value: "mensuel", label: "Mensuel" },
];

const steps = [
  "Récapitulatif",
  "Saisie du contrat",
  "Confirmation",
  "Succès"
];

export default function LouerChambrePage() {
  const router = useRouter();
  const params = useParams();
  const chambreId = Number(Array.isArray(params.chambreId) ? params.chambreId[0] : params.chambreId);
  const [chambre, setChambre] = useState<any>(null);
  const [chambreLoading, setChambreLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form state
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [modePaiement, setModePaiement] = useState('');
  const [periodicite, setPeriodicite] = useState('');
  const [montantCaution, setMontantCaution] = useState("");

  useEffect(() => {
    const fetchChambre = async () => {
      setChambreLoading(true);
      try {
        console.log("chambreId", chambreId);
        const data = await getChambre(chambreId);
        setChambre(data);
      } catch (err: any) {
        setError("Chambre introuvable ou inaccessible.");
      } finally {
        setChambreLoading(false);
      }
    };
    if (chambreId) fetchChambre();
  }, [chambreId]);

  // Stepper component
  function Stepper() {
    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((label, idx) => (
          <div key={label} className="flex items-center">
            <div className={`rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg border-2 transition-all duration-200
              ${step === idx ? "bg-blue-700 text-white border-blue-700" : step > idx ? "bg-blue-200 text-blue-700 border-blue-400" : "bg-gray-200 text-gray-400 border-gray-300"}`}>{idx + 1}</div>
            {idx < steps.length - 1 && <div className={`w-10 h-1 ${step > idx ? "bg-blue-700" : "bg-gray-200"}`}></div>}
          </div>
        ))}
      </div>
    );
  }

  // Validation for step 1 (saisie)
  function validateSaisie() {
    if (!dateDebut || !dateFin || !modePaiement || !periodicite || !montantCaution) {
      setError("Tous les champs sont obligatoires");
      return false;
    }
    if (dateFin <= dateDebut) {
      setError("La date de fin doit être après la date de début");
      return false;
    }
    if (Number(montantCaution) <= 0) {
      setError("Le montant de la caution doit être positif");
      return false;
    }
    setError(null);
    return true;
  }

  // Step 0: Récapitulatif
  function RecapStep() {
    return (
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-blue-800 mb-6">Récapitulatif de la chambre</h2>
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200">
          <div className="mb-4">
            <span className="block text-gray-600 font-semibold">Adresse de la maison</span>
            <span className="font-bold text-xl text-blue-900">{chambre?.maison?.adresse || "-"}</span>
          </div>
          {chambre?.maison?.description && (
            <div className="mb-4">
              <span className="block text-gray-600 font-semibold">Description de la maison</span>
              <span className="font-semibold text-lg text-blue-800">{chambre?.maison?.description}</span>
            </div>
          )}
          <div className="mb-4">
            <span className="block text-gray-600 font-semibold">Chambre</span>
            <span className="font-bold text-xl text-blue-900">{chambre?.nom || chambre?.titre || chambre?.id}</span>
          </div>
          <div className="mb-4">
            <span className="block text-gray-600 font-semibold">Prix</span>
            <span className="font-bold text-xl text-green-700">{chambre?.prix} FCFA</span>
          </div>
          <div className="mb-4">
            <span className="block text-gray-600 font-semibold">Disponibilité</span>
            <span className={`font-bold text-xl ${chambre?.disponible ? 'text-green-700' : 'text-red-700'}`}>{chambre?.disponible ? "Disponible" : "Indisponible"}</span>
          </div>
          {chambre?.description && (
            <div className="mb-2">
              <span className="block text-gray-600 font-semibold">Description de la chambre</span>
              <span className="font-semibold text-lg text-blue-800">{chambre.description}</span>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-8">
          <button className="bg-blue-700 text-white px-8 py-3 rounded-xl font-extrabold text-lg shadow-lg hover:bg-blue-800 transition" onClick={() => setStep(1)}>
            Continuer
          </button>
        </div>
      </div>
    );
  }

  // Step 1: Saisie du contrat
  function SaisieStep() {
    return (
      <form
        onSubmit={e => {
          e.preventDefault();
          if (validateSaisie()) setStep(2);
        }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Saisie des informations du contrat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-lg font-bold text-blue-800 flex items-center gap-2"><span>📅</span> Date de début</label>
            <input type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)} required className="w-full border-2 border-blue-400 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-blue-50 text-blue-900 placeholder:text-gray-400" />
          </div>
          <div>
            <label className="block mb-2 text-lg font-bold text-blue-800 flex items-center gap-2"><span>📅</span> Date de fin</label>
            <input type="date" value={dateFin} onChange={e => setDateFin(e.target.value)} required className="w-full border-2 border-blue-400 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-blue-50 text-blue-900 placeholder:text-gray-400" />
          </div>
          <div>
            <label className="block mb-2 text-lg font-bold text-blue-800 flex items-center gap-2"><span>💳</span> Mode de paiement</label>
            <select value={modePaiement} onChange={e => setModePaiement(e.target.value)} required className="w-full border-2 border-blue-400 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-blue-50 text-blue-900">
              <option value="">Sélectionner</option>
              {MODE_PAIEMENT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-lg font-bold text-blue-800 flex items-center gap-2"><span>⏰</span> Périodicité</label>
            <select value={periodicite} onChange={e => setPeriodicite(e.target.value)} required className="w-full border-2 border-blue-400 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-blue-50 text-blue-900">
              <option value="">Sélectionner</option>
              {PERIODICITE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block mb-2 text-lg font-bold text-blue-800 flex items-center gap-2"><span>💰</span> Montant de la caution</label>
            <input type="number" min="0" step="0.01" value={montantCaution} onChange={e => setMontantCaution(e.target.value)} required className="w-full border-2 border-blue-400 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-blue-50 text-blue-900 placeholder:text-gray-400" placeholder="Ex: 50000" />
          </div>
        </div>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
        <div className="flex justify-between mt-6">
          <button type="button" className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-bold hover:bg-gray-300 transition" onClick={() => setStep(0)}>
            Précédent
          </button>
          <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-800 transition">
            Suivant
          </button>
        </div>
      </form>
    );
  }

  // Step 2: Confirmation
  function ConfirmationStep() {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Confirmation</h2>
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200">
          <div className="mb-4">
            <span className="block text-gray-600 font-semibold">Adresse de la maison</span>
            <span className="font-bold text-xl text-blue-900">{chambre?.maison?.adresse || "-"}</span>
          </div>
          {chambre?.maison?.description && (
            <div className="mb-4">
              <span className="block text-gray-600 font-semibold">Description de la maison</span>
              <span className="font-semibold text-lg text-blue-800">{chambre?.maison?.description}</span>
            </div>
          )}
          <div className="mb-4">
            <span className="block text-gray-600 font-semibold">Chambre</span>
            <span className="font-bold text-xl text-blue-900">{chambre?.nom || chambre?.titre || chambre?.id}</span>
          </div>
          <div className="mb-4">
            <span className="block text-gray-600 font-semibold">Prix</span>
            <span className="font-bold text-xl text-green-700">{chambre?.prix} FCFA</span>
          </div>
          <div className="mb-4">
            <span className="block text-gray-600 font-semibold">Date de début</span>
            <span className="font-bold text-xl text-blue-900">{dateDebut}</span>
          </div>
          <div className="mb-4">
            <span className="block text-gray-600 font-semibold">Date de fin</span>
            <span className="font-bold text-xl text-blue-900">{dateFin}</span>
          </div>
          <div className="mb-4">
            <span className="block text-gray-600 font-semibold">Mode de paiement</span>
            <span className="font-bold text-xl text-blue-900">{MODE_PAIEMENT_OPTIONS.find(opt => opt.value === modePaiement)?.label}</span>
          </div>
          <div className="mb-4">
            <span className="block text-gray-600 font-semibold">Périodicité</span>
            <span className="font-bold text-xl text-blue-900">{PERIODICITE_OPTIONS.find(opt => opt.value === periodicite)?.label}</span>
          </div>
          <div className="mb-4">
            <span className="block text-gray-600 font-semibold">Montant de la caution</span>
            <span className="font-bold text-xl text-blue-900">{montantCaution} FCFA</span>
          </div>
        </div>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
        <div className="flex justify-between mt-6">
          <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-bold hover:bg-gray-300 transition" onClick={() => setStep(1)}>
            Précédent
          </button>
          <button
            className="bg-blue-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-800 transition"
            onClick={async () => {
              setLoading(true);
              setError(null);
              try {
                await createContrat({
                  chambre: chambreId,
                  date_debut: dateDebut,
                  date_fin: dateFin,
                  mode_paiement: modePaiement,
                  periodicite: periodicite,
                  montant_caution: Number(montantCaution),
                });
                setSuccess(true);
                setStep(3);
              } catch (err: any) {
                setError(err?.message || "Erreur lors de la création du contrat.");
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            {loading ? "Signature..." : "Confirmer et signer"}
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Succès
  function SuccessStep() {
    return (
      <div className="p-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="text-green-600 text-6xl mb-4">✔️</div>
          <div className="text-green-700 font-extrabold text-2xl mb-4">Contrat signé avec succès !</div>
          <div className="mb-6 text-gray-700">Vous pouvez retrouver ce contrat dans votre espace personnel.</div>
          <div className="flex gap-4 justify-center">
            <button className="bg-blue-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-800 transition" onClick={() => router.push("/contrats")}>Voir mes contrats</button>
            <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-bold hover:bg-gray-300 transition" onClick={() => router.push("/")}>Retour à l'accueil</button>
          </div>
        </div>
      </div>
    );
  }

  if (chambreLoading) return <div className="p-8 text-center">Chargement...</div>;
  if (error && step === 0) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <ProtectedRoute requiredRole="locataire">
      <div className="min-h-screen bg-gradient-to-tr from-blue-200 via-white to-blue-300 py-8 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white bg-opacity-95 rounded-2xl shadow-2xl p-10 border-2 border-blue-200">
          <Stepper />
          {step === 0 && <RecapStep />}
          {step === 1 && <SaisieStep />}
          {step === 2 && <ConfirmationStep />}
          {step === 3 && <SuccessStep />}
        </div>
      </div>
    </ProtectedRoute>
  );
} 