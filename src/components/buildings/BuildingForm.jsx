import React, { useEffect } from 'react';
import LocationPicker from './../locations/LocationPicker';
import { useForm } from 'react-hook-form';
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
} from '@mui/material';

function BuildingForm({ open, onClose, onSubmit, initialData = null }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
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
      imageUrl: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data) => {
    // Convert string numbers to actual numbers
    const formattedData = {
      ...data,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      floorsCount: parseInt(data.floorsCount),
    };

    await onSubmit(formattedData);
    reset();
    onClose();
  };

  const KENYA_BOUNDS = {
  minLat: -4.9,
  maxLat: 5.1,
  minLng: 33.9,
  maxLng: 42.1,
};
const latitude = watch('latitude');
const longitude = watch('longitude');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle>
          {initialData ? 'Edit Building' : 'Create New Building'}
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Building Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Building Name"
                {...register('buildingName', { required: 'Building name is required' })}
                error={!!errors.buildingName}
                helperText={errors.buildingName?.message}
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
              />
            </Grid>

            {/* Latitude */}
          <Grid item xs={12} sm={6}>
            <TextField
                fullWidth
                type="text"
                label="Latitude"
                inputProps={{ inputMode: 'decimal' }}
                {...register('latitude', {
                required: 'Latitude is required',
                setValueAs: (value) => value === '' ? undefined : Number(value),
                validate: (value) => {
                    if (isNaN(value)) return 'Latitude must be a valid number';

                    if (value < KENYA_BOUNDS.minLat || value > KENYA_BOUNDS.maxLat) {
                    return 'Latitude must be within Kenya';
                    }

                    return true;
                },
                })}
                error={!!errors.latitude}
                helperText={errors.latitude?.message}
            />
            </Grid>
            <Grid item xs={12}>
            <LocationPicker
                latitude={Number(latitude)}
                longitude={Number(longitude)}
                setValue={setValue}
            />
            </Grid>
            {/* Longitude */}
           <Grid item xs={12} sm={6}>
            <TextField
                fullWidth
                type="text"
                label="Longitude"
                inputProps={{ inputMode: 'decimal' }}
                {...register('longitude', {
                required: 'Longitude is required',
                setValueAs: (value) => value === '' ? undefined : Number(value),
                validate: (value) => {
                    if (isNaN(value)) return 'Longitude must be a valid number';

                    if (value < KENYA_BOUNDS.minLng || value > KENYA_BOUNDS.maxLng) {
                    return 'Longitude must be within Kenya';
                    }

                    return true;
                },
                })}
                error={!!errors.longitude}
                helperText={errors.longitude?.message}
            />
            </Grid>
            <Grid item xs={12}>
            <LocationPicker
                latitude={Number(latitude)}
                longitude={Number(longitude)}
                setValue={setValue}
            />
            </Grid>

            {/* Address */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                {...register('address')}
              />
            </Grid>

            {/* Floors Count */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Number of Floors"
                {...register('floorsCount', {
                  required: 'Floors count is required',
                  min: { value: 0, message: 'Must be at least 0' },
                })}
                error={!!errors.floorsCount}
                helperText={errors.floorsCount?.message}
              />
            </Grid>

            {/* Image URL */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Image URL"
                {...register('imageUrl')}
              />
            </Grid>

            {/* Switches */}
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={<Switch {...register('isAccessible')} />}
                label="Wheelchair Accessible"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={<Switch {...register('hasElevator')} />}
                label="Has Elevator"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={<Switch {...register('hasRamp')} />}
                label="Has Ramp"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default BuildingForm;