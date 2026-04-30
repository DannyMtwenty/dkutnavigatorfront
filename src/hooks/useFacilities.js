import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { facilitiesAPI } from '../api/facilities.api';
import toast from 'react-hot-toast';

export const useFacilities = (params = {}) => {
  return useQuery({
    queryKey: ['facilities', params],
    queryFn: () => facilitiesAPI.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useFacility = (id) => {
  return useQuery({
    queryKey: ['facility', id],
    queryFn: () => facilitiesAPI.getById(id),
    enabled: !!id,
  });
};

export const useSearchFacilities = (searchTerm, filters = {}) => {
  return useQuery({
    queryKey: ['facilities-search', searchTerm, filters],
    queryFn: () => facilitiesAPI.search(searchTerm, filters),
    enabled: !!searchTerm && searchTerm.length > 2,
  });
};

export const useNearbyFacilities = (latitude, longitude, facilityType = null, radiusKm = 1.0, limit = 20) => {
  return useQuery({
    queryKey: ['facilities-nearby', latitude, longitude, facilityType, radiusKm, limit],
    queryFn: () => facilitiesAPI.getNearby(latitude, longitude, facilityType, radiusKm, limit),
    enabled: !!latitude && !!longitude,
  });
};

export const useFacilityTypes = () => {
  return useQuery({
    queryKey: ['facility-types'],
    queryFn: facilitiesAPI.getTypes,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useFacilitiesByType = (facilityType) => {
  return useQuery({
    queryKey: ['facilities-by-type', facilityType],
    queryFn: () => facilitiesAPI.getByType(facilityType),
    enabled: !!facilityType,
  });
};

export const useCreateFacility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: facilitiesAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      toast.success('Facility created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create facility');
    },
  });
};

export const useUpdateFacility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => facilitiesAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      queryClient.invalidateQueries({ queryKey: ['facility', variables.id] });
      toast.success('Facility updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update facility');
    },
  });
};

export const useUpdateFacilityHours = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, operatingHours }) => facilitiesAPI.updateHours(id, operatingHours),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      queryClient.invalidateQueries({ queryKey: ['facility', variables.id] });
      toast.success('Operating hours updated!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update hours');
    },
  });
};

export const useDeleteFacility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: facilitiesAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      toast.success('Facility deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete facility');
    },
  });
};