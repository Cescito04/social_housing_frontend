"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMedias, deleteMedia, Media } from "@/services/media";
import { getChambre } from "@/services/chambre";
import { Chambre } from "@/services/chambre";
import MediaCard from "@/components/MediaCard";
import UploadMediaForm from "@/components/UploadMediaForm";
import MediaLightbox from "@/components/MediaLightbox";
import { getAccessToken } from "@/services/auth";

export default function MediasPage() {
  const params = useParams();
  const router = useRouter();
  const chambreId = parseInt(params.chambreId as string);

  const [medias, setMedias] = useState<Media[]>([]);
  const [chambre, setChambre] = useState<Chambre | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Vérifier l'authentification
      const token = getAccessToken();
      if (!token) {
        router.push("/login");
        return;
      }

      // Charger les données en parallèle
      const [mediasData, chambreData] = await Promise.all([
        getMedias(chambreId),
        getChambre(chambreId)
      ]);

      setMedias(mediasData);
      setChambre(chambreData);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
      setError("Erreur lors du chargement des données");
    } finally {
      setIsLoading(false);
    }
  }, [chambreId, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDeleteMedia = async (mediaId: number) => {
    try {
      await deleteMedia(mediaId);
      setMedias(medias.filter(m => m.id !== mediaId));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression du média");
    }
  };

  const handleUploadSuccess = () => {
    loadData(); // Recharger les médias
    setShowUploadForm(false);
  };

  const handleUploadError = (error: string) => {
    console.error("Erreur upload:", error);
    // L'erreur est déjà affichée dans le formulaire
  };

  const getUserRole = () => {
    const token = getAccessToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role || null;
    } catch {
      return null;
    }
  };

  const role = getUserRole();
  const isProprietaire = role === "proprietaire";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!chambre) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-yellow-800">Chambre non trouvée</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header moderne */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-all duration-200"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Galerie
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {chambre.titre}
                </p>
              </div>
            </div>
            {isProprietaire && (
              <button
                onClick={() => setShowUploadForm(!showUploadForm)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  showUploadForm 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                }`}
              >
                {showUploadForm ? "Annuler" : "+ Ajouter"}
              </button>
            )}
          </div>
        </div>

        {/* Formulaire d'upload */}
        {showUploadForm && isProprietaire && (
          <div className="mb-8">
            <UploadMediaForm
              chambreId={chambreId}
              onSuccess={handleUploadSuccess}
              onError={handleUploadError}
            />
          </div>
        )}

        {/* Compteur moderne */}
        <div className="mb-6">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">
                {medias.length} média{medias.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">
                {medias.filter(m => m.type === 'photo').length} photo{medias.filter(m => m.type === 'photo').length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600">
                {medias.filter(m => m.type === 'video').length} vidéo{medias.filter(m => m.type === 'video').length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Grille des médias moderne */}
        {medias.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-12 text-center shadow-xl">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Galerie vide</h3>
            <p className="text-gray-500 mb-6">
              {isProprietaire 
                ? "Commencez par ajouter des photos et vidéos pour illustrer cette chambre."
                : "Aucun média n'a encore été ajouté."
              }
            </p>
            {isProprietaire && (
              <button
                onClick={() => setShowUploadForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                + Ajouter le premier média
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {medias.map((media) => (
              <MediaCard
                key={media.id}
                media={media}
                onDelete={isProprietaire ? handleDeleteMedia : undefined}
                onView={setSelectedMedia}
              />
            ))}
          </div>
        )}

        {/* Lightbox */}
        <MediaLightbox
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      </div>
    </div>
  );
} 