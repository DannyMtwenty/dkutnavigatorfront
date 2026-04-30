import React from 'react';
import { useFacilityTypes } from '../../hooks/useFacilities';
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
  Typography,
} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';

function FacilityFilters({ filters, onFilterChange }) {
  const { data: facilityTypes = [] } = useFacilityTypes();

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
      facilityType: '',
      isAccessible: false,
    });
  };

  const activeFilterCount = Object.values(filters).filter((v) => v && v !== '').length;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        mb: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon sx={{ color: 'text.secondary' }} />
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              Filters
            </Typography>
            {activeFilterCount > 0 && (
              <Typography variant="caption" color="text.secondary">
                {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
              </Typography>
            )}
          </Box>
        </Box>
        {activeFilterCount > 0 && (
          <Chip
            label="Clear all"
            size="small"
            onClick={clearFilters}
            onDelete={clearFilters}
            sx={{ fontWeight: 500 }}
          />
        )}
      </Box>

      <Grid container spacing={2} alignItems="center">
        {/* Search */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Search facilities..."
            value={filters.search || ''}
            onChange={handleChange('search')}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                bgcolor: 'grey.50',
              },
            }}
          />
        </Grid>

        {/* Facility Type Filter */}
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel>All Facility Types</InputLabel>
            <Select
              value={filters.facilityType || ''}
              onChange={handleChange('facilityType')}
              label="All Facility Types"
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">All Facility Types</MenuItem>
              {facilityTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
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
                color="primary"
              />
            }
            label={
              <Typography variant="body2" fontWeight={500}>
                Accessible Only
              </Typography>
            }
            sx={{ m: 0 }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

export default FacilityFilters;