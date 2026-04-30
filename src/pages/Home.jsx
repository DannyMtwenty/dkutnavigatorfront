import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Paper,
  alpha,
} from '@mui/material';
import {
  Business as BuildingIcon,
  LocationOn as LocationIcon,
  LocalHospital as FacilityIcon,
  Map as MapIcon,
  Search as SearchIcon,
  TrendingUp as AnalyticsIcon,
  School as AcademicIcon,
  Home as HostelIcon,
  Restaurant as DiningIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';

const statsCards = [
  {
    title: '56',
    subtitle: 'Total Buildings',
    icon: <BuildingIcon sx={{ fontSize: 40 }} />,
    color: '#4CAF50',
    bgColor: '#E8F5E9',
  },
  {
    title: '12',
    subtitle: 'Academic',
    icon: <AcademicIcon sx={{ fontSize: 40 }} />,
    color: '#2196F3',
    bgColor: '#E3F2FD',
  },
  {
    title: '8',
    subtitle: 'Hostels',
    icon: <HostelIcon sx={{ fontSize: 40 }} />,
    color: '#9C27B0',
    bgColor: '#F3E5F5',
  },
  {
    title: '15',
    subtitle: 'Other Facilities',
    icon: <DiningIcon sx={{ fontSize: 40 }} />,
    color: '#FF9800',
    bgColor: '#FFF3E0',
  },
];

const features = [
  {
    title: 'Buildings',
    description: 'Explore all campus buildings and facilities',
    icon: <BuildingIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
    path: '/buildings',
    color: '#1B5E20',
  },
  {
    title: 'Interactive Map',
    description: 'Navigate the campus with our interactive map',
    icon: <MapIcon sx={{ fontSize: 60, color: 'warning.main' }} />,
    path: '/map',
    color: '#F57C00',
  },
  {
    title: 'Locations',
    description: 'Find classrooms, offices, and points of interest',
    icon: <LocationIcon sx={{ fontSize: 60, color: 'success.main' }} />,
    path: '/locations',
    color: '#2E7D32',
  },
  {
    title: 'Facilities',
    description: 'Discover campus amenities and services',
    icon: <FacilityIcon sx={{ fontSize: 60, color: 'error.main' }} />,
    path: '/facilities',
    color: '#D32F2F',
  },
  {
    title: 'Quick Search',
    description: 'Quickly find any location on campus',
    icon: <SearchIcon sx={{ fontSize: 60, color: 'info.main' }} />,
    path: '/search',
    color: '#0288D1',
  },
  {
    title: 'Analytics',
    description: 'View campus usage statistics and trends',
    icon: <AnalyticsIcon sx={{ fontSize: 60, color: 'secondary.main' }} />,
    path: '/analytics',
    color: '#7B1FA2',
  },
];

function Home() {
  return (
    <Box>
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #4CAF50 100%)',
          borderRadius: 3,
          p: 4,
          mb: 4,
          color: 'white',
        }}
      >
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Welcome to DKUT Navigator
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.95, mb: 3, maxWidth: 600 }}>
          Your comprehensive guide to navigating Dedan Kimathi University of Technology campus
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            component={Link}
            to="/map"
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'grey.100',
              },
            }}
            endIcon={<ArrowIcon />}
          >
            Explore Map
          </Button>
          <Button
            component={Link}
            to="/buildings"
            variant="outlined"
            size="large"
            sx={{
              borderColor: 'white',
              color: 'white',
              '&:hover': {
                borderColor: 'white',
                bgcolor: alpha('#FFFFFF', 0.1),
              },
            }}
          >
            View Buildings
          </Button>
        </Box>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={6} sm={6} md={3} key={index}>
            <Card
              className="stats-card"
              sx={{
                height: '100%',
                bgcolor: stat.bgColor,
                border: 'none',
                boxShadow: 'none',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                </Box>
                <Typography variant="h4" fontWeight={700} color={stat.color}>
                  {stat.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Features Grid */}
      <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
        Explore Features
      </Typography>

      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              className="building-card"
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography gutterBottom variant="h6" component="h2" fontWeight={600}>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {feature.description}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  component={Link}
                  to={feature.path}
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: feature.color,
                    '&:hover': {
                      bgcolor: feature.color,
                      filter: 'brightness(0.9)',
                    },
                  }}
                  endIcon={<ArrowIcon />}
                >
                  Explore
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Tips */}
      <Paper
        elevation={0}
        sx={{
          mt: 4,
          p: 3,
          bgcolor: alpha('#4CAF50', 0.1),
          borderLeft: '4px solid',
          borderColor: 'success.main',
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600} gutterBottom color="success.dark">
          💡 Quick Tip
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Long press on the map to set your starting location and get directions to any building on campus.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Home;