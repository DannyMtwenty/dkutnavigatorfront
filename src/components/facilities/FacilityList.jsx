import React from 'react';
import { Grid } from '@mui/material';
import FacilityCard from './FacilityCard';

function FacilityList({ facilities }) {
  return (
    <Grid container spacing={3}>
      {facilities.map((facility) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={facility.facilityId}>
          <FacilityCard facility={facility} />
        </Grid>
      ))}
    </Grid>
  );
}

export default FacilityList;