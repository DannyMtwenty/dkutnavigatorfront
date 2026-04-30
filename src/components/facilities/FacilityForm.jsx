import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocations } from '../../hooks/useLocations';
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
  Chip,
} from '@mui/material';

const FACILITY_TYPES = ['Restroom', 'Cafeteria', 'Library', 'Parking', 'ATM', 'Medical', 'Gym'];

const AMENITIES_OPTIONS = [
  'WiFi',
  'Air Conditioning',
  'Wheelchair Access',
  'Parking',
  'Security',
  '24/7 Access',
  'Vending Machines',
  'Water Cooler',
];

function FacilityForm({ open, onClose, onSubmit, initialData = null }) {
  const { data: locations = [] } = useLocations();
  const [selectedAmenities, setSelectedAmenities] = React.useState([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: initialData || {
      locationId: '',
      facilityType: '',
      name: '',
      description: '',
      operatingHours: '',
      isAccessible: false,
      amenities: '',
      imageUrl: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      if (initialData.amenities) {
        try {
          setSelectedAmenities(JSON.parse(initialData.amenities));
        } catch (e) {
          setSelectedAmenities([]);
        }
      }
    }
  }, [initialData, reset]);

  const handleAmenityToggle = (amenity) => {
    setSelectedAmenities((prev) => {
      const newAmenities = prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity];
      setValue('amenities', JSON.stringify(newAmenities));
      return newAmenities;
    });
  };

  const handleFormSubmit = async (data) => {
    const formattedData = {
      ...data,
      locationId: parseInt(data.locationId),
      amenities: JSON.stringify(selectedAmenities),
    };

    await onSubmit(formattedData);
    reset();
    setSelectedAmenities([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
          {initialData ? 'Edit Facility' : 'Create New Facility'}
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            {/* Location */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.locationId}>
                <InputLabel>Location *</InputLabel>
                <Select
                  {...register('locationId', { required: 'Location is required' })}
                  defaultValue=""
                  label="Location *"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">Select Location</MenuItem>
                  {locations.map((location) => (
                    <MenuItem key={location.locationId} value={location.locationId}>
                      {location.locationName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.locationId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {errors.locationId.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Facility Type */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.facilityType}>
                <InputLabel>Facility Type *</InputLabel>
                <Select
                  {...register('facilityType', { required: 'Facility type is required' })}
                  defaultValue=""
                  label="Facility Type *"
                  sx={{ borderRadius: 2 }}
                >
                  {FACILITY_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {errors.facilityType && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {errors.facilityType.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Name */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Facility Name"
                {...register('name', { required: 'Facility name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
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

            {/* Operating Hours */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Operating Hours"
                placeholder="e.g., 8:00 AM - 5:00 PM"
                {...register('operatingHours')}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            {/* Image URL */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Image URL"
                {...register('imageUrl')}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            {/* Amenities */}
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
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Amenities
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                  Select all amenities available at this facility
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {AMENITIES_OPTIONS.map((amenity) => (
                    <Chip
                      key={amenity}
                      label={amenity}
                      onClick={() => handleAmenityToggle(amenity)}
                      color={selectedAmenities.includes(amenity) ? 'primary' : 'default'}
                      variant={selectedAmenities.includes(amenity) ? 'filled' : 'outlined'}
                      sx={{
                        fontWeight: 500,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: selectedAmenities.includes(amenity)
                            ? 'primary.dark'
                            : 'action.hover',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Accessibility */}
            <Grid item xs={12}>
              <Box
                sx={{
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
            disabled={isSubmitting}
            sx={{ textTransform: 'none', px: 3, fontWeight: 600 }}
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Update Facility' : 'Create Facility'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default FacilityForm;