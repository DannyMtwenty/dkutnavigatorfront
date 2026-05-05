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
  alpha,
  Avatar,
  Tabs,
  Tab,
  Alert,
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
  Directions as DirectionsIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Circle as CircleIcon,
  AccessTime as TimeIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Wifi as WifiIcon,
  LocalParking as ParkingIcon,
  Elevator as ElevatorIcon,
  PowerSettingsNew as PowerIcon,
  Videocam as CctvIcon,
} from '@mui/icons-material';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import LocationMap from '../components/maps/LocationMap';
import {
  useLocation,
  useLocationFacilities,
  useUpdateLocationStatus,
} from '../hooks/useLocations';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ paddingTop: '24px' }}>
      {value === index && children}
    </div>
  );
}

function LocationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Available':
        return { color: '#4CAF50', bg: '#E8F5E9', label: 'Available', icon: '✓' };
      case 'Occupied':
        return { color: '#FF9800', bg: '#FFF3E0', label: 'Occupied', icon: '◉' };
      case 'Closed':
        return { color: '#F44336', bg: '#FFEBEE', label: 'Closed', icon: '✕' };
      default:
        return { color: '#757575', bg: '#F5F5F5', label: 'Unknown', icon: '?' };
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

  const statusConfig = getStatusConfig(location.status);
  const typeConfig = getTypeConfig(location.locationType);

  // Mock amenities data (you can get this from API)
  const amenities = [
    { icon: <WifiIcon />, label: 'WiFi', available: true },
    { icon: <ElevatorIcon />, label: 'Elevator', available: location.isAccessible },
    { icon: <ParkingIcon />, label: 'Parking', available: true },
    { icon: <PowerIcon />, label: 'Power Backup', available: true },
    { icon: <CctvIcon />, label: 'CCTV', available: true },
    { icon: <AccessibleIcon />, label: 'Wheelchair Access', available: location.isAccessible },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/locations')}
          sx={{
            mb: 2,
            textTransform: 'none',
            fontWeight: 500,
            color: 'text.secondary',
            '&:hover': {
              bgcolor: alpha('#1B5E20', 0.05),
            },
          }}
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
          <Box sx={{ flexGrow: 1 }}>
            {/* Type Badge */}
            <Box
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

            <Typography variant="h3" fontWeight={700} gutterBottom>
              {location.locationName}
            </Typography>

            <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ gap: 1 }}>
              {/* Status Badge */}
              <Chip
                icon={<CircleIcon sx={{ fontSize: 10 }} />}
                label={statusConfig.label}
                sx={{
                  bgcolor: statusConfig.bg,
                  color: statusConfig.color,
                  fontWeight: 600,
                  border: 'none',
                }}
              />
              
              {location.roomNumber && (
                <Chip
                  icon={<RoomIcon sx={{ fontSize: 16 }} />}
                  label={`Room ${location.roomNumber}`}
                  variant="outlined"
                />
              )}
              
              {location.isAccessible && (
                <Chip
                  icon={<AccessibleIcon sx={{ fontSize: 16 }} />}
                  label="Accessible"
                  sx={{
                    bgcolor: alpha('#4CAF50', 0.1),
                    color: 'success.main',
                    border: 'none',
                    fontWeight: 600,
                  }}
                />
              )}
            </Stack>
          </Box>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1}>
            <IconButton
              onClick={() => setIsBookmarked(!isBookmarked)}
              sx={{
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  bgcolor: alpha('#1B5E20', 0.05),
                  borderColor: 'primary.main',
                },
              }}
            >
              {isBookmarked ? (
                <BookmarkIcon sx={{ color: 'primary.main' }} />
              ) : (
                <BookmarkBorderIcon />
              )}
            </IconButton>
            <IconButton
              sx={{
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  bgcolor: alpha('#1B5E20', 0.05),
                  borderColor: 'primary.main',
                },
              }}
            >
              <ShareIcon />
            </IconButton>
            <IconButton
              color="primary"
              sx={{
                bgcolor: alpha('#1B5E20', 0.1),
                '&:hover': {
                  bgcolor: alpha('#1B5E20', 0.2),
                },
              }}
            >
              <EditIcon />
            </IconButton>
          </Stack>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Map and Main Content */}
        <Grid item xs={12} md={8}>
          {/* Map Card */}
          <Paper
            elevation={0}
            sx={{
              mb: 3,
              p: 2.5,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Location on Map
              </Typography>
              <Button
                variant="contained"
                startIcon={<DirectionsIcon />}
                size="small"
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              >
                Get Directions
              </Button>
            </Box>
            <LocationMap
              locations={[location]}
              center={[location.latitude, location.longitude]}
              zoom={17}
              height="400px"
            />
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" fontFamily="monospace">
                {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </Typography>
              <Chip label="180m from you" size="small" sx={{ ml: 'auto' }} />
            </Box>
          </Paper>

          {/* Tabs Section */}
          <Paper
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                px: 2,
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  minHeight: 56,
                },
              }}
            >
              <Tab label="Overview" />
              <Tab label={`Facilities (${facilities.length})`} />
              <Tab label="Hours & Contact" />
            </Tabs>

            {/* Overview Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ px: 2.5, pb: 2.5 }}>
                {/* Description */}
                {location.description && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      About this Location
                    </Typography>
                    <Typography variant="body1" color="text.secondary" lineHeight={1.7}>
                      {location.description}
                    </Typography>
                  </Box>
                )}

                {/* Amenities */}
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Amenities & Features
                  </Typography>
                  <Grid container spacing={2}>
                    {amenities.map((amenity, index) => (
                      <Grid item xs={6} sm={4} key={index}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: amenity.available ? alpha('#4CAF50', 0.05) : 'grey.50',
                            border: '1px solid',
                            borderColor: amenity.available ? alpha('#4CAF50', 0.2) : 'divider',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              borderColor: amenity.available ? 'success.main' : 'divider',
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              color: amenity.available ? 'success.main' : 'text.disabled',
                            }}
                          >
                            {amenity.icon}
                          </Box>
                          <Typography
                            variant="body2"
                            fontWeight={500}
                            color={amenity.available ? 'text.primary' : 'text.disabled'}
                          >
                            {amenity.label}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
            </TabPanel>

            {/* Facilities Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ px: 2.5, pb: 2.5 }}>
                {facilities.length > 0 ? (
                  <List>
                    {facilities.map((facility, index) => (
                      <React.Fragment key={facility.facilityId}>
                        <ListItem
                          sx={{
                            px: 0,
                            py: 2,
                            '&:hover': {
                              bgcolor: alpha('#1B5E20', 0.02),
                              borderRadius: 2,
                            },
                          }}
                        >
                          <ListItemIcon>
                            <Avatar
                              sx={{
                                bgcolor: alpha('#4CAF50', 0.1),
                                color: 'success.main',
                              }}
                            >
                              <FacilityIcon />
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body1" fontWeight={600}>
                                {facility.name}
                              </Typography>
                            }
                            secondary={
                              <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">
                                  {facility.facilityType}
                                  {facility.operatingHours && ` • ${facility.operatingHours}`}
                                </Typography>
                                {facility.description && (
                                  <Typography variant="caption" color="text.secondary">
                                    {facility.description}
                                  </Typography>
                                )}
                              </Stack>
                            }
                          />
                        </ListItem>
                        {index < facilities.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    <Typography variant="body2" fontWeight={500}>
                      No facilities available at this location
                    </Typography>
                  </Alert>
                )}
              </Box>
            </TabPanel>

            {/* Hours & Contact Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ px: 2.5, pb: 2.5 }}>
                <Grid container spacing={3}>
                  {/* Operating Hours */}
                  <Grid item xs={12} md={6}>
                    <Card
                      elevation={0}
                      sx={{
                        bgcolor: 'grey.50',
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <TimeIcon sx={{ color: 'primary.main' }} />
                          <Typography variant="h6" fontWeight={600}>
                            Operating Hours
                          </Typography>
                        </Box>
                        <Stack spacing={1.5}>
                          {[
                            { day: 'Monday - Friday', hours: '8:00 AM - 5:00 PM' },
                            { day: 'Saturday', hours: '9:00 AM - 1:00 PM' },
                            { day: 'Sunday', hours: 'Closed' },
                          ].map((schedule, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <Typography variant="body2" fontWeight={500}>
                                {schedule.day}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {schedule.hours}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Contact Information */}
                  <Grid item xs={12} md={6}>
                    <Card
                      elevation={0}
                      sx={{
                        bgcolor: 'grey.50',
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          Contact Information
                        </Typography>
                        <Stack spacing={2}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <PhoneIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                            <Box>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Phone
                              </Typography>
                              <Typography variant="body2" fontWeight={500}>
                                +254 712 345 678
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <EmailIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                            <Box>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Email
                              </Typography>
                              <Typography variant="body2" fontWeight={500}>
                                info@dkut.ac.ke
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>

        {/* Right Column - Info Cards */}
        <Grid item xs={12} md={4}>
          {/* Location Info Card */}
          <Card
            elevation={0}
            sx={{
              mb: 3,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Location Information
              </Typography>
              <List dense>
                {location.buildingName && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <BuildingIcon sx={{ color: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="caption" color="text.secondary">
                          Building
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" fontWeight={600}>
                          {location.buildingName}
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
                {location.floorName && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <LayersIcon sx={{ color: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="caption" color="text.secondary">
                          Floor
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" fontWeight={600}>
                          {location.floorName}
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
                {location.roomNumber && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <RoomIcon sx={{ color: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="caption" color="text.secondary">
                          Room Number
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" fontWeight={600}>
                          {location.roomNumber}
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
                {location.capacity && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <PeopleIcon sx={{ color: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="caption" color="text.secondary">
                          Capacity
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" fontWeight={600}>
                          {location.capacity} people
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card
            elevation={0}
            sx={{
              mb: 3,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Update Status
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Change the current availability status
              </Typography>
              <Stack spacing={1.5}>
                <Button
                  fullWidth
                  variant={location.status === 'Available' ? 'contained' : 'outlined'}
                  color="success"
                  disabled={isUpdatingStatus || location.status === 'Available'}
                  onClick={() => handleStatusChange('Available')}
                  startIcon={<CircleIcon sx={{ fontSize: 10 }} />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    justifyContent: 'flex-start',
                  }}
                >
                  Mark as Available
                </Button>
                <Button
                  fullWidth
                  variant={location.status === 'Occupied' ? 'contained' : 'outlined'}
                  color="warning"
                  disabled={isUpdatingStatus || location.status === 'Occupied'}
                  onClick={() => handleStatusChange('Occupied')}
                  startIcon={<CircleIcon sx={{ fontSize: 10 }} />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    justifyContent: 'flex-start',
                  }}
                >
                  Mark as Occupied
                </Button>
                <Button
                  fullWidth
                  variant={location.status === 'Closed' ? 'contained' : 'outlined'}
                  color="error"
                  disabled={isUpdatingStatus || location.status === 'Closed'}
                  onClick={() => handleStatusChange('Closed')}
                  startIcon={<CircleIcon sx={{ fontSize: 10 }} />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    justifyContent: 'flex-start',
                  }}
                >
                  Mark as Closed
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Nearby Locations Card */}
          <Card
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Nearby Locations
              </Typography>
              <List dense>
                {[
                  { name: 'Computer Lab 1', distance: '25m', type: 'Lab' },
                  { name: 'Library Main Hall', distance: '50m', type: 'Facility' },
                  { name: 'Lecture Room 201', distance: '75m', type: 'Classroom' },
                ].map((nearby, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      px: 0,
                      py: 1,
                      cursor: 'pointer',
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: alpha('#1B5E20', 0.05),
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: alpha('#2196F3', 0.1),
                          color: '#2196F3',
                          fontSize: '0.875rem',
                        }}
                      >
                        {nearby.distance}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight={600}>
                          {nearby.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {nearby.type}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                sx={{ mt: 1, textTransform: 'none', fontWeight: 600 }}
              >
                View All Nearby
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default LocationDetail;