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
  Accessible as AccessibleIcon,
  Elevator as ElevatorIcon,
  Wifi as WifiIcon,
  LocalParking as ParkingIcon,
  PowerSettingsNew as PowerIcon,
  Videocam as CctvIcon,
  ArrowForward as ArrowIcon,
  Layers as LayersIcon,
} from '@mui/icons-material';

function BuildingCard({ building, onEdit, onDelete, showActions = false }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/buildings/${building.buildingId}`);
  };

  const defaultImage = 'https://images.unsplash.com/photo-1562774053-701939374585?w=400';

  const getCategoryColor = (type) => {
    const colors = {
      Academic: { bg: '#E3F2FD', color: '#1976D2' },
      Administration: { bg: '#F3E5F5', color: '#7B1FA2' },
      Hostel: { bg: '#FCE4EC', color: '#C2185B' },
      Dining: { bg: '#FFF3E0', color: '#F57C00' },
      Health: { bg: '#FFEBEE', color: '#D32F2F' },
    };
    return colors[type] || { bg: '#F5F5F5', color: '#757575' };
  };

  const categoryStyle = getCategoryColor('Academic');
  const BASE_URL = import.meta.env.VITE_BASE_URL;

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
          background: 'linear-gradient(90deg, #1B5E20, #4CAF50)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        },
        '&:hover::before': {
          opacity: 1,
        },
      }}
    >
      {/* Image Section */}
      <Box
        sx={{
          position: 'relative',
          paddingTop: '56.25%', // 16:9 aspect ratio
          overflow: 'hidden',
          bgcolor: 'grey.200',
        }}
      >
        <Box
          component="img"
          src={building.imageUrl ? `${BASE_URL}${building.imageUrl}` : defaultImage}
          alt={building.buildingName}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            '.building-card:hover &': {
              transform: 'scale(1.05)',
            },
          }}
        />
        
        {/* Status Badge */}
        <Chip
          label={building.status}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: building.status === 'Active' ? 'success.main' : 'warning.main',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        />

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
            120 m
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        {/* Category Pill */}
        <Box
          className="category-pill"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 1.5,
            py: 0.5,
            borderRadius: 5,
            bgcolor: categoryStyle.bg,
            color: categoryStyle.color,
            fontSize: '0.75rem',
            fontWeight: 600,
            mb: 1.5,
          }}
        >
          Academic
        </Box>

        {/* Building Name */}
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
          {building.buildingName}
        </Typography>

        {/* Building Code */}
        {building.buildingCode && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, fontWeight: 500 }}
          >
            Code: {building.buildingCode}
          </Typography>
        )}

        {/* Description */}
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
          {building.description || 'Main administration building housing offices for the Vice Chancellor, Registrar, Finance and other administrative units.'}
        </Typography>

        {/* Amenities Icons */}
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
          {building.hasElevator && (
            <Box
              className="amenity-icon active"
              title="Elevator"
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: alpha('#4CAF50', 0.1),
                color: 'success.main',
              }}
            >
              <ElevatorIcon sx={{ fontSize: 16 }} />
            </Box>
          )}
          {building.isAccessible && (
            <Box
              className="amenity-icon active"
              title="Wheelchair Accessible"
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: alpha('#4CAF50', 0.1),
                color: 'success.main',
              }}
            >
              <AccessibleIcon sx={{ fontSize: 16 }} />
            </Box>
          )}
          <Box
            className="amenity-icon active"
            title="WiFi Available"
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha('#4CAF50', 0.1),
              color: 'success.main',
            }}
          >
            <WifiIcon sx={{ fontSize: 16 }} />
          </Box>
          <Box
            className="amenity-icon active"
            title="Parking Available"
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha('#4CAF50', 0.1),
              color: 'success.main',
            }}
          >
            <ParkingIcon sx={{ fontSize: 16 }} />
          </Box>
          <Box
            className="amenity-icon active"
            title="Backup Power"
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha('#4CAF50', 0.1),
              color: 'success.main',
            }}
          >
            <PowerIcon sx={{ fontSize: 16 }} />
          </Box>
          <Box
            className="amenity-icon active"
            title="CCTV"
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha('#4CAF50', 0.1),
              color: 'success.main',
            }}
          >
            <CctvIcon sx={{ fontSize: 16 }} />
          </Box>
        </Stack>

        {/* Floors Info */}
        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <LayersIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {building.floorsCount} Floors
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="caption" color="text.secondary">
            8:00 AM - 5:00 PM
          </Typography>
        </Box>
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

export default BuildingCard;