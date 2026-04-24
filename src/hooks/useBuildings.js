import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { buildingsAPI } from '@api/buildings.api';
import { toast } from 'react-hot-toast'; // We'll add this package

export const useBuildings = (params = {}) => {
  return useQuery({
    queryKey: ['buildings', params],
    queryFn: () => buildingsAPI.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBuilding = (id) => {
  return useQuery({
    queryKey: ['building', id],
    queryFn: () => buildingsAPI.getById(id),
    enabled: !!id,
  });
};

export const useBuildingFloors = (id) => {
  return useQuery({
    queryKey: ['building-floors', id],
    queryFn: () => buildingsAPI.getFloors(id),
    enabled: !!id,
  });
};

export const useBuildingLocations = (id) => {
  return useQuery({
    queryKey: ['building-locations', id],
    queryFn: () => buildingsAPI.getLocations(id),
    enabled: !!id,
  });
};

export const useCreateBuilding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: buildingsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
      toast.success('Building created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create building');
    },
  });
};

export const useUpdateBuilding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => buildingsAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
      queryClient.invalidateQueries({ queryKey: ['building', variables.id] });
      toast.success('Building updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update building');
    },
  });
};

export const useDeleteBuilding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: buildingsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
      toast.success('Building deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete building');
    },
  });
};