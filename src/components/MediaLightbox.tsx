import React, { useEffect } from "react";
import { Media } from "@/services/media";
import Image from "next/image";

type MediaLightboxProps = {
  media: Media | null;
  onClose: () => void;
};

export default function MediaLightbox({ media, onClose }: MediaLightboxProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (media) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [media, onClose]);

  if (!media) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      {/* Bouton fermer */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Contenu média */}
      <div className="relative max-w-4xl max-h-[90vh] mx-4">
        {media.type === "photo" ? (
          <div className="relative w-full h-full">
            <Image
              src={media.url}
              alt={media.description || "Image"}
              width={1200}
              height={800}
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        ) : (
          <video
            src={media.url}
            controls
            className="w-full h-auto max-h-[90vh] rounded-lg"
            autoPlay
          >
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
        )}

        {/* Informations */}
        <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              media.type === 'photo' 
                ? 'bg-blue-500 text-white' 
                : 'bg-purple-500 text-white'
            }`}>
              {media.type === 'photo' ? '📷 Photo' : '🎥 Vidéo'}
            </span>
            <span className="text-xs text-gray-300">
              Ajouté le {new Date(media.cree_le).toLocaleDateString('fr-FR')}
            </span>
          </div>
          {media.description && (
            <p className="text-sm">{media.description}</p>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 text-sm">
        Appuyez sur Échap pour fermer
      </div>
    </div>
  );
} 