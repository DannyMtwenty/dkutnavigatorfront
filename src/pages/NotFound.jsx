import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Typography, Button } from '@mui/material'

function NotFound() {
  return (
    <Box textAlign="center" mt={8}>
      <Typography variant="h1" color="primary">404</Typography>
      <Typography variant="h4" gutterBottom>Page Not Found</Typography>
      <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
        Go Home
      </Button>
    </Box>
  )
}

export default NotFound