import React from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Container,
} from '@mui/material'
import {
  Business as BuildingIcon,
  LocationOn as LocationIcon,
  LocalHospital as FacilityIcon,
  Map as MapIcon,
  Search as SearchIcon,
  TrendingUp as AnalyticsIcon,
} from '@mui/icons-material'

const features = [
  {
    title: 'Buildings',
    description: 'Browse all university buildings and facilities',
    icon: <BuildingIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
    path: '/buildings',
    color: '#1976d2',
  },
  {
    title: 'Locations',
    description: 'Find classrooms, offices, and points of interest',
    icon: <LocationIcon sx={{ fontSize: 60, color: 'success.main' }} />,
    path: '/locations',
    color: '#2e7d32',
  },
  {
    title: 'Facilities',
    description: 'Discover campus amenities and services',
    icon: <FacilityIcon sx={{ fontSize: 60, color: 'error.main' }} />,
    path: '/facilities',
    color: '#d32f2f',
  },
  {
    title: 'Interactive Map',
    description: 'Navigate the campus with our interactive map',
    icon: <MapIcon sx={{ fontSize: 60, color: 'warning.main' }} />,
    path: '/map',
    color: '#ed6c02',
  },
  {
    title: 'Search',
    description: 'Quickly find any location on campus',
    icon: <SearchIcon sx={{ fontSize: 60, color: 'info.main' }} />,
    path: '/search',
    color: '#0288d1',
  },
  {
    title: 'Analytics',
    description: 'View campus usage statistics and trends',
    icon: <AnalyticsIcon sx={{ fontSize: 60, color: 'secondary.main' }} />,
    path: '/analytics',
    color: '#9c27b0',
  },
]

function Home() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Welcome to DKUT Campus Navigation
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Your comprehensive guide to navigating Dedan Kimathi University of Technology
        </Typography>

        <Grid container spacing={3} sx={{ mt: 4 }}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={4} key={feature.title}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography gutterBottom variant="h5" component="h2">
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button
                    component={Link}
                    to={feature.path}
                    variant="contained"
                    sx={{ bgcolor: feature.color }}
                  >
                    Explore
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Stats Section */}
        <Box sx={{ mt: 6, p: 4, bgcolor: 'success.main', borderRadius: 2, color: 'white' }}>
          <Typography variant="h4" align="center" gutterBottom>
            Quick Stats
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Typography variant="h3">50+</Typography>
                <Typography variant="body1">Buildings</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Typography variant="h3">500+</Typography>
                <Typography variant="body1">Locations</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Typography variant="h3">100+</Typography>
                <Typography variant="body1">Facilities</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}

export default Home