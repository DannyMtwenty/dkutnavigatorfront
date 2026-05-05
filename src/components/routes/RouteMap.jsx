import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box } from '@mui/material';

function RouteMap({ route, height = '500px' }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routeLayerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [route.fromLatitude, route.fromLongitude],
        16
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !route) return;

    // Clear previous route
    if (routeLayerRef.current) {
      mapInstanceRef.current.removeLayer(routeLayerRef.current);
    }

    // Parse waypoints
    const waypoints = route.routeInstructions
      ? JSON.parse(route.routeInstructions).waypoints || []
      : [];

    // Create route line
    const routeCoords = [
      [route.fromLatitude, route.fromLongitude],
      ...waypoints.map((w) => [w.latitude, w.longitude]),
      [route.toLatitude, route.toLongitude],
    ];

    routeLayerRef.current = L.polyline(routeCoords, {
      color: '#2196F3',
      weight: 5,
      opacity: 0.7,
      dashArray: route.isAccessible ? '10, 5' : null,
    }).addTo(mapInstanceRef.current);

    // Add start marker
    const startIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: #4CAF50;
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          <div style="
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            transform: rotate(45deg);
            color: white;
            font-weight: bold;
          ">A</div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    L.marker([route.fromLatitude, route.fromLongitude], { icon: startIcon })
      .addTo(mapInstanceRef.current)
      .bindPopup(`<strong>Start:</strong> ${route.fromLocationName || 'Starting Point'}`);

    // Add end marker
    const endIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: #F44336;
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          <div style="
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            transform: rotate(45deg);
            color: white;
            font-weight: bold;
          ">B</div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    L.marker([route.toLatitude, route.toLongitude], { icon: endIcon })
      .addTo(mapInstanceRef.current)
      .bindPopup(`<strong>Destination:</strong> ${route.toLocationName || 'Destination'}`);

    // Fit bounds to show entire route
    mapInstanceRef.current.fitBounds(routeLayerRef.current.getBounds(), {
      padding: [50, 50],
    });
  }, [route]);

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
        },
      }}
    />
  );
}

export default RouteMap;