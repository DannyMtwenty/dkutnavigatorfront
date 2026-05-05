import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import { API_BASE_URL, isDevelopment } from '../api/axios.config';

function EnvironmentBadge() {
  // Only show in development
  if (!isDevelopment) return null;

  return (
    <Tooltip 
      title={
        <div>
          <div>Environment: {import.meta.env.MODE}</div>
          <div>API: {API_BASE_URL}</div>
        </div>
      }
    >
      <Chip
        label={`DEV MODE`}
        size="small"
        color="warning"
        sx={{
          position: 'fixed',
          bottom: 16,
          left: 16,
          zIndex: 9999,
          fontWeight: 600,
          fontSize: '0.7rem',
        }}
      />
    </Tooltip>
  );
}

export default EnvironmentBadge;