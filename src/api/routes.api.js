import axios from './axios.config';

export const routesAPI = {
  // Get all routes
  getAll: async (params = {}) => {
    const response = await axios.get('/routes', { params });
    return response.data;
  },

  // Get single route
  getById: async (id) => {
    const response = await axios.get(`/routes/${id}`);
    return response.data;
  },

  // Get route between two locations
  getRoute: async (fromLocationId, toLocationId) => {
    const response = await axios.get('/routes', {
      params: { fromLocationId, toLocationId }
    });
    return response.data;
  },

  // Create route
  create: async (data) => {
    const response = await axios.post('/routes', data);
    return response.data;
  },

  // Update route
  update: async (id, data) => {
    const response = await axios.put(`/routes/${id}`, data);
    return response.data;
  },

  // Delete route
  delete: async (id) => {
    const response = await axios.delete(`/routes/${id}`);
    return response.data;
  },

  // Calculate route (custom endpoint for route calculation)
  calculate: async (fromLat, fromLng, toLat, toLng, accessible = false) => {
    const response = await axios.post('/routes/calculate', {
      fromLatitude: fromLat,
      fromLongitude: fromLng,
      toLatitude: toLat,
      toLongitude: toLng,
      isAccessible: accessible,
    });
    return response.data;
  },
};