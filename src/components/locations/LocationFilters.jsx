import React from 'react';
import { useBuildings } from '../../hooks/useBuildings';
import { useLocationTypes } from '../../hooks/useLocations';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Paper,
  Grid,
  FormControlLabel,
  Switch,
  Chip,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

function LocationFilters({ filters, onFilterChange }) {
  const { data: buildings = [] } = useBuildings();
  const { data: locationTypes = [] } = useLocationTypes();

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      buildingId: '',
      locationType: '',
      isAccessible: false,
      status: '',
    });
  };

  const activeFilterCount = Object.values(filters).filter((v) => v && v !== '').length;

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <Chip label={`${activeFilterCount} active`} size="small" color="primary" />
          )}
        </Box>
        {activeFilterCount > 0 && (
          <Chip label="Clear all" size="small" onClick={clearFilters} onDelete={clearFilters} />
        )}
      </Box>

      <Grid container spacing={2} alignItems="center">
        {/* Search */}
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            placeholder="Search locations..."
            value={filters.search || ''}
            onChange={handleChange('search')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Building Filter */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Building</InputLabel>
            <Select
              value={filters.buildingId || ''}
              onChange={handleChange('buildingId')}
              label="Building"
            >
              <MenuItem value="">All Buildings</MenuItem>
              {buildings.map((building) => (
                <MenuItem key={building.buildingId} value={building.buildingId}>
                  {building.buildingName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Location Type Filter */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={filters.locationType || ''}
              onChange={handleChange('locationType')}
              label="Type"
            >
              <MenuItem value="">All Types</MenuItem>
              {locationTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Status Filter */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status || ''}
              onChange={handleChange('status')}
              label="Status"
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="Occupied">Occupied</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Accessibility Filter */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControlLabel
            control={
              <Switch
                checked={filters.isAccessible || false}
                onChange={handleChange('isAccessible')}
              />
            }
            label="Accessible Only"
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

export default LocationFilters;