import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box } from '@mui/material';

// Fix for default marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMap({ locations = [], center, zoom = 15, height = '400px', onMarkerClick }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Default center (DKUT coordinates)
  const defaultCenter = center || [-0.4175, 36.95];

  useEffect(() => {
    // Initialize map
    if (!mapInstanceRef.current && mapRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(defaultCenter, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    }

    return () => {
      // Cleanup
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    if (locations && locations.length > 0) {
      const bounds = [];

      locations.forEach((location) => {
        if (location.latitude && location.longitude) {
          const marker = L.marker([location.latitude, location.longitude])
            .addTo(mapInstanceRef.current)
            .bindPopup(`
              <div style="padding: 8px;">
                <strong>${location.locationName}</strong><br/>
                <small>${location.locationType}</small><br/>
                ${location.buildingName ? `<small>Building: ${location.buildingName}</small><br/>` : ''}
                ${location.roomNumber ? `<small>Room: ${location.roomNumber}</small>` : ''}
              </div>
            `);

          if (onMarkerClick) {
            marker.on('click', () => onMarkerClick(location));
          }

          markersRef.current.push(marker);
          bounds.push([location.latitude, location.longitude]);
        }
      });

      // Fit map to show all markers
      if (bounds.length > 0) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    } else if (center) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [locations, center, zoom, onMarkerClick]);

  return (
    <Box
      ref={mapRef}
      sx={{
        height,
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        '& .leaflet-container': {
          height: '100%',
          width: '100%',
        },
      }}
    />
  );
}

export default LocationMap;