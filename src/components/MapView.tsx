"use client";
import { useEffect, useRef, useState } from "react";

interface Maison {
  id: number;
  adresse: string;
  latitude: string;
  longitude: string;
  description: string;
}

interface MapViewProps {
  // For single house view
  latitude?: string;
  longitude?: string;
  adresse?: string;
  // For multiple houses view
  maisons?: Maison[];
  className?: string;
}

export default function MapView({ 
  latitude, 
  longitude, 
  adresse, 
  maisons, 
  className = "" 
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    const currentRef = mapRef.current;
    currentRef.innerHTML = "";
    setIsMapLoaded(false);

    // Handle multiple houses
    if (maisons && maisons.length > 0) {
      // Calculate bounds for all houses
      const lats = maisons.map(m => parseFloat(m.latitude)).filter(lat => !isNaN(lat));
      const lngs = maisons.map(m => parseFloat(m.longitude)).filter(lng => !isNaN(lng));
      
      if (lats.length > 0 && lngs.length > 0) {
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);
        
        // Add some padding
        const latPadding = Math.max((maxLat - minLat) * 0.1, 0.01);
        const lngPadding = Math.max((maxLng - minLng) * 0.1, 0.01);
        
        const bbox = `${minLng - lngPadding},${minLat - latPadding},${maxLng + lngPadding},${maxLat + latPadding}`;
        
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`;
        iframe.width = "100%";
        iframe.height = "100%";
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("scrolling", "no");
        iframe.style.border = "none";
        iframe.title = "Carte des maisons";
        
        iframe.onload = () => setIsMapLoaded(true);
        currentRef.appendChild(iframe);
      }
    }
    // Handle single house
    else if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);

      if (!isNaN(lat) && !isNaN(lng)) {
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.005},${lat-0.005},${lng+0.005},${lat+0.005}&layer=mapnik&marker=${lat},${lng}`;
        iframe.width = "100%";
        iframe.height = "100%";
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("scrolling", "no");
        iframe.style.border = "none";
        iframe.title = adresse || "Carte";

        iframe.onload = () => setIsMapLoaded(true);
        currentRef.appendChild(iframe);
      }
    }

    return () => {
      if (currentRef) {
        currentRef.innerHTML = "";
      }
    };
  }, [latitude, longitude, adresse, maisons]);

  // Check if we have valid data
  const hasValidData = (maisons && maisons.length > 0) || (latitude && longitude);

  if (!hasValidData) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center h-full ${className}`}>
        <div className="text-center text-gray-500">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-xs">Aucune carte disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-lg overflow-hidden border border-gray-200 ${className}`}>
      {/* Loading overlay */}
      {!isMapLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <div className="text-center text-gray-500">
            <svg className="animate-spin w-6 h-6 mx-auto mb-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <p className="text-xs">Chargement de la carte...</p>
          </div>
        </div>
      )}
      
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Info overlay for single house */}
      {adresse && latitude && longitude && (
        <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-sm p-2 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate" title={adresse}>
                📍 {adresse}
              </p>
              <div className="flex gap-2 text-xs text-gray-500">
                <span>Lat: {parseFloat(latitude).toFixed(4)}</span>
                <span>Lng: {parseFloat(longitude).toFixed(4)}</span>
              </div>
            </div>
            <a
              href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=15`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 p-1 text-blue-600 hover:bg-blue-100 rounded transition"
              title="Ouvrir dans OpenStreetMap"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </div>
  );
} 