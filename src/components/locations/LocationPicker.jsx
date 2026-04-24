// components/LocationPicker.jsx

import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

const kenyaCenter = [-0.0236, 37.9062];

function ClickPicker({ setValue }) {
  useMapEvents({
    click(e) {
      const lat = Number(e.latlng.lat.toFixed(6));
      const lng = Number(e.latlng.lng.toFixed(6));

      setValue('latitude', lat, { shouldValidate: true });
      setValue('longitude', lng, { shouldValidate: true });
    },
  });

  return null;
}

function LocationPicker({ latitude, longitude, setValue }) {
  const hasCoords = !isNaN(latitude) && !isNaN(longitude);

  return (
    <MapContainer
      center={hasCoords ? [latitude, longitude] : kenyaCenter}
      zoom={hasCoords ? 16 : 6}
      style={{
        height: 350,
        width: '100%',
        borderRadius: 12,
        marginTop: 16,
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ClickPicker setValue={setValue} />

      {hasCoords && (
        <Marker position={[latitude, longitude]} />
      )}
    </MapContainer>
  );
}

export default LocationPicker;