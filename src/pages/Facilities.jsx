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
  Grid,
  Card,
  CardContent,
  Stack,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  LocalHospital as FacilityIcon,
  Restaurant as RestaurantIcon,
  Book as LibraryIcon,
  LocalParking as ParkingIcon,
  AttachMoney as AtmIcon,
} from '@mui/icons-material';
import FacilityList from '../components/facilities/FacilityList';
import FacilityFilters from '../components/facilities/FacilityFilters';
import FacilityForm from '../components/facilities/FacilityForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import {
  useFacilities,
  useCreateFacility,
  useUpdateFacility,
  useDeleteFacility,
} from '../hooks/useFacilities';

const statsCards = [
  {
    title: '45',
    subtitle: 'Total Facilities',
    icon: <FacilityIcon sx={{ fontSize: 32 }} />,
    color: '#4CAF50',
    bgColor: '#E8F5E9',
  },
  {
    title: '8',
    subtitle: 'Cafeterias',
    icon: <RestaurantIcon sx={{ fontSize: 32 }} />,
    color: '#FF9800',
    bgColor: '#FFF3E0',
  },
  {
    title: '3',
    subtitle: 'Libraries',
    icon: <LibraryIcon sx={{ fontSize: 32 }} />,
    color: '#9C27B0',
    bgColor: '#F3E5F5',
  },
  {
    title: '12',
    subtitle: 'Parking Lots',
    icon: <ParkingIcon sx={{ fontSize: 32 }} />,
    color: '#607D8B',
    bgColor: '#ECEFF1',
  },
];

function Facilities() {
  const [filters, setFilters] = useState({
    search: '',
    facilityType: '',
    isAccessible: false,
  });
  const [formOpen, setFormOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState(null);

  const apiParams = useMemo(() => {
    const params = {};
    if (filters.facilityType) params.facilityType = filters.facilityType;
    if (filters.isAccessible) params.isAccessible = true;
    return params;
  }, [filters]);

  const { data: facilities = [], isLoading, error, refetch } = useFacilities(apiParams);
  const createMutation = useCreateFacility();
  const updateMutation = useUpdateFacility();
  const deleteMutation = useDeleteFacility();

  const filteredFacilities = useMemo(() => {
    if (!filters.search) return facilities;
    const searchLower = filters.search.toLowerCase();
    return facilities.filter(
      (facility) =>
        facility.name?.toLowerCase().includes(searchLower) ||
        facility.description?.toLowerCase().includes(searchLower) ||
        facility.facilityType?.toLowerCase().includes(searchLower)
    );
  }, [facilities, filters.search]);

  const handleCreateClick = () => {
    setEditingFacility(null);
    setFormOpen(true);
  };

  const handleEditClick = (facility) => {
    setEditingFacility(facility);
    setFormOpen(true);
  };

  const handleDeleteClick = (facilityId) => {
    const facility = facilities.find((f) => f.facilityId === facilityId);
    setFacilityToDelete(facility);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data) => {
    if (editingFacility) {
      await updateMutation.mutateAsync({
        id: editingFacility.facilityId,
        data,
      });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleDeleteConfirm = async () => {
    if (facilityToDelete) {
      await deleteMutation.mutateAsync(facilityToDelete.facilityId);
      setDeleteDialogOpen(false);
      setFacilityToDelete(null);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading facilities..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error.response?.data?.message || 'Failed to load facilities'}
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
              <FacilityIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              <Typography variant="h4" fontWeight={700}>
                Facilities
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              Discover campus amenities and services
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
            Add Facility
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

      {/* Count */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          All Facilities ({filteredFacilities.length})
        </Typography>
      </Box>

      <FacilityFilters filters={filters} onFilterChange={setFilters} />

      {/* Facility List */}
      {filteredFacilities.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 2,
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <FacilityIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom fontWeight={600}>
            No facilities found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your filters or create a new facility
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateClick}>
            Add First Facility
          </Button>
        </Box>
      ) : (
        <FacilityList facilities={filteredFacilities} />
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

      <FacilityForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingFacility}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 2, maxWidth: 400 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{facilityToDelete?.name}</strong>? This action
            cannot be undone.
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

export default Facilities;