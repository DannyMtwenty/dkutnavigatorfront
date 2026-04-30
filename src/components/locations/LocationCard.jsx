import React from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Business as BuildingIcon,
  Room as RoomIcon,
  Accessible as AccessibleIcon,
  Layers as LayersIcon,
  People as PeopleIcon,
  ArrowForward as ArrowIcon,
  Circle as CircleIcon,
} from '@mui/icons-material';
import MiniMap from '../maps/MiniMap';

function LocationCard({ location, onEdit, onDelete, showActions = false }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/locations/${location.locationId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return { color: '#4CAF50', bg: '#E8F5E9', label: 'Available' };
      case 'Occupied':
        return { color: '#FF9800', bg: '#FFF3E0', label: 'Occupied' };
      case 'Closed':
        return { color: '#F44336', bg: '#FFEBEE', label: 'Closed' };
      default:
        return { color: '#757575', bg: '#F5F5F5', label: 'Unknown' };
    }
  };

  const getTypeConfig = (type) => {
    const configs = {
      Classroom: { icon: '🎓', color: '#2196F3', bg: '#E3F2FD' },
      Lab: { icon: '🔬', color: '#9C27B0', bg: '#F3E5F5' },
      Office: { icon: '🏢', color: '#FF9800', bg: '#FFF3E0' },
      Facility: { icon: '🏗️', color: '#4CAF50', bg: '#E8F5E9' },
      Landmark: { icon: '📍', color: '#F44336', bg: '#FFEBEE' },
    };
    return configs[type] || configs.Facility;
  };

  const statusConfig = getStatusColor(location.status);
  const typeConfig = getTypeConfig(location.locationType);

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
          background: `linear-gradient(90deg, ${typeConfig.color}, ${alpha(typeConfig.color, 0.6)})`,
          opacity: 0,
          transition: 'opacity 0.3s ease',
        },
        '&:hover::before': {
          opacity: 1,
        },
      }}
    >
      {/* Mini Map */}
      <Box
        sx={{
          position: 'relative',
          height: 180,
          overflow: 'hidden',
          bgcolor: 'grey.200',
        }}
      >
        <MiniMap latitude={location.latitude} longitude={location.longitude} height="180px" />
        
        {/* Status Badge */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            bgcolor: 'white',
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <CircleIcon sx={{ fontSize: 8, color: statusConfig.color }} />
          <Typography variant="caption" fontWeight={600}>
            {statusConfig.label}
          </Typography>
        </Box>

        {/* Distance Badge */}
        <Box
          className="distance-badge"
          sx={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            bgcolor: 'white',
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <LocationIcon sx={{ fontSize: 14, color: 'primary.main' }} />
          <Typography variant="caption" fontWeight={600}>
            180 m
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        {/* Type Badge */}
        <Box
          className="category-pill"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 1.5,
            py: 0.5,
            borderRadius: 5,
            bgcolor: typeConfig.bg,
            color: typeConfig.color,
            fontSize: '0.75rem',
            fontWeight: 600,
            mb: 1.5,
            gap: 0.5,
          }}
        >
          <span>{typeConfig.icon}</span>
          {location.locationType}
        </Box>

        {/* Location Name */}
        <Typography
          variant="h6"
          component="h2"
          fontWeight={600}
          sx={{
            mb: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {location.locationName}
        </Typography>

        {/* Building & Room Info */}
        <Stack spacing={0.5} sx={{ mb: 2 }}>
          {location.buildingName && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <BuildingIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {location.buildingName}
              </Typography>
            </Box>
          )}
          {location.roomNumber && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <RoomIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Room {location.roomNumber}
              </Typography>
            </Box>
          )}
          {location.floorName && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LayersIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {location.floorName}
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Description */}
        {location.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.6,
            }}
          >
            {location.description}
          </Typography>
        )}

        {/* Features */}
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
          {location.capacity && (
            <Chip
              icon={<PeopleIcon sx={{ fontSize: 14 }} />}
              label={`${location.capacity} people`}
              size="small"
              variant="outlined"
              sx={{
                height: 24,
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
            />
          )}
          {location.isAccessible && (
            <Chip
              icon={<AccessibleIcon sx={{ fontSize: 14 }} />}
              label="Accessible"
              size="small"
              sx={{
                height: 24,
                fontSize: '0.75rem',
                fontWeight: 600,
                bgcolor: alpha('#4CAF50', 0.1),
                color: 'success.main',
                border: 'none',
              }}
            />
          )}
        </Stack>
      </CardContent>

      <CardActions sx={{ p: 2.5, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleViewDetails}
          endIcon={<ArrowIcon />}
          sx={{
            py: 1,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: 'none',
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}

export default LocationCard;