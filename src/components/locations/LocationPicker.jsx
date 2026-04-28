import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from 'react-leaflet';

const kenyaCenter = [-0.0236, 37.9062];

function ResizeMap() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 300);
  }, [map]);

  return null;
}

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
  const hasCoords =
    !Number.isNaN(latitude) &&
    !Number.isNaN(longitude) &&
    latitude !== 0 &&
    longitude !== 0;

  return (
    <div
      style={{
        height: '320px',
        width: '100%',
        marginTop: '12px',
        marginBottom: '16px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #ddd',
      }}
    >
      <MapContainer
        center={hasCoords ? [latitude, longitude] : kenyaCenter}
        zoom={hasCoords ? 17 : 6}
        style={{
          height: '100%',
          width: '100%',
        }}
      >
        <ResizeMap />

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ClickPicker setValue={setValue} />

        {hasCoords && <Marker position={[latitude, longitude]} />}
      </MapContainer>
    </div>
  );
}

export default LocationPicker;