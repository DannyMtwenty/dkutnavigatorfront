import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
//import { ErrorOutline as ErrorIcon } from '@mui/icons-material';
import ErrorIcon from '@mui/icons-material/Error';

function ErrorMessage({ message = 'Something went wrong', onRetry }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        textAlign: 'center',
        bgcolor: 'error.lighter',
        borderRadius: 2,
      }}
    >
      <ErrorIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
      <Typography variant="h6" color="error" gutterBottom>
        Error
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {message}
      </Typography>
      {onRetry && (
        <Button variant="contained" color="error" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </Paper>
  );
}

export default ErrorMessage;