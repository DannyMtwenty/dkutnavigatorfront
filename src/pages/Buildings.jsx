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
  Business as BuildingIcon,
  School as AcademicIcon,
  Home as HostelIcon,
  Restaurant as DiningIcon,
} from '@mui/icons-material';
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

const statsCards = [
  {
    title: '56',
    subtitle: 'Total Buildings',
    icon: <BuildingIcon sx={{ fontSize: 32 }} />,
    color: '#4CAF50',
    bgColor: '#E8F5E9',
  },
  {
    title: '12',
    subtitle: 'Academic',
    icon: <AcademicIcon sx={{ fontSize: 32 }} />,
    color: '#2196F3',
    bgColor: '#E3F2FD',
  },
  {
    title: '8',
    subtitle: 'Hostels',
    icon: <HostelIcon sx={{ fontSize: 32 }} />,
    color: '#9C27B0',
    bgColor: '#F3E5F5',
  },
  {
    title: '15',
    subtitle: 'Other Facilities',
    icon: <DiningIcon sx={{ fontSize: 32 }} />,
    color: '#FF9800',
    bgColor: '#FFF3E0',
  },
];

function Buildings() {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    facility: '',
    isAccessible: false,
    sort: 'name',
  });
  const [viewMode, setViewMode] = useState('grid');
  const [formOpen, setFormOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [buildingToDelete, setBuildingToDelete] = useState(null);

  const apiParams = useMemo(() => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.isAccessible) params.isAccessible = true;
    return params;
  }, [filters.status, filters.isAccessible]);

  const { data: buildings = [], isLoading, error, refetch } = useBuildings(apiParams);
  const createMutation = useCreateBuilding();
  const updateMutation = useUpdateBuilding();
  const deleteMutation = useDeleteBuilding();

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

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading buildings..." />;
  }

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
              <BuildingIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              <Typography variant="h4" fontWeight={700}>
                Buildings
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              Explore all campus buildings and facilities
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
            Add Building
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

      {/* Filters and View Toggle */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          All Buildings ({filteredBuildings.length})
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

      <BuildingFilters
        filters={filters}
        onFilterChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />

      {/* Building List */}
      {filteredBuildings.length === 0 ? (
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
          <BuildingIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom fontWeight={600}>
            No buildings found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your filters or create a new building
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateClick}>
            Add First Building
          </Button>
        </Paper>
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
          bottom: 24,
          right: 24,
          display: { xs: 'flex', sm: 'none' },
          boxShadow: '0 4px 12px rgba(27, 94, 32, 0.3)',
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
        PaperProps={{
          sx: { borderRadius: 2, maxWidth: 400 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{' '}
            <strong>{buildingToDelete?.buildingName}</strong>? This action cannot be undone.
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

export default Buildings;