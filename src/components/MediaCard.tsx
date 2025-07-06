import React, { useState } from "react";
import { Media } from "@/services/media";
import Image from "next/image";

type MediaCardProps = {
  media: Media;
  onDelete?: (id: number) => void;
  onView?: (media: Media) => void;
};

export default function MediaCard({ media, onDelete, onView }: MediaCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    
    if (confirm("Êtes-vous sûr de vouloir supprimer ce média ?")) {
      setIsLoading(true);
      try {
        await onDelete(media.id);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression du média");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const imageUrl = media.url.startsWith('http') ? media.url : `http://localhost:8000${media.url}`;

  return (
    <div 
      className="relative bg-white/90 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg hover:shadow-xl overflow-hidden group transition-all duration-300 hover:scale-105"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Contrôles overlay modernes */}
      {showControls && (
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          {onView && (
            <button
              onClick={() => onView(media)}
              className="p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
              title="Voir en grand"
            >
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="p-2 bg-red-500/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-600 hover:scale-110 transition-all duration-200 disabled:opacity-50"
              title="Supprimer"
            >
              {isLoading ? (
                <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          )}
        </div>
      )}

      {/* Badge type moderne */}
      <div className="absolute top-3 left-3 z-10">
        <span className={`px-3 py-1.5 text-xs font-medium rounded-full backdrop-blur-sm ${
          media.type === 'photo' 
            ? 'bg-blue-500/90 text-white' 
            : 'bg-purple-500/90 text-white'
        }`}>
          {media.type === 'photo' ? '📷' : '🎥'}
        </span>
      </div>

      {/* Contenu média moderne */}
      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative cursor-pointer overflow-hidden" onClick={() => onView?.(media)}>
        {media.type === 'photo' ? (
          <Image
            src={imageUrl}
            alt={media.description || "Image de la chambre"}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <video
            src={imageUrl}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            poster="/video-placeholder.jpg"
            preload="metadata"
          >
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
        )}
        
        {/* Overlay play button moderne pour les vidéos */}
        {media.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-16 h-16 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-200">
              <svg className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Description simple */}
      {media.description && (
        <div className="p-3 pt-2">
          <p className="text-sm text-gray-700 line-clamp-2">
            {media.description}
          </p>
        </div>
      )}
    </div>
  );
} 