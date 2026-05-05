import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  alpha,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import {
  Route as RouteIcon,
  DirectionsWalk as WalkIcon,
  DirectionsBike as BikeIcon,
  DirectionsCar as CarIcon,
  Accessible as AccessibleIcon,
  MyLocation as MyLocationIcon,
  LocationOn as LocationIcon,
  ArrowForward as ArrowIcon,
  TurnRight as TurnIcon,
  Straight as StraightIcon,
} from '@mui/icons-material';
import RouteCalculator from '../components/routes/RouteCalculator';
import RouteMap from '../components/routes/RouteMap';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useRouteCalculation } from '../hooks/useRoutes';

const statsCards = [
  {
    title: '150+',
    subtitle: 'Available Routes',
    icon: <RouteIcon sx={{ fontSize: 32 }} />,
    color: '#2196F3',
    bgColor: '#E3F2FD',
  },
  {
    title: '85%',
    subtitle: 'Accessible Routes',
    icon: <AccessibleIcon sx={{ fontSize: 32 }} />,
    color: '#4CAF50',
    bgColor: '#E8F5E9',
  },
  {
    title: '5 min',
    subtitle: 'Avg. Walking Time',
    icon: <WalkIcon sx={{ fontSize: 32 }} />,
    color: '#FF9800',
    bgColor: '#FFF3E0',
  },
  {
    title: '2.5 km',
    subtitle: 'Campus Coverage',
    icon: <BikeIcon sx={{ fontSize: 32 }} />,
    color: '#9C27B0',
    bgColor: '#F3E5F5',
  },
];

function Routes() {
  const [calculatedRoute, setCalculatedRoute] = useState(null);
  const routeCalculation = useRouteCalculation();

  const handleCalculateRoute = async (routeData) => {
    try {
      const result = await routeCalculation.mutateAsync(routeData);
      
      // Mock route data (replace with actual API response)
      const mockRoute = {
        fromLatitude: routeData.fromLat,
        fromLongitude: routeData.fromLng,
        toLatitude: routeData.toLat,
        toLongitude: routeData.toLng,
        fromLocationName: routeData.fromLocationName,
        toLocationName: routeData.toLocationName,
        distance: 450, // meters
        estimatedTime: 360, // seconds (6 minutes)
        isAccessible: routeData.accessible,
        routeInstructions: JSON.stringify({
          waypoints: [
            { latitude: routeData.fromLat + 0.001, longitude: routeData.fromLng + 0.001 },
            { latitude: routeData.fromLat + 0.002, longitude: routeData.fromLng + 0.0015 },
          ],
          instructions: [
            { step: 1, instruction: 'Head north on Main Road', distance: 150 },
            { step: 2, instruction: 'Turn right onto Campus Drive', distance: 200 },
            { step: 3, instruction: 'Continue straight for 100m', distance: 100 },
            { step: 4, instruction: 'Destination will be on your left', distance: 0 },
          ],
        }),
      };

      setCalculatedRoute(mockRoute);
    } catch (error) {
      console.error('Route calculation error:', error);
    }
  };

  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const instructions = calculatedRoute?.routeInstructions
    ? JSON.parse(calculatedRoute.routeInstructions).instructions || []
    : [];

  return (
    <Box>
      {/* Header with Stats */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <RouteIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight={700}>
              Routes & Navigation
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Find the best routes between any two locations on campus
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2}>
          {statsCards.map((stat, index) => (
            <Grid item xs={6} sm={6} md={3} key={index}>
              <Card
                elevation={0}
                sx={{
                  bgcolor: stat.bgColor,
                  border: 'none',
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: alpha(stat.color, 0.15),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: stat.color,
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={700} color={stat.color}>
                        {stat.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        {stat.subtitle}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Calculator */}
        <Grid item xs={12} md={4}>
          <RouteCalculator
            onCalculate={handleCalculateRoute}
            calculating={routeCalculation.isPending}
          />

          {/* Quick Routes */}
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              p: 2.5,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Popular Routes
            </Typography>
            <Stack spacing={1} sx={{ mt: 2 }}>
              {[
                { from: 'Main Gate', to: 'Library', time: '5 min', distance: '350m' },
                { from: 'Admin Block', to: 'Engineering', time: '8 min', distance: '550m' },
                { from: 'Hostel A', to: 'Cafeteria', time: '3 min', distance: '200m' },
              ].map((route, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: alpha('#2196F3', 0.05),
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <MyLocationIcon sx={{ fontSize: 14, color: 'success.main' }} />
                    <Typography variant="body2" fontWeight={600}>
                      {route.from}
                    </Typography>
                    <ArrowIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                    <LocationIcon sx={{ fontSize: 14, color: 'error.main' }} />
                    <Typography variant="body2" fontWeight={600}>
                      {route.to}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip label={route.time} size="small" />
                    <Chip label={route.distance} size="small" variant="outlined" />
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Right Column - Map and Instructions */}
        <Grid item xs={12} md={8}>
          {!calculatedRoute ? (
            <Paper
              elevation={0}
              sx={{
                p: 6,
                textAlign: 'center',
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                minHeight: 500,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <RouteIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom fontWeight={600}>
                No Route Selected
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select a starting point and destination to view the route
              </Typography>
            </Paper>
          ) : (
            <>
              {/* Route Summary */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  mb: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        FROM
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        {calculatedRoute.fromLocationName}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center">
                      <Stack direction="row" spacing={2} justifyContent="center">
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Distance
                          </Typography>
                          <Typography variant="h5" fontWeight={700} color="primary.main">
                            {formatDistance(calculatedRoute.distance)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Duration
                          </Typography>
                          <Typography variant="h5" fontWeight={700} color="success.main">
                            {formatDuration(calculatedRoute.estimatedTime)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="right">
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        TO
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        {calculatedRoute.toLocationName}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {/* Map */}
              <Paper
                elevation={0}
                sx={{
                  mb: 3,
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <RouteMap route={calculatedRoute} height="400px" />
              </Paper>

              {/* Turn-by-Turn Instructions */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Turn-by-Turn Directions
                </Typography>
                <List>
                  {instructions.map((inst, index) => (
                    <React.Fragment key={index}>
                      <ListItem sx={{ px: 0, py: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              bgcolor: alpha('#2196F3', 0.1),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'primary.main',
                              fontWeight: 700,
                              fontSize: '0.875rem',
                            }}
                          >
                            {inst.step}
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body1" fontWeight={600}>
                              {inst.instruction}
                            </Typography>
                          }
                          secondary={
                            inst.distance > 0 && (
                              <Typography variant="caption" color="text.secondary">
                                {formatDistance(inst.distance)}
                              </Typography>
                            )
                          }
                        />
                      </ListItem>
                      {index < instructions.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<DirectionsIcon />}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                  }}
                >
                  Start Navigation
                </Button>
              </Paper>
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default Routes;