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
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import BuildingList from '../components/buildings/BuildingList';
import BuildingFilters from '../components/buildings/BuildingFilters';
import BuildingForm from '../components/buildings/BuildingForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import {
  useBuildings,
  useCreateBuilding,
  useUpdateBuilding,
  useDeleteBuilding,
} from '../hooks/useBuildings';

function Buildings() {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    isAccessible: false,
    view: 'grid',
  });
  const [formOpen, setFormOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [buildingToDelete, setBuildingToDelete] = useState(null);

  // API params based on filters
  const apiParams = useMemo(() => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.isAccessible) params.isAccessible = true;
    return params;
  }, [filters.status, filters.isAccessible]);

  // Fetch buildings
  const { data: buildings = [], isLoading, error, refetch } = useBuildings(apiParams);

  // Mutations
  const createMutation = useCreateBuilding();
  const updateMutation = useUpdateBuilding();
  const deleteMutation = useDeleteBuilding();

  // Filter buildings locally for search
  const filteredBuildings = useMemo(() => {
    if (!filters.search) return buildings;

    const searchLower = filters.search.toLowerCase();
    return buildings.filter(
      (building) =>
        building.buildingName?.toLowerCase().includes(searchLower) ||
        building.buildingCode?.toLowerCase().includes(searchLower) ||
        building.description?.toLowerCase().includes(searchLower)
    );
  }, [buildings, filters.search]);

  // Handlers
  const handleCreateClick = () => {
    setEditingBuilding(null);
    setFormOpen(true);
  };

  const handleEditClick = (building) => {
    setEditingBuilding(building);
    setFormOpen(true);
  };

  const handleDeleteClick = (buildingId) => {
    const building = buildings.find((b) => b.buildingId === buildingId);
    setBuildingToDelete(building);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data) => {
    if (editingBuilding) {
      await updateMutation.mutateAsync({
        id: editingBuilding.buildingId,
        data,
      });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleDeleteConfirm = async () => {
    if (buildingToDelete) {
      await deleteMutation.mutateAsync(buildingToDelete.buildingId);
      setDeleteDialogOpen(false);
      setBuildingToDelete(null);
    }
  };

  // Loading state
  if (isLoading) {
    return <LoadingSpinner message="Loading buildings..." />;
  }

  // Error state
  if (error) {
    return (
      <ErrorMessage
        message={error.response?.data?.message || 'Failed to load buildings'}
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
        }}
      >
        <div>
          <Typography variant="h3" component="h1" gutterBottom>
            Buildings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explore all campus buildings and facilities
          </Typography>
        </div>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
          sx={{ display: { xs: 'none', sm: 'flex' } }}
        >
          Add Building
        </Button>
      </Box>

      {/* Filters */}
      <BuildingFilters filters={filters} onFilterChange={setFilters} />

      {/* Results Count */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Showing {filteredBuildings.length} building{filteredBuildings.length !== 1 ? 's' : ''}
      </Typography>

      {/* Building List */}
      {filteredBuildings.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No buildings found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters or create a new building
          </Typography>
        </Box>
      ) : (
        <BuildingList
          buildings={filteredBuildings}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          showActions={true}
        />
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

      {/* Building Form Dialog */}
      <BuildingForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingBuilding}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{' '}
            <strong>{buildingToDelete?.buildingName}</strong>? This action cannot
            be undone.
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

export default Buildings;