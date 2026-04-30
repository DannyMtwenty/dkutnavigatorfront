import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
} from '@mui/material';

const LOCATION_TYPES = ['Classroom', 'Lab', 'Office', 'Facility', 'Landmark'];

function LocationForm({ open, onClose, onSubmit, initialData = null }) {
  const { data: buildings = [] } = useBuildings();

  const {
    register,
    handleSubmit,
    reset,
    watch,
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

  const selectedBuildingId = watch('buildingId');
  const selectedBuilding = buildings.find((b) => b.buildingId === parseInt(selectedBuildingId));

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data) => {
    const formattedData = {
      ...data,
      buildingId: data.buildingId ? parseInt(data.buildingId) : null,
      floorId: data.floorId ? parseInt(data.floorId) : null,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      capacity: data.capacity ? parseInt(data.capacity) : null,
    };

    await onSubmit(formattedData);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle>
          {initialData ? 'Edit Location' : 'Create New Location'}
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Location Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location Name"
                {...register('locationName', { required: 'Location name is required' })}
                error={!!errors.locationName}
                helperText={errors.locationName?.message}
              />
            </Grid>

            {/* Location Type */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.locationType}>
                <InputLabel>Location Type</InputLabel>
                <Select
                  {...register('locationType', { required: 'Location type is required' })}
                  defaultValue=""
                  label="Location Type"
                >
                  {LOCATION_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Building */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Building</InputLabel>
                <Select {...register('buildingId')} defaultValue="" label="Building">
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
              />
            </Grid>

            {/* Latitude */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Latitude"
                inputProps={{ step: 'any' }}
                {...register('latitude', {
                  required: 'Latitude is required',
                  min: { value: -90, message: 'Invalid latitude' },
                  max: { value: 90, message: 'Invalid latitude' },
                })}
                error={!!errors.latitude}
                helperText={errors.latitude?.message}
              />
            </Grid>

            {/* Longitude */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Longitude"
                inputProps={{ step: 'any' }}
                {...register('longitude', {
                  required: 'Longitude is required',
                  min: { value: -180, message: 'Invalid longitude' },
                  max: { value: 180, message: 'Invalid longitude' },
                })}
                error={!!errors.longitude}
                helperText={errors.longitude?.message}
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

            {/* Capacity */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Capacity"
                {...register('capacity', {
                  min: { value: 0, message: 'Must be at least 0' },
                })}
                error={!!errors.capacity}
                helperText={errors.capacity?.message}
              />
            </Grid>

            {/* Accessibility */}
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Switch {...register('isAccessible')} />}
                label="Wheelchair Accessible"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default LocationForm;