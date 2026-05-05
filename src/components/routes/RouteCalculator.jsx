import React, { useState } from 'react';
import { useLocations } from '../../hooks/useLocations';
import {
  Paper,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  FormControlLabel,
  Switch,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  SwapVert as SwapIcon,
  MyLocation as MyLocationIcon,
  LocationOn as LocationIcon,
  Directions as DirectionsIcon,
} from '@mui/icons-material';

function RouteCalculator({ onCalculate, calculating }) {
  const { data: locations = [] } = useLocations();
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [accessible, setAccessible] = useState(false);
  const [error, setError] = useState('');

  const handleSwapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const handleCalculate = () => {
    if (!fromLocation || !toLocation) {
      setError('Please select both start and destination locations');
      return;
    }

    if (fromLocation === toLocation) {
      setError('Start and destination cannot be the same');
      return;
    }

    setError('');
    const from = locations.find((l) => l.locationId === fromLocation);
    const to = locations.find((l) => l.locationId === toLocation);

    if (from && to) {
      onCalculate({
        fromLat: from.latitude,
        fromLng: from.longitude,
        toLat: to.latitude,
        toLng: to.longitude,
        accessible,
        fromLocationName: from.locationName,
        toLocationName: to.locationName,
      });
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Find nearest location to current position
          let nearest = null;
          let minDistance = Infinity;

          locations.forEach((loc) => {
            const distance = Math.sqrt(
              Math.pow(loc.latitude - position.coords.latitude, 2) +
                Math.pow(loc.longitude - position.coords.longitude, 2)
            );
            if (distance < minDistance) {
              minDistance = distance;
              nearest = loc;
            }
          });

          if (nearest) {
            setFromLocation(nearest.locationId);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Could not get your current location');
        }
      );
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Calculate Route
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Select your starting point and destination to find the best route
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={2.5}>
        {/* From Location */}
        <Box>
          <FormControl fullWidth>
            <InputLabel>Starting Point</InputLabel>
            <Select
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              label="Starting Point"
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">
                <em>Select starting location</em>
              </MenuItem>
              {locations.map((location) => (
                <MenuItem key={location.locationId} value={location.locationId}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MyLocationIcon sx={{ fontSize: 16, color: 'success.main' }} />
                    {location.locationName}
                    {location.buildingName && (
                      <Typography variant="caption" color="text.secondary">
                        ({location.buildingName})
                      </Typography>
                    )}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            size="small"
            startIcon={<MyLocationIcon />}
            onClick={handleUseCurrentLocation}
            sx={{ mt: 1, textTransform: 'none' }}
          >
            Use My Location
          </Button>
        </Box>

        {/* Swap Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={handleSwapLocations}
            disabled={!fromLocation || !toLocation}
            sx={{
              minWidth: 40,
              width: 40,
              height: 40,
              borderRadius: '50%',
              p: 0,
            }}
          >
            <SwapIcon />
          </Button>
        </Box>

        {/* To Location */}
        <FormControl fullWidth>
          <InputLabel>Destination</InputLabel>
          <Select
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
            label="Destination"
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="">
              <em>Select destination</em>
            </MenuItem>
            {locations.map((location) => (
              <MenuItem key={location.locationId} value={location.locationId}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon sx={{ fontSize: 16, color: 'error.main' }} />
                  {location.locationName}
                  {location.buildingName && (
                    <Typography variant="caption" color="text.secondary">
                      ({location.buildingName})
                    </Typography>
                  )}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider />

        {/* Accessibility Option */}
        <FormControlLabel
          control={
            <Switch checked={accessible} onChange={(e) => setAccessible(e.target.checked)} />
          }
          label={
            <Box>
              <Typography variant="body2" fontWeight={500}>
                Wheelchair Accessible Route
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Find routes with ramps and elevators
              </Typography>
            </Box>
          }
        />

        {/* Calculate Button */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleCalculate}
          disabled={calculating || !fromLocation || !toLocation}
          startIcon={
            calculating ? <CircularProgress size={20} color="inherit" /> : <DirectionsIcon />
          }
          sx={{
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: 'none',
          }}
        >
          {calculating ? 'Calculating...' : 'Find Route'}
        </Button>
      </Stack>
    </Paper>
  );
}

export default RouteCalculator;