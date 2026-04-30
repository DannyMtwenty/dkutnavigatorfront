import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Stack,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  LocationOn as LocationIcon,
  Business as BuildingIcon,
  Room as RoomIcon,
  Accessible as AccessibleIcon,
  Edit as EditIcon,
  Layers as LayersIcon,
  People as PeopleIcon,
  LocalHospital as FacilityIcon,
} from '@mui/icons-material';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import LocationMap from '../components/maps/LocationMap';
import { useLocation, useLocationFacilities, useUpdateLocationStatus } from '../hooks/useLocations';

function LocationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const { data: location, isLoading, error } = useLocation(id);
  const { data: facilities = [] } = useLocationFacilities(id);
  const updateStatusMutation = useUpdateLocationStatus();

  const handleStatusChange = async (newStatus) => {
    setIsUpdatingStatus(true);
    await updateStatusMutation.mutateAsync({
      id: parseInt(id),
      status: newStatus,
    });
    setIsUpdatingStatus(false);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading location details..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error.response?.data?.message || 'Failed to load location'}
        onRetry={() => navigate('/locations')}
      />
    );
  }

  if (!location) {
    return <ErrorMessage message="Location not found" />;
  }

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

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/locations')}
          sx={{ mb: 2 }}
        >
          Back to Locations
        </Button>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <div>
            <Typography variant="h3" component="h1" gutterBottom>
              {location.locationName}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip
                label={location.status}
                color={getStatusColor(location.status)}
              />
              <Chip label={location.locationType} variant="outlined" />
              {location.isAccessible && (
                <Chip
                  icon={<AccessibleIcon />}
                  label="Accessible"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Stack>
          </div>
          <IconButton color="primary" size="large">
            <EditIcon />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Map and Details */}
        <Grid item xs={12} md={8}>
          {/* Map */}
          <Paper sx={{ mb: 3, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Location on Map
            </Typography>
            <LocationMap
              locations={[location]}
              center={[location.latitude, location.longitude]}
              zoom={17}
              height="400px"
            />
          </Paper>

          {/* Description */}
          {location.description && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {location.description}
              </Typography>
            </Paper>
          )}

          {/* Facilities */}
          {facilities.length > 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Facilities ({facilities.length})
              </Typography>
              <List>
                {facilities.map((facility, index) => (
                  <React.Fragment key={facility.facilityId}>
                    <ListItem>
                      <ListItemIcon>
                        <FacilityIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={facility.name}
                        secondary={`${facility.facilityType}${
                          facility.operatingHours ? ` • ${facility.operatingHours}` : ''
                        }`}
                      />
                    </ListItem>
                    {index < facilities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          )}
        </Grid>

        {/* Right Column - Info Cards */}
        <Grid item xs={12} md={4}>
          {/* Location Info */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Location Information
              </Typography>
              <List dense>
                {location.buildingName && (
                  <ListItem>
                    <ListItemIcon>
                      <BuildingIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Building"
                      secondary={location.buildingName}
                    />
                  </ListItem>
                )}
                {location.floorName && (
                  <ListItem>
                    <ListItemIcon>
                      <LayersIcon />
                    </ListItemIcon>
                    <ListItemText primary="Floor" secondary={location.floorName} />
                  </ListItem>
                )}
                {location.roomNumber && (
                  <ListItem>
                    <ListItemIcon>
                      <RoomIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Room Number"
                      secondary={location.roomNumber}
                    />
                  </ListItem>
                )}
                {location.capacity && (
                  <ListItem>
                    <ListItemIcon>
                      <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Capacity"
                      secondary={`${location.capacity} people`}
                    />
                  </ListItem>
                )}
                <ListItem>
                  <ListItemIcon>
                    <LocationIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Coordinates"
                    secondary={`${location.latitude.toFixed(6)}, ${location.longitude.toFixed(
                      6
                    )}`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Stack spacing={1}>
                <Button
                  fullWidth
                  variant={location.status === 'Available' ? 'contained' : 'outlined'}
                  color="success"
                  disabled={isUpdatingStatus || location.status === 'Available'}
                  onClick={() => handleStatusChange('Available')}
                >
                  Mark as Available
                </Button>
                <Button
                  fullWidth
                  variant={location.status === 'Occupied' ? 'contained' : 'outlined'}
                  color="warning"
                  disabled={isUpdatingStatus || location.status === 'Occupied'}
                  onClick={() => handleStatusChange('Occupied')}
                >
                  Mark as Occupied
                </Button>
                <Button
                  fullWidth
                  variant={location.status === 'Closed' ? 'contained' : 'outlined'}
                  color="error"
                  disabled={isUpdatingStatus || location.status === 'Closed'}
                  onClick={() => handleStatusChange('Closed')}
                >
                  Mark as Closed
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default LocationDetail;