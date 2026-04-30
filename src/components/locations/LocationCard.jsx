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
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Business as BuildingIcon,
  Room as RoomIcon,
  Accessible as AccessibleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Layers as LayersIcon,
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
        return 'success';
      case 'Occupied':
        return 'warning';
      case 'Closed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Classroom':
        return '🎓';
      case 'Lab':
        return '🔬';
      case 'Office':
        return '🏢';
      case 'Facility':
        return '🏗️';
      default:
        return '📍';
    }
  };

  return (
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
      {/* Mini Map */}
      <MiniMap latitude={location.latitude} longitude={location.longitude} height="180px" />

      <CardContent sx={{ flexGrow: 1 }}>
        {/* Status & Type */}
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Chip
            label={location.status}
            size="small"
            color={getStatusColor(location.status)}
          />
          <Chip
            label={location.locationType}
            size="small"
            variant="outlined"
            icon={<span>{getTypeIcon(location.locationType)}</span>}
          />
        </Stack>

        {/* Location Name */}
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {location.locationName}
        </Typography>

        {/* Building & Room */}
        <Box sx={{ mb: 1 }}>
          {location.buildingName && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <BuildingIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" noWrap>
                {location.buildingName}
              </Typography>
            </Box>
          )}
          {location.roomNumber && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <RoomIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Room: {location.roomNumber}
              </Typography>
            </Box>
          )}
          {location.floorName && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LayersIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {location.floorName}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Description */}
        {location.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {location.description}
          </Typography>
        )}

        {/* Features */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {location.capacity && (
            <Chip
              label={`Capacity: ${location.capacity}`}
              size="small"
              variant="outlined"
            />
          )}
          {location.isAccessible && (
            <Tooltip title="Wheelchair accessible">
              <Chip
                icon={<AccessibleIcon />}
                label="Accessible"
                size="small"
                color="primary"
                variant="outlined"
              />
            </Tooltip>
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button
          size="small"
          variant="contained"
          startIcon={<ViewIcon />}
          onClick={handleViewDetails}
        >
          Details
        </Button>

        {showActions && (
          <Box>
            <IconButton
              size="small"
              color="primary"
              onClick={() => onEdit && onEdit(location)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete && onDelete(location.locationId)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
      </CardActions>
    </Card>
  );
}

export default LocationCard;