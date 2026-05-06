import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Alert,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  MyLocation as MyLocationIcon,
  LocationOn as LocationIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const KENYA_BOUNDS = {
  minLat: -4.678,
  maxLat: 5.506,
  minLng: 33.908,
  maxLng: 41.899,
};

// Default center (DKUT Nyeri)
const DEFAULT_CENTER = [-0.4175, 36.95];

function BuildingForm({ open, onClose, onSubmit, initialData = null }) {
  const [coordinateError, setCoordinateError] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [marker, setMarker] = useState(null);
  const mapRef = React.useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: initialData || {
      buildingName: '',
      buildingCode: '',
      description: '',
      latitude: '',
      longitude: '',
      address: '',
      floorsCount: 1,
      isAccessible: false,
      hasElevator: false,
      hasRamp: false,
      imageFile: null,
    },
  });

  const latitude = watch('latitude');
  const longitude = watch('longitude');

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        imageFile: null,
      });
    } else {
      reset({
        buildingName: '',
        buildingCode: '',
        description: '',
        latitude: '',
        longitude: '',
        address: '',
        floorsCount: 1,
        isAccessible: false,
        hasElevator: false,
        hasRamp: false,
        imageFile: null,
      });
    }
  }, [initialData, reset]);

  // Initialize map when map view is shown
  useEffect(() => {
    if (showMap && mapRef.current && !mapInstance) {
      const lat = parseFloat(latitude) || DEFAULT_CENTER[0];
      const lng = parseFloat(longitude) || DEFAULT_CENTER[1];

      const map = L.map(mapRef.current).setView([lat, lng], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Create custom marker icon
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: #1B5E20;
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
            "></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      // Add initial marker if coordinates exist
      if (latitude && longitude) {
        const newMarker = L.marker([lat, lng], { 
          icon: customIcon,
          draggable: true 
        }).addTo(map);

        newMarker.on('dragend', (e) => {
          const position = e.target.getLatLng();
          updateCoordinates(position.lat, position.lng);
        });

        setMarker(newMarker);
      }

      // Click on map to place/move marker
      map.on('click', (e) => {
        updateCoordinates(e.latlng.lat, e.latlng.lng);

        if (marker) {
          marker.setLatLng(e.latlng);
        } else {
          const newMarker = L.marker(e.latlng, { 
            icon: customIcon,
            draggable: true 
          }).addTo(map);

          newMarker.on('dragend', (event) => {
            const position = event.target.getLatLng();
            updateCoordinates(position.lat, position.lng);
          });

          setMarker(newMarker);
        }
      });

      setMapInstance(map);

      // Cleanup
      return () => {
        map.remove();
        setMapInstance(null);
        setMarker(null);
      };
    }
  }, [showMap]);

  // Update marker position when coordinates change externally
  useEffect(() => {
    if (marker && latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        marker.setLatLng([lat, lng]);
        if (mapInstance) {
          mapInstance.setView([lat, lng], mapInstance.getZoom());
        }
      }
    }
  }, [latitude, longitude, marker, mapInstance]);

  // Validate Kenya boundaries
  useEffect(() => {
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);

      if (!isNaN(lat) && !isNaN(lng)) {
        if (
          lat < KENYA_BOUNDS.minLat ||
          lat > KENYA_BOUNDS.maxLat ||
          lng < KENYA_BOUNDS.minLng ||
          lng > KENYA_BOUNDS.maxLng
        ) {
          setCoordinateError(
            'Coordinates are outside Kenya boundaries. Please select a location within Kenya.'
          );
        } else {
          setCoordinateError('');
        }
      }
    }
  }, [latitude, longitude]);

  const updateCoordinates = (lat, lng) => {
    setValue('latitude', lat.toFixed(8));
    setValue('longitude', lng.toFixed(8));
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Check if within Kenya
          if (
            lat >= KENYA_BOUNDS.minLat &&
            lat <= KENYA_BOUNDS.maxLat &&
            lng >= KENYA_BOUNDS.minLng &&
            lng <= KENYA_BOUNDS.maxLng
          ) {
            updateCoordinates(lat, lng);
            
            // Update map view and marker
            if (mapInstance) {
              mapInstance.setView([lat, lng], 16);
              
              if (marker) {
                marker.setLatLng([lat, lng]);
              } else {
                const customIcon = L.divIcon({
                  className: 'custom-marker',
                  html: `
                    <div style="
                      background-color: #1B5E20;
                      width: 32px;
                      height: 32px;
                      border-radius: 50% 50% 50% 0;
                      transform: rotate(-45deg);
                      border: 3px solid white;
                      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    "></div>
                  `,
                  iconSize: [32, 32],
                  iconAnchor: [16, 32],
                });

                const newMarker = L.marker([lat, lng], { 
                  icon: customIcon,
                  draggable: true 
                }).addTo(mapInstance);

                newMarker.on('dragend', (e) => {
                  const position = e.target.getLatLng();
                  updateCoordinates(position.lat, position.lng);
                });

                setMarker(newMarker);
              }
            }

            setCoordinateError('');
          } else {
            setCoordinateError(
              'Your current location is outside Kenya. Please enter coordinates within Kenya manually.'
            );
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setCoordinateError('Unable to get your current location. Please enter coordinates manually or select from map.');
        }
      );
    } else {
      setCoordinateError('Geolocation is not supported by your browser.');
    }
  };

  const handleFormSubmit = async (data) => {
    const formData = new FormData();

    formData.append('buildingName', data.buildingName);
    formData.append('buildingCode', data.buildingCode || '');
    formData.append('description', data.description || '');
    formData.append('latitude', Number(data.latitude));
    formData.append('longitude', Number(data.longitude));
    formData.append('address', data.address || '');
    formData.append('floorsCount', Number(data.floorsCount));
    formData.append('isAccessible', data.isAccessible ? true : false);
    formData.append('hasElevator', data.hasElevator ? true : false);
    formData.append('hasRamp', data.hasRamp ? true : false);

    if (data.imageFile && data.imageFile.length > 0) {
      formData.append('ImageFile', data.imageFile[0]);
    }

    await onSubmit(formData);
    reset();
    setShowMap(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
          {initialData ? 'Edit Building' : 'Create New Building'}
        </DialogTitle>

        <DialogContent>
          {/* Kenya Bounds Info */}
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            <Typography variant="body2" fontWeight={500}>
              📍 Building must be located within Kenya
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Latitude: {KENYA_BOUNDS.minLat} to {KENYA_BOUNDS.maxLat} • Longitude:{' '}
              {KENYA_BOUNDS.minLng} to {KENYA_BOUNDS.maxLng}
            </Typography>
          </Alert>

          {coordinateError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {coordinateError}
            </Alert>
          )}

          <Grid container spacing={2.5}>
            {/* Building Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Building Name"
                {...register('buildingName', {
                  required: 'Building name is required',
                })}
                error={!!errors.buildingName}
                helperText={errors.buildingName?.message}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            {/* Building Code */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Building Code"
                {...register('buildingCode')}
                error={!!errors.buildingCode}
                helperText={errors.buildingCode?.message}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                {...register('description')}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            {/* Coordinates Section */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  bgcolor: 'grey.50',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Coordinates (Kenya Only)
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Use my current location">
                      <Button
                        size="small"
                        startIcon={<MyLocationIcon />}
                        onClick={handleGetCurrentLocation}
                        sx={{ textTransform: 'none' }}
                      >
                        My Location
                      </Button>
                    </Tooltip>
                    <Button
                      size="small"
                      variant={showMap ? 'contained' : 'outlined'}
                      startIcon={<LocationIcon />}
                      onClick={() => setShowMap(!showMap)}
                      sx={{ textTransform: 'none' }}
                    >
                      {showMap ? 'Hide Map' : 'Select from Map'}
                    </Button>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  {/* Latitude */}
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="latitude"
                      control={control}
                      rules={{
                        required: 'Latitude is required',
                        validate: (value) => {
                          const num = parseFloat(value);
                          if (isNaN(num)) return 'Please enter a valid number';
                          if (num < KENYA_BOUNDS.minLat || num > KENYA_BOUNDS.maxLat) {
                            return `Latitude must be between ${KENYA_BOUNDS.minLat} and ${KENYA_BOUNDS.maxLat}`;
                          }
                          return true;
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Latitude"
                          placeholder="e.g., -0.4175"
                          error={!!error}
                          helperText={
                            error?.message || (
                              <span style={{ fontSize: '0.7rem' }}>
                                Range: {KENYA_BOUNDS.minLat} to {KENYA_BOUNDS.maxLat}
                              </span>
                            )
                          }
                          sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' },
                          }}
                          inputProps={{
                            inputMode: 'decimal',
                            pattern: '-?[0-9]*\\.?[0-9]*',
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* Longitude */}
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="longitude"
                      control={control}
                      rules={{
                        required: 'Longitude is required',
                        validate: (value) => {
                          const num = parseFloat(value);
                          if (isNaN(num)) return 'Please enter a valid number';
                          if (num < KENYA_BOUNDS.minLng || num > KENYA_BOUNDS.maxLng) {
                            return `Longitude must be between ${KENYA_BOUNDS.minLng} and ${KENYA_BOUNDS.maxLng}`;
                          }
                          return true;
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Longitude"
                          placeholder="e.g., 36.9500"
                          error={!!error}
                          helperText={
                            error?.message || (
                              <span style={{ fontSize: '0.7rem' }}>
                                Range: {KENYA_BOUNDS.minLng} to {KENYA_BOUNDS.maxLng}
                              </span>
                            )
                          }
                          sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' },
                          }}
                          inputProps={{
                            inputMode: 'decimal',
                            pattern: '-?[0-9]*\\.?[0-9]*',
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                {/* Interactive Map */}
                {showMap && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                      💡 Click on the map to select location or drag the marker
                    </Typography>
                    <Box
                      ref={mapRef}
                      sx={{
                        height: 400,
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '2px solid',
                        borderColor: 'primary.main',
                        '& .leaflet-container': {
                          height: '100%',
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Box>
                )}

                {/* Example Coordinates */}
                <Box sx={{ mt: 2, p: 1.5, bgcolor: 'white', borderRadius: 1, border: '1px dashed', borderColor: 'divider' }}>
                  <Typography variant="caption" color="text.secondary" display="block" fontWeight={600} mb={0.5}>
                    💡 Example Kenya Coordinates:
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    • Nairobi: -1.286389, 36.817223
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    • DKUT (Nyeri): -0.4175, 36.9500
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    • Mombasa: -4.043477, 39.658871
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Address */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                {...register('address')}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            {/* Number of Floors */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Number of Floors"
                {...register('floorsCount', {
                  required: 'Floors count is required',
                  valueAsNumber: true,
                  min: { value: 0, message: 'Must be at least 0' },
                })}
                error={!!errors.floorsCount}
                helperText={errors.floorsCount?.message}
                inputProps={{ min: 0, step: 1 }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            {/* Building Image */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="file"
                label="Building Image"
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: { accept: 'image/*' },
                }}
                {...register('imageFile')}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            {/* Accessibility Features */}
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  bgcolor: 'grey.50',
                  borderRadius: 2,
                }}
              >
                <FormControlLabel
                  control={<Switch {...register('isAccessible')} color="primary" />}
                  label={
                    <Typography variant="body2" fontWeight={500}>
                      Wheelchair Accessible
                    </Typography>
                  }
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  bgcolor: 'grey.50',
                  borderRadius: 2,
                }}
              >
                <FormControlLabel
                  control={<Switch {...register('hasElevator')} color="primary" />}
                  label={
                    <Typography variant="body2" fontWeight={500}>
                      Has Elevator
                    </Typography>
                  }
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  bgcolor: 'grey.50',
                  borderRadius: 2,
                }}
              >
                <FormControlLabel
                  control={<Switch {...register('hasRamp')} color="primary" />}
                  label={
                    <Typography variant="body2" fontWeight={500}>
                      Has Ramp
                    </Typography>
                  }
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} sx={{ textTransform: 'none', px: 3 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || !!coordinateError}
            sx={{ textTransform: 'none', px: 3, fontWeight: 600 }}
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Update Building' : 'Create Building'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default BuildingForm;