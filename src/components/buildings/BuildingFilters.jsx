import React from 'react';
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
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import {
  Search as SearchIcon,
  GridView as GridIcon,
  Map as MapIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';

function BuildingFilters({ filters, onFilterChange, viewMode, onViewModeChange }) {
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
      status: '',
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
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Search buildings..."
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

        {/* Category Filter */}
        <Grid item xs={12} sm={6} md={2.5}>
          <FormControl fullWidth size="small">
            <InputLabel>All Categories</InputLabel>
            <Select
              value={filters.category || ''}
              onChange={handleChange('category')}
              label="All Categories"
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">All Categories</MenuItem>
              <MenuItem value="Academic">Academic</MenuItem>
              <MenuItem value="Administration">Administration</MenuItem>
              <MenuItem value="Hostel">Hostel</MenuItem>
              <MenuItem value="Dining">Dining</MenuItem>
              <MenuItem value="Health">Health Services</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Facilities Filter */}
        <Grid item xs={12} sm={6} md={2.5}>
          <FormControl fullWidth size="small">
            <InputLabel>All Facilities</InputLabel>
            <Select
              value={filters.facility || ''}
              onChange={handleChange('facility')}
              label="All Facilities"
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">All Facilities</MenuItem>
              <MenuItem value="Elevator">Elevator</MenuItem>
              <MenuItem value="Parking">Parking</MenuItem>
              <MenuItem value="WiFi">WiFi</MenuItem>
              <MenuItem value="Cafeteria">Cafeteria</MenuItem>
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
            label="Accessible Only"
            sx={{ m: 0 }}
          />
        </Grid>

        {/* Sort Filter */}
        <Grid item xs={12} sm={6} md={1}>
          <FormControl fullWidth size="small">
            <InputLabel>Sort</InputLabel>
            <Select
              value={filters.sort || 'name'}
              onChange={handleChange('sort')}
              label="Sort"
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="name">Name A-Z</MenuItem>
              <MenuItem value="distance">Distance</MenuItem>
              <MenuItem value="popular">Popular</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default BuildingFilters;