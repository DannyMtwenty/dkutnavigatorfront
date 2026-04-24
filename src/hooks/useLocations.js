import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { locationsAPI } from '@api/locations.api';
import { toast } from 'react-hot-toast';

export const useLocations = (params = {}) => {
  return useQuery({
    queryKey: ['locations', params],
    queryFn: () => locationsAPI.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useLocation = (id) => {
  return useQuery({
    queryKey: ['location', id],
    queryFn: () => locationsAPI.getById(id),
    enabled: !!id,
  });
};

export const useSearchLocations = (searchTerm, filters = {}) => {
  return useQuery({
    queryKey: ['locations-search', searchTerm, filters],
    queryFn: () => locationsAPI.search(searchTerm, filters),
    enabled: !!searchTerm && searchTerm.length > 2,
  });
};

export const useNearbyLocations = (latitude, longitude, radiusKm = 1.0, limit = 20) => {
  return useQuery({
    queryKey: ['locations-nearby', latitude, longitude, radiusKm, limit],
    queryFn: () => locationsAPI.getNearby(latitude, longitude, radiusKm, limit),
    enabled: !!latitude && !!longitude,
  });
};

export const useLocationTypes = () => {
  return useQuery({
    queryKey: ['location-types'],
    queryFn: locationsAPI.getTypes,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useLocationFacilities = (id) => {
  return useQuery({
    queryKey: ['location-facilities', id],
    queryFn: () => locationsAPI.getFacilities(id),
    enabled: !!id,
  });
};

export const useCreateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: locationsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Location created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create location');
    },
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => locationsAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.invalidateQueries({ queryKey: ['location', variables.id] });
      toast.success('Location updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update location');
    },
  });
};

export const useUpdateLocationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => locationsAPI.updateStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.invalidateQueries({ queryKey: ['location', variables.id] });
      toast.success('Location status updated!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    },
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: locationsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Location deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete location');
    },
  });
};