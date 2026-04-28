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
} from '@mui/material';

const KENYA_BOUNDS = {
  minLat: -4.9,
  maxLat: 5.1,
  minLng: 33.9,
  maxLng: 42.1,
};

function BuildingForm({ open, onClose, onSubmit, initialData = null }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue, // ✅ FIXED
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
      imageUrl: null,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        imageFile: null, // Reset file input
      });
    }
    else{
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

  const latitude = watch('latitude');
  const longitude = watch('longitude');

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
     
    //console.log('Form Data:');
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    await onSubmit(formData);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <DialogTitle>
          {initialData ? 'Edit Building' : 'Create New Building'}
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                label="Building Name"
                {...register('buildingName', {
                  required: 'Building name is required',
                })}
                error={!!errors.buildingName}
                helperText={errors.buildingName?.message}
              />
            </Grid>

            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                label="Building Code"
                {...register('buildingCode')}
                error={!!errors.buildingCode}
                helperText={errors.buildingCode?.message}
              />
            </Grid>

            <Grid xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                {...register('description')}
              />
            </Grid>

            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                type="text"
                label="Latitude"
                inputProps={{ inputMode: 'decimal' }}
                {...register('latitude', {
                  required: 'Latitude is required',
                  setValueAs: (value) =>
                    value === '' ? undefined : Number(value),
                  validate: (value) => {
                    if (Number.isNaN(value)) {
                      return 'Latitude must be a valid number';
                    }

                    if (
                      value < KENYA_BOUNDS.minLat ||
                      value > KENYA_BOUNDS.maxLat
                    ) {
                      return 'Latitude must be within Kenya';
                    }

                    return true;
                  },
                })}
                error={!!errors.latitude}
                helperText={errors.latitude?.message}
              />
            </Grid>

            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                type="text"
                label="Longitude"
                inputProps={{ inputMode: 'decimal' }}
                {...register('longitude', {
                  required: 'Longitude is required',
                  setValueAs: (value) =>
                    value === '' ? undefined : Number(value),
                  validate: (value) => {
                    if (Number.isNaN(value)) {
                      return 'Longitude must be a valid number';
                    }

                    if (
                      value < KENYA_BOUNDS.minLng ||
                      value > KENYA_BOUNDS.maxLng
                    ) {
                      return 'Longitude must be within Kenya';
                    }

                    return true;
                  },
                })}
                error={!!errors.longitude}
                helperText={errors.longitude?.message}
              />
            </Grid>
{/* 
            <Grid xs={12}>
              <LocationPicker
                latitude={Number(latitude)}
                longitude={Number(longitude)}
                setValue={setValue}
              />
            </Grid>*/}

            <Grid xs={12}>
              <TextField
                fullWidth
                label="Address"
                {...register('address')}
              />
            </Grid> 

            <Grid xs={12} sm={6}>
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
              />
            </Grid>

         
            <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
              fullWidth
              type="file"
              label="Building Image"
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { accept: 'image/*' },
              }}
              {...register('imageFile')}
            />
          </Grid>

            <Grid xs={12} sm={4}>
              <FormControlLabel
                control={<Switch {...register('isAccessible')} />}
                label="Wheelchair Accessible"
              />
            </Grid>

            <Grid xs={12} sm={4}>
              <FormControlLabel
                control={<Switch {...register('hasElevator')} />}
                label="Has Elevator"
              />
            </Grid>

            <Grid xs={12} sm={4}>
              <FormControlLabel
                control={<Switch {...register('hasRamp')} />}
                label="Has Ramp"
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

export default BuildingForm;