import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { routesAPI } from '../api/routes.api';
import toast from 'react-hot-toast';

export const useRoutes = (params = {}) => {
  return useQuery({
    queryKey: ['routes', params],
    queryFn: () => routesAPI.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useRoute = (id) => {
  return useQuery({
    queryKey: ['route', id],
    queryFn: () => routesAPI.getById(id),
    enabled: !!id,
  });
};

export const useRouteCalculation = () => {
  return useMutation({
    mutationFn: ({ fromLat, fromLng, toLat, toLng, accessible }) =>
      routesAPI.calculate(fromLat, fromLng, toLat, toLng, accessible),
  });
};

export const useCreateRoute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: routesAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast.success('Route created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create route');
    },
  });
};

export const useUpdateRoute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => routesAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      queryClient.invalidateQueries({ queryKey: ['route', variables.id] });
      toast.success('Route updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update route');
    },
  });
};

export const useDeleteRoute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: routesAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast.success('Route deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete route');
    },
  });
};