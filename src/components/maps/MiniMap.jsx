import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box } from '@mui/material';

function MiniMap({ latitude, longitude, height = '200px' }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !latitude || !longitude) return;

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        touchZoom: false,
      }).setView([latitude, longitude], 16);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapInstanceRef.current);

      L.marker([latitude, longitude]).addTo(mapInstanceRef.current);
    } else {
      // Update marker position
      mapInstanceRef.current.setView([latitude, longitude], 16);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude]);

  if (!latitude || !longitude) {
    return (
      <Box
        sx={{
          height,
          width: '100%',
          borderRadius: 2,
          bgcolor: 'grey.200',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        No location data
      </Box>
    );
  }

  return (
    <Box
      ref={mapRef}
      sx={{
        height,
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    />
  );
}

export default MiniMap;