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
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

function BuildingFilters({ filters, onFilterChange }) {
  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        {/* Search */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Search buildings..."
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

        {/* Status Filter */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status || ''}
              onChange={handleChange('status')}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
              <MenuItem value="UnderMaintenance">Under Maintenance</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Accessibility Filter */}
        <Grid item xs={12} sm={6} md={3}>
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

        {/* View Mode */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>View</InputLabel>
            <Select
              value={filters.view || 'grid'}
              onChange={handleChange('view')}
              label="View"
            >
              <MenuItem value="grid">Grid</MenuItem>
              <MenuItem value="list">List</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default BuildingFilters;