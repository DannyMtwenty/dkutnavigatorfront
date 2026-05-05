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
  Avatar,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Business as BuildingIcon,
  AccessTime as TimeIcon,
  ArrowForward as ArrowIcon,
  Restaurant as RestaurantIcon,
  LocalHospital as HealthIcon,
  Book as LibraryIcon,
  LocalParking as ParkingIcon,
  AttachMoney as AtmIcon,
  FitnessCenter as GymIcon,
  Accessible as AccessibleIcon,
} from '@mui/icons-material';

function FacilityCard({ facility }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
     
    navigate(`/facilities/${facility.facilityId}`);
  };

  const getFacilityConfig = (type) => {
    const configs = {
      Restroom: { icon: '🚻', color: '#2196F3', bg: '#E3F2FD', iconComponent: <RestaurantIcon /> },
      Cafeteria: { icon: '🍽️', color: '#FF9800', bg: '#FFF3E0', iconComponent: <RestaurantIcon /> },
      Library: { icon: '📚', color: '#9C27B0', bg: '#F3E5F5', iconComponent: <LibraryIcon /> },
      Parking: { icon: '🅿️', color: '#607D8B', bg: '#ECEFF1', iconComponent: <ParkingIcon /> },
      ATM: { icon: '💳', color: '#4CAF50', bg: '#E8F5E9', iconComponent: <AtmIcon /> },
      Medical: { icon: '⚕️', color: '#F44336', bg: '#FFEBEE', iconComponent: <HealthIcon /> },
      Gym: { icon: '💪', color: '#00BCD4', bg: '#E0F7FA', iconComponent: <GymIcon /> },
    };
    return configs[type] || { icon: '🏢', color: '#757575', bg: '#F5F5F5', iconComponent: <BuildingIcon /> };
  };

  const config = getFacilityConfig(facility.facilityType);

  const amenitiesList = facility.amenities ? JSON.parse(facility.amenities) : [];

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
          background: `linear-gradient(90deg, ${config.color}, ${alpha(config.color, 0.6)})`,
          opacity: 0,
          transition: 'opacity 0.3s ease',
        },
        '&:hover::before': {
          opacity: 1,
        },
      }}
    >
      {/* Icon Header */}
      <Box
        sx={{
          position: 'relative',
          height: 140,
          background: `linear-gradient(135deg, ${config.bg} 0%, ${alpha(config.color, 0.1)} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            fontSize: '3rem',
          }}
        >
          {config.icon}
        </Avatar>

        {/* Accessibility Badge */}
        {facility.isAccessible && (
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
        {/* Type Badge */}
        <Box
          className="category-pill"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 1.5,
            py: 0.5,
            borderRadius: 5,
            bgcolor: config.bg,
            color: config.color,
            fontSize: '0.75rem',
            fontWeight: 600,
            mb: 1.5,
          }}
        >
          {facility.facilityType}
        </Box>

        {/* Facility Name */}
        <Typography
          variant="h6"
          component="h2"
          fontWeight={600}
          sx={{
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '3rem',
          }}
        >
          {facility.name}
        </Typography>

        {/* Location Info */}
        <Stack spacing={0.5} sx={{ mb: 2 }}>
          {facility.locationName && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" fontWeight={500} noWrap>
                {facility.locationName}
              </Typography>
            </Box>
          )}
          {facility.operatingHours && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {facility.operatingHours}
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Description */}
        {facility.description && (
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
            {facility.description}
          </Typography>
        )}

        {/* Amenities */}
        {amenitiesList.length > 0 && (
          <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
            {amenitiesList.slice(0, 3).map((amenity, index) => (
              <Chip
                key={index}
                label={amenity}
                size="small"
                variant="outlined"
                sx={{
                  height: 24,
                  fontSize: '0.7rem',
                  fontWeight: 500,
                }}
              />
            ))}
            {amenitiesList.length > 3 && (
              <Chip
                label={`+${amenitiesList.length - 3} more`}
                size="small"
                sx={{
                  height: 24,
                  fontSize: '0.7rem',
                  bgcolor: alpha(config.color, 0.1),
                  color: config.color,
                  fontWeight: 600,
                }}
              />
            )}
          </Stack>
        )}
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
            bgcolor: config.color,
            '&:hover': {
              bgcolor: config.color,
              filter: 'brightness(0.9)',
            },
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}

export default FacilityCard;