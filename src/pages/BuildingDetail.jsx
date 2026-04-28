import React from 'react';
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
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  LocationOn as LocationIcon,
  Accessible as AccessibleIcon,
  Elevator as ElevatorIcon,
  Stairs as StairsIcon,
  Edit as EditIcon,
  Layers as LayersIcon,
  Room as RoomIcon,
} from '@mui/icons-material';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useBuilding, useBuildingFloors, useBuildingLocations } from '../hooks/useBuildings';
      const BASE_URL = import.meta.env.VITE_BASE_URL;

function BuildingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: building, isLoading, error } = useBuilding(id);
  const { data: floors = [] } = useBuildingFloors(id);
  const { data: locations = [] } = useBuildingLocations(id);

  if (isLoading) {
    return <LoadingSpinner message="Loading building details..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error.response?.data?.message || 'Failed to load building'}
        onRetry={() => navigate('/buildings')}
      />
    );
  }

  if (!building) {
    return <ErrorMessage message="Building not found" />;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/buildings')}
          sx={{ mb: 2 }}
        >
          Back to Buildings
        </Button>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <Typography variant="h3" component="h1" gutterBottom>
              {building.buildingName}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label={building.status} color="success" />
              {building.buildingCode && (
                <Chip label={`Code: ${building.buildingCode}`} variant="outlined" />
              )}
            </Box>
          </div>
        
             <IconButton
                          size="large"
                          color="primary"
                          onClick={() => onEdit && onEdit(building)}
                        >

            <EditIcon />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Image and Details */}
        <Grid item xs={12} md={8}>
          {/* Image */}
          {building.imageUrl && (
            <Paper sx={{ mb: 3, overflow: 'hidden' }}>
              <img
                src={building.imageUrl ? `${BASE_URL}${building.imageUrl}` : undefined}
                alt={building.buildingName}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </Paper>
          )}

          {/* Description */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              About
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {building.description || 'No description available'}
            </Typography>
          </Paper>

          {/* Locations in Building */}
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6">
                Locations ({locations.length})
              </Typography>
              <Button size="small">View All</Button>
            </Box>
            <List>
              {locations.slice(0, 5).map((location, index) => (
                <React.Fragment key={location.locationId}>
                  <ListItem>
                    <ListItemIcon>
                      <RoomIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={location.locationName}
                      secondary={`${location.locationType} • ${location.roomNumber || 'N/A'}`}
                    />
                  </ListItem>
                  {index < Math.min(locations.length, 5) - 1 && <Divider />}
                </React.Fragment>
              ))}
              {locations.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="No locations found"
                    secondary="This building has no registered locations"
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Right Column - Info Cards */}
        <Grid item xs={12} md={4}>
          {/* Building Info */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Building Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <StairsIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Floors"
                    secondary={building.floorsCount}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Address"
                    secondary={building.address || 'N/A'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LayersIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Coordinates"
                    secondary={`${building.latitude}, ${building.longitude}`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Features */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Accessibility Features
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <AccessibleIcon
                      color={building.isAccessible ? 'success' : 'disabled'}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Wheelchair Accessible"
                    secondary={building.isAccessible ? 'Yes' : 'No'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ElevatorIcon
                      color={building.hasElevator ? 'success' : 'disabled'}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Elevator"
                    secondary={building.hasElevator ? 'Available' : 'Not Available'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <StairsIcon
                      color={building.hasRamp ? 'success' : 'disabled'}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Ramp"
                    secondary={building.hasRamp ? 'Available' : 'Not Available'}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Floors */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Floors ({floors.length})
              </Typography>
              <List dense>
                {floors.map((floor) => (
                  <ListItem key={floor.floorId}>
                    <ListItemText
                      primary={floor.floorName || `Floor ${floor.floorNumber}`}
                      secondary={`Level ${floor.floorNumber}`}
                    />
                  </ListItem>
                ))}
                {floors.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primary="No floors registered"
                      secondary="Add floors to this building"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default BuildingDetail;