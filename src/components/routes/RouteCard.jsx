import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
  alpha,
  LinearProgress,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  MyLocation as MyLocationIcon,
  DirectionsWalk as WalkIcon,
  DirectionsBike as BikeIcon,
  Accessible as AccessibleIcon,
  AccessTime as TimeIcon,
  ArrowForward as ArrowIcon,
  Route as RouteIcon,
} from '@mui/icons-material';

function RouteCard({ route, onViewDetails }) {
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  return (
    <Card
      className="building-card"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #2196F3, #1976D2)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        },
        '&:hover::before': {
          opacity: 1,
        },
      }}
    >
      {/* Route Visual */}
      <Box
        sx={{
          position: 'relative',
          height: 120,
          background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Start Point */}
        <Box
          sx={{
            position: 'absolute',
            left: 20,
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: '#4CAF50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            zIndex: 2,
          }}
        >
          <MyLocationIcon sx={{ color: 'white', fontSize: 20 }} />
        </Box>

        {/* Route Line */}
        <Box
          sx={{
            position: 'absolute',
            left: 60,
            right: 60,
            height: 4,
            background: 'linear-gradient(90deg, #4CAF50, #2196F3)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -3,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: 'white',
              border: '2px solid #2196F3',
            },
          }}
        />

        {/* End Point */}
        <Box
          sx={{
            position: 'absolute',
            right: 20,
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: '#F44336',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            zIndex: 2,
          }}
        >
          <LocationIcon sx={{ color: 'white', fontSize: 20 }} />
        </Box>

        {/* Accessibility Badge */}
        {route.isAccessible && (
          <Chip
            icon={<AccessibleIcon sx={{ fontSize: 14 }} />}
            label="Accessible"
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: 'white',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        {/* Route Info */}
        <Stack spacing={1.5}>
          {/* From Location */}
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              FROM
            </Typography>
            <Typography variant="body1" fontWeight={600} noWrap>
              {route.fromLocationName || 'Start Point'}
            </Typography>
          </Box>

          {/* To Location */}
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              TO
            </Typography>
            <Typography variant="body1" fontWeight={600} noWrap>
              {route.toLocationName || 'Destination'}
            </Typography>
          </Box>
        </Stack>

        {/* Stats */}
        <Stack
          direction="row"
          spacing={2}
          sx={{
            mt: 2,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              <RouteIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                Distance
              </Typography>
            </Box>
            <Typography variant="h6" fontWeight={700} color="primary">
              {formatDistance(route.distance)}
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              <TimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                Duration
              </Typography>
            </Box>
            <Typography variant="h6" fontWeight={700} color="success.main">
              {formatDuration(route.estimatedTime)}
            </Typography>
          </Box>
        </Stack>
      </CardContent>

      <CardActions sx={{ p: 2.5, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => onViewDetails && onViewDetails(route)}
          endIcon={<ArrowIcon />}
          sx={{
            py: 1,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: 'none',
          }}
        >
          View Route
        </Button>
      </CardActions>
    </Card>
  );
}

export default RouteCard;