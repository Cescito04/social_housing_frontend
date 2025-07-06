import React, { useState, useRef } from "react";
import { createMedia, validateFile } from "@/services/media";
import Image from "next/image";

type UploadMediaFormProps = {
  chambreId: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
};

export default function UploadMediaForm({ chambreId, onSuccess, onError }: UploadMediaFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validation du fichier
    const validation = validateFile(selectedFile);
    if (!validation.isValid) {
      setError(validation.error || "Fichier invalide");
      setFile(null);
      setPreview(null);
      return;
    }

    setError(null);
    setFile(selectedFile);

    // Créer l'aperçu
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // Pour les vidéos, créer un aperçu avec une URL temporaire
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError("Veuillez sélectionner un fichier");
      return;
    }

    if (!description.trim()) {
      setError("Veuillez ajouter une description");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await createMedia({
        chambre: chambreId,
        file,
        description: description.trim(),
      });

      // Reset form
      setFile(null);
      setDescription("");
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de l'upload";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const validation = validateFile(droppedFile);
      if (!validation.isValid) {
        setError(validation.error || "Fichier invalide");
        return;
      }
      
      setError(null);
      setFile(droppedFile);
      
      if (droppedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(droppedFile);
      } else {
        setPreview(URL.createObjectURL(droppedFile));
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-xl max-w-lg mx-auto">
      <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4 text-center">
        Ajouter un média
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Zone de drop moderne et compacte */}
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 max-w-md mx-auto ${
            file 
              ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!file ? (
            <div>
              <svg className="mx-auto h-14 w-14 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="mt-2">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="block text-sm font-medium text-gray-900 text-center">
                    Glissez-déposez ou cliquez pour sélectionner
                  </span>
                  <span className="block text-xs text-gray-500 mt-1 text-center">
                    Images ou vidéos (max 10MB)
                  </span>
                </label>
                <input
                  id="file-upload"
                  ref={fileInputRef}
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                {file.type.startsWith('image/') ? (
                  <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={preview!}
                      alt="Aperçu"
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <video
                    src={preview!}
                    className="w-full h-48 bg-gray-100 rounded-lg object-contain"
                    controls
                  />
                )}
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="text-sm text-gray-600 text-center">
                <p>{file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)</p>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Décrivez ce média (ex: Vue de la chambre, Salle de bain, etc.)"
            required
          />
        </div>

        {/* Erreur */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Bouton submit moderne */}
        <button
          type="submit"
          disabled={isLoading || !file || !description.trim()}
          className="w-full py-3 px-6 border border-transparent rounded-xl font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Upload en cours...
            </div>
          ) : (
            "Ajouter le média"
          )}
        </button>
      </form>
    </div>
  );
} 