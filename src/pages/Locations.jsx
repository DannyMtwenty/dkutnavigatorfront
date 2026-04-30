import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  Grid,
  Card,
  CardContent,
  Stack,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  GridView as GridIcon,
  Map as MapIcon,
  LocationOn as LocationIcon,
  School as AcademicIcon,
  Science as LabIcon,
  Business as OfficeIcon,
  Construction as FacilityIcon,
} from '@mui/icons-material';
import LocationList from '../components/locations/LocationList';
import LocationFilters from '../components/locations/LocationFilters';
import LocationForm from '../components/locations/LocationForm';
import LocationMap from '../components/maps/LocationMap';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import {
  useLocations,
  useCreateLocation,
  useUpdateLocation,
  useDeleteLocation,
} from '../hooks/useLocations';

const statsCards = [
  {
    title: '240',
    subtitle: 'Total Locations',
    icon: <LocationIcon sx={{ fontSize: 32 }} />,
    color: '#4CAF50',
    bgColor: '#E8F5E9',
  },
  {
    title: '85',
    subtitle: 'Classrooms',
    icon: <AcademicIcon sx={{ fontSize: 32 }} />,
    color: '#2196F3',
    bgColor: '#E3F2FD',
  },
  {
    title: '42',
    subtitle: 'Labs',
    icon: <LabIcon sx={{ fontSize: 32 }} />,
    color: '#9C27B0',
    bgColor: '#F3E5F5',
  },
  {
    title: '113',
    subtitle: 'Other Locations',
    icon: <FacilityIcon sx={{ fontSize: 32 }} />,
    color: '#FF9800',
    bgColor: '#FFF3E0',
  },
];

function Locations() {
  const [filters, setFilters] = useState({
    search: '',
    buildingId: '',
    locationType: '',
    isAccessible: false,
    status: '',
  });
  const [viewMode, setViewMode] = useState('grid');
  const [formOpen, setFormOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);

  const apiParams = useMemo(() => {
    const params = {};
    if (filters.buildingId) params.buildingId = filters.buildingId;
    if (filters.locationType) params.locationType = filters.locationType;
    if (filters.isAccessible) params.isAccessible = true;
    if (filters.status) params.status = filters.status;
    return params;
  }, [filters]);

  const { data: locations = [], isLoading, error, refetch } = useLocations(apiParams);
  const createMutation = useCreateLocation();
  const updateMutation = useUpdateLocation();
  const deleteMutation = useDeleteLocation();

  const filteredLocations = useMemo(() => {
    if (!filters.search) return locations;
    const searchLower = filters.search.toLowerCase();
    return locations.filter(
      (location) =>
        location.locationName?.toLowerCase().includes(searchLower) ||
        location.roomNumber?.toLowerCase().includes(searchLower) ||
        location.description?.toLowerCase().includes(searchLower) ||
        location.buildingName?.toLowerCase().includes(searchLower)
    );
  }, [locations, filters.search]);

  const handleCreateClick = () => {
    setEditingLocation(null);
    setFormOpen(true);
  };

  const handleEditClick = (location) => {
    setEditingLocation(location);
    setFormOpen(true);
  };

  const handleDeleteClick = (locationId) => {
    const location = locations.find((l) => l.locationId === locationId);
    setLocationToDelete(location);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data) => {
    if (editingLocation) {
      await updateMutation.mutateAsync({
        id: editingLocation.locationId,
        data,
      });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleDeleteConfirm = async () => {
    if (locationToDelete) {
      await deleteMutation.mutateAsync(locationToDelete.locationId);
      setDeleteDialogOpen(false);
      setLocationToDelete(null);
    }
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading locations..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error.response?.data?.message || 'Failed to load locations'}
        onRetry={refetch}
      />
    );
  }

  return (
    <Box>
      {/* Header with Stats */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <LocationIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              <Typography variant="h4" fontWeight={700}>
                Locations
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              Find classrooms, offices, and points of interest
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.25,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(27, 94, 32, 0.3)',
              },
            }}
          >
            Add Location
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2}>
          {statsCards.map((stat, index) => (
            <Grid item xs={6} sm={6} md={3} key={index}>
              <Card
                elevation={0}
                sx={{
                  bgcolor: stat.bgColor,
                  border: 'none',
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: alpha(stat.color, 0.15),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: stat.color,
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={700} color={stat.color}>
                        {stat.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        {stat.subtitle}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* View Toggle and Count */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          All Locations ({filteredLocations.length})
        </Typography>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              borderRadius: 2,
              px: 2,
              py: 0.75,
              textTransform: 'none',
              fontWeight: 500,
              border: '1px solid',
              borderColor: 'divider',
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              },
            },
          }}
        >
          <ToggleButton value="grid">
            <GridIcon sx={{ mr: 1, fontSize: 18 }} />
            Grid
          </ToggleButton>
          <ToggleButton value="map">
            <MapIcon sx={{ mr: 1, fontSize: 18 }} />
            Map
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <LocationFilters filters={filters} onFilterChange={setFilters} />

      {/* Content */}
      {filteredLocations.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            textAlign: 'center',
            py: 8,
            px: 2,
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <LocationIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom fontWeight={600}>
            No locations found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your filters or create a new location
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateClick}>
            Add First Location
          </Button>
        </Paper>
      ) : viewMode === 'grid' ? (
        <LocationList
          locations={filteredLocations}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          showActions={true}
        />
      ) : (
        <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <LocationMap
            locations={filteredLocations}
            height="600px"
            onMarkerClick={(location) => handleEditClick(location)}
          />
        </Paper>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: { xs: 'flex', sm: 'none' },
          boxShadow: '0 4px 12px rgba(27, 94, 32, 0.3)',
        }}
        onClick={handleCreateClick}
      >
        <AddIcon />
      </Fab>

      <LocationForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingLocation}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 2, maxWidth: 400 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{locationToDelete?.locationName}</strong>? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
            sx={{ textTransform: 'none' }}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Locations;