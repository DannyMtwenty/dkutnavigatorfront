import React from 'react';
import { Grid } from '@mui/material';
import BuildingCard from './BuildingCard';

function BuildingList({ buildings, onEdit, onDelete, showActions = false }) {
  return (
    <Grid container spacing={3}>
      {buildings.map((building) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={building.buildingId}>
          <BuildingCard
            building={building}
            onEdit={onEdit}
            onDelete={onDelete}
            showActions={showActions}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default BuildingList;