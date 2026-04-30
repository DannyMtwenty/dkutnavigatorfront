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
  Stack,
  alpha,
  Avatar,
  Divider,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Edit as EditIcon,
  Directions as DirectionsIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Accessible as AccessibleIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useFacility } from '../hooks/useFacilities';

function FacilityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = React.useState(false);

  const { data: facility, isLoading, error } = useFacility(id);

  if (isLoading) {
    return <LoadingSpinner message="Loading facility details..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error.response?.data?.message || 'Failed to load facility'}
        onRetry={() => navigate('/facilities')}
      />
    );
  }

  if (!facility) {
    return <ErrorMessage message="Facility not found" />;
  }

  const amenitiesList = facility.amenities ? JSON.parse(facility.amenities) : [];

  const getFacilityConfig = (type) => {
    const configs = {
      Restroom: { icon: '🚻', color: '#2196F3', bg: '#E3F2FD' },
      Cafeteria: { icon: '🍽️', color: '#FF9800', bg: '#FFF3E0' },
      Library: { icon: '📚', color: '#9C27B0', bg: '#F3E5F5' },
      Parking: { icon: '🅿️', color: '#607D8B', bg: '#ECEFF1' },
      ATM: { icon: '💳', color: '#4CAF50', bg: '#E8F5E9' },
      Medical: { icon: '⚕️', color: '#F44336', bg: '#FFEBEE' },
      Gym: { icon: '💪', color: '#00BCD4', bg: '#E0F7FA' },
    };
    return configs[type] || { icon: '🏢', color: '#757575', bg: '#F5F5F5' };
  };

  const config = getFacilityConfig(facility.facilityType);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/facilities')}
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
          Back to Facilities
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
          <Box sx={{ display: 'flex', gap: 2, flexGrow: 1 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: config.bg,
                fontSize: '2.5rem',
              }}
            >
              {config.icon}
            </Avatar>

            <Box sx={{ flexGrow: 1 }}>
              <Box
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

              <Typography variant="h3" fontWeight={700} gutterBottom>
                {facility.name}
              </Typography>

              <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ gap: 1 }}>
                {facility.locationName && (
                  <Chip
                    icon={<LocationIcon sx={{ fontSize: 16 }} />}
                    label={facility.locationName}
                    variant="outlined"
                  />
                )}
                {facility.isAccessible && (
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
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* Description */}
          {facility.description && (
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                mb: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" fontWeight={600} gutterBottom>
                About this Facility
              </Typography>
              <Typography variant="body1" color="text.secondary" lineHeight={1.7}>
                {facility.description}
              </Typography>
            </Paper>
          )}

          {/* Amenities */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Amenities & Features
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {amenitiesList.map((amenity, index) => (
                <Grid item xs={6} sm={4} key={index}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha('#4CAF50', 0.05),
                      border: '1px solid',
                      borderColor: alpha('#4CAF50', 0.2),
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: 'success.main',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      {amenity}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Operating Hours */}
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
              Operating Hours
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <TimeIcon sx={{ color: 'primary.main' }} />
              <Typography variant="body1" fontWeight={500}>
                {facility.operatingHours || '24/7'}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          {/* Quick Actions */}
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
                Quick Actions
              </Typography>
              <Stack spacing={1.5}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<DirectionsIcon />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    justifyContent: 'flex-start',
                  }}
                >
                  Get Directions
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<PhoneIcon />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    justifyContent: 'flex-start',
                  }}
                >
                  Contact
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Contact Information
              </Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
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
                      facility@dkut.ac.ke
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default FacilityDetail;