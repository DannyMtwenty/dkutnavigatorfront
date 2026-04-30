import React from 'react';
import { Grid } from '@mui/material';
import LocationCard from './LocationCard';

function LocationList({ locations, onEdit, onDelete, showActions = false }) {
  return (
    <Grid container spacing={3}>
      {locations.map((location) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={location.locationId}>
          <LocationCard
            location={location}
            onEdit={onEdit}
            onDelete={onDelete}
            showActions={showActions}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default LocationList;