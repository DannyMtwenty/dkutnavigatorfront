import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Accessible as AccessibleIcon,
  Elevator as ElevatorIcon,
  Stairs as StairsIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';

function BuildingCard({ building, onEdit, onDelete, showActions = false }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/buildings/${building.buildingId}`);
  };

  const defaultImage = 'https://via.placeholder.com/400x250?text=Building+Image';

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
      <CardMedia
        component="img"
        height="200"
        image={building.imageUrl || defaultImage}
        alt={building.buildingName}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Status Badge */}
        <Box sx={{ mb: 1 }}>
          <Chip
            label={building.status}
            size="small"
            color={
              building.status === 'Active'
                ? 'success'
                : building.status === 'UnderMaintenance'
                ? 'warning'
                : 'default'
            }
          />
        </Box>

        {/* Building Name */}
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {building.buildingName}
        </Typography>

        {/* Building Code */}
        {building.buildingCode && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Code: {building.buildingCode}
          </Typography>
        )}

        {/* Description */}
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
          {building.description || 'No description available'}
        </Typography>

        {/* Features */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
          <Tooltip title="Number of floors">
            <Chip
              icon={<StairsIcon />}
              label={`${building.floorsCount} Floors`}
              size="small"
              variant="outlined"
            />
          </Tooltip>

          {building.isAccessible && (
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

          {building.hasElevator && (
            <Tooltip title="Has elevator">
              <Chip
                icon={<ElevatorIcon />}
                label="Elevator"
                size="small"
                color="info"
                variant="outlined"
              />
            </Tooltip>
          )}
        </Box>

        {/* Location */}
        {building.address && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <LocationIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary" noWrap>
              {building.address}
            </Typography>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button
          size="small"
          variant="contained"
          startIcon={<ViewIcon />}
          onClick={handleViewDetails}
        >
          View Details
        </Button>

        {showActions && (
          <Box>
            <IconButton
              size="small"
              color="primary"
              onClick={() => onEdit && onEdit(building)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete && onDelete(building.buildingId)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
      </CardActions>
    </Card>
  );
}

export default BuildingCard;