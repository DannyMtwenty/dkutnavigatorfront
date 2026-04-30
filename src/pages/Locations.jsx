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
} from '@mui/material';
import {
  Add as AddIcon,
  ViewModule as GridIcon,
  Map as MapIcon,
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

function Locations() {
  const [filters, setFilters] = useState({
    search: '',
    buildingId: '',
    locationType: '',
    isAccessible: false,
    status: '',
  });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [formOpen, setFormOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);

  // API params
  const apiParams = useMemo(() => {
    const params = {};
    if (filters.buildingId) params.buildingId = filters.buildingId;
    if (filters.locationType) params.locationType = filters.locationType;
    if (filters.isAccessible) params.isAccessible = true;
    if (filters.status) params.status = filters.status;
    return params;
  }, [filters]);

  // Fetch locations
  const { data: locations = [], isLoading, error, refetch } = useLocations(apiParams);

  console.log('Fetched locations:', locations);

  // Mutations
  const createMutation = useCreateLocation();
  const updateMutation = useUpdateLocation();
  const deleteMutation = useDeleteLocation();

  // Filter locations locally for search
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

  // Handlers
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

  // Loading state
  if (isLoading) {
    return <LoadingSpinner message="Loading locations..." />;
  }

  // Error state
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
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <div>
          <Typography variant="h3" component="h1" gutterBottom>
            Locations
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Find classrooms, offices, and points of interest
          </Typography>
        </div>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* View Toggle */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            size="small"
          >
            <ToggleButton value="grid">
              <GridIcon sx={{ mr: 1 }} />
              Grid
            </ToggleButton>
            <ToggleButton value="map">
              <MapIcon sx={{ mr: 1 }} />
              Map
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Add Button */}
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            Add Location
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <LocationFilters filters={filters} onFilterChange={setFilters} />

      {/* Results Count */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Showing {filteredLocations.length} location{filteredLocations.length !== 1 ? 's' : ''}
      </Typography>

      {/* Content */}
      {filteredLocations.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No locations found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters or create a new location
          </Typography>
        </Box>
      ) : viewMode === 'grid' ? (
        <LocationList
          locations={filteredLocations}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          showActions={true}
        />
      ) : (
        <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
          <LocationMap
            locations={filteredLocations}
            height="600px"
            onMarkerClick={(location) => handleEditClick(location)}
          />
        </Paper>
      )}

      {/* Floating Action Button (Mobile) */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', sm: 'none' },
        }}
        onClick={handleCreateClick}
      >
        <AddIcon />
      </Fab>

      {/* Location Form Dialog */}
      <LocationForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingLocation}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{' '}
            <strong>{locationToDelete?.locationName}</strong>? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Locations;