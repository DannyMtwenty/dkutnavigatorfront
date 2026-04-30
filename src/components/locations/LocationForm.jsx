import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useBuildings } from '../../hooks/useBuildings';
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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { MyLocation as MyLocationIcon } from '@mui/icons-material';

const LOCATION_TYPES = ['Classroom', 'Lab', 'Office', 'Facility', 'Landmark'];

// Kenya boundaries
const KENYA_BOUNDS = {
  minLat: -4.678,
  maxLat: 5.506,
  minLng: 33.908,
  maxLng: 41.899,
};

function LocationForm({ open, onClose, onSubmit, initialData = null }) {
  const { data: buildings = [] } = useBuildings();
  const [coordinateError, setCoordinateError] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

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
      buildingId: '',
      floorId: '',
      locationName: '',
      locationType: '',
      roomNumber: '',
      latitude: '',
      longitude: '',
      description: '',
      capacity: '',
      isAccessible: false,
    },
  });

  const latitude = watch('latitude');
  const longitude = watch('longitude');

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

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
            'Coordinates are outside Kenya boundaries. Please ensure the location is within Kenya.'
          );
        } else {
          setCoordinateError('');
        }
      }
    }
  }, [latitude, longitude]);

  // Get user's current location
  const handleGetCurrentLocation = () => {
    setUseCurrentLocation(true);
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
            setValue('latitude', lat.toFixed(8));
            setValue('longitude', lng.toFixed(8));
            setCoordinateError('');
          } else {
            setCoordinateError(
              'Your current location is outside Kenya. Please enter coordinates within Kenya manually.'
            );
          }
          setUseCurrentLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setCoordinateError('Unable to get your current location. Please enter coordinates manually.');
          setUseCurrentLocation(false);
        }
      );
    } else {
      setCoordinateError('Geolocation is not supported by your browser.');
      setUseCurrentLocation(false);
    }
  };

  // Custom validation function for coordinates
  const validateLatitude = (value) => {
    if (!value) return 'Latitude is required';
    const num = parseFloat(value);
    if (isNaN(num)) return 'Please enter a valid number';
    if (num < KENYA_BOUNDS.minLat || num > KENYA_BOUNDS.maxLat) {
      return `Latitude must be between ${KENYA_BOUNDS.minLat} and ${KENYA_BOUNDS.maxLat} (Kenya bounds)`;
    }
    return true;
  };

  const validateLongitude = (value) => {
    if (!value) return 'Longitude is required';
    const num = parseFloat(value);
    if (isNaN(num)) return 'Please enter a valid number';
    if (num < KENYA_BOUNDS.minLng || num > KENYA_BOUNDS.maxLng) {
      return `Longitude must be between ${KENYA_BOUNDS.minLng} and ${KENYA_BOUNDS.maxLng} (Kenya bounds)`;
    }
    return true;
  };

  const handleFormSubmit = async (data) => {
    const lat = parseFloat(data.latitude);
    const lng = parseFloat(data.longitude);

    // Final validation
    if (isNaN(lat) || isNaN(lng)) {
      setCoordinateError('Please enter valid numeric coordinates.');
      return;
    }

    if (
      lat < KENYA_BOUNDS.minLat ||
      lat > KENYA_BOUNDS.maxLat ||
      lng < KENYA_BOUNDS.minLng ||
      lng > KENYA_BOUNDS.maxLng
    ) {
      setCoordinateError('Please enter valid coordinates within Kenya boundaries.');
      return;
    }

    const formattedData = {
      ...data,
      buildingId: data.buildingId ? parseInt(data.buildingId) : null,
      floorId: data.floorId ? parseInt(data.floorId) : null,
      latitude: lat,
      longitude: lng,
      capacity: data.capacity ? parseInt(data.capacity) : null,
    };

    await onSubmit(formattedData);
    reset();
    setCoordinateError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
          {initialData ? 'Edit Location' : 'Create New Location'}
        </DialogTitle>

        <DialogContent>
          {/* Kenya Bounds Info */}
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            <Typography variant="body2" fontWeight={500}>
              📍 Location must be within Kenya
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
            {/* Location Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location Name"
                {...register('locationName', { required: 'Location name is required' })}
                error={!!errors.locationName}
                helperText={errors.locationName?.message}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            {/* Location Type */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.locationType}>
                <InputLabel>Location Type *</InputLabel>
                <Select
                  {...register('locationType', { required: 'Location type is required' })}
                  defaultValue=""
                  label="Location Type *"
                  sx={{ borderRadius: 2 }}
                >
                  {LOCATION_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {errors.locationType && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {errors.locationType.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Building */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Building</InputLabel>
                <Select
                  {...register('buildingId')}
                  defaultValue=""
                  label="Building"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">None</MenuItem>
                  {buildings.map((building) => (
                    <MenuItem key={building.buildingId} value={building.buildingId}>
                      {building.buildingName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Room Number */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Room Number"
                {...register('roomNumber')}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            {/* Coordinates Section */}
            <Grid item xs={12}>
              <Box
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
                  <Button
                    size="small"
                    startIcon={<MyLocationIcon />}
                    onClick={handleGetCurrentLocation}
                    disabled={useCurrentLocation}
                    sx={{ textTransform: 'none' }}
                  >
                    {useCurrentLocation ? 'Getting Location...' : 'Use My Location'}
                  </Button>
                </Box>

                <Grid container spacing={2}>
                  {/* Latitude - Text Input with Validation */}
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="latitude"
                      control={control}
                      rules={{ validate: validateLatitude }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Latitude"
                          placeholder="e.g., -0.39746450"
                          error={!!error}
                          helperText={
                            error?.message || (
                              <span style={{ fontSize: '0.7rem' }}>
                                Valid range: {KENYA_BOUNDS.minLat} to {KENYA_BOUNDS.maxLat}
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

                  {/* Longitude - Text Input with Validation */}
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="longitude"
                      control={control}
                      rules={{ validate: validateLongitude }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Longitude"
                          placeholder="e.g., 36.96484290"
                          error={!!error}
                          helperText={
                            error?.message || (
                              <span style={{ fontSize: '0.7rem' }}>
                                Valid range: {KENYA_BOUNDS.minLng} to {KENYA_BOUNDS.maxLng}
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
              </Box>
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

            {/* Capacity */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Capacity"
                placeholder="Number of people"
                inputProps={{ min: 0, step: 1 }}
                {...register('capacity', {
                  min: { value: 0, message: 'Must be at least 0' },
                  validate: (value) => {
                    if (value && parseInt(value) < 0) return 'Capacity must be 0 or greater';
                    return true;
                  },
                })}
                error={!!errors.capacity}
                helperText={errors.capacity?.message}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            {/* Accessibility */}
            <Grid item xs={12} sm={6}>
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
            {isSubmitting ? 'Saving...' : initialData ? 'Update Location' : 'Create Location'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default LocationForm;