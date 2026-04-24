import axios from './axios.config';

export const locationsAPI = {
  // Get all locations
  getAll: async (params = {}) => {
    const response = await axios.get('/locations', { params });
    return response.data;
  },

  // Get single location
  getById: async (id) => {
    const response = await axios.get(`/locations/${id}`);
    return response.data;
  },

  // Search locations
  search: async (searchTerm, filters = {}) => {
    const response = await axios.get('/locations/search', {
      params: { searchTerm, ...filters }
    });
    return response.data;
  },

  // Get nearby locations
  getNearby: async (latitude, longitude, radiusKm = 1.0, limit = 20) => {
    const response = await axios.get('/locations/nearby', {
      params: { latitude, longitude, radiusKm, limit }
    });
    return response.data;
  },

  // Get location types
  getTypes: async () => {
    const response = await axios.get('/locations/types');
    return response.data;
  },

  // Get location facilities
  getFacilities: async (id) => {
    const response = await axios.get(`/locations/${id}/facilities`);
    return response.data;
  },

  // Create location
  create: async (data) => {
    const response = await axios.post('/locations', data);
    return response.data;
  },

  // Update location
  update: async (id, data) => {
    const response = await axios.put(`/locations/${id}`, data);
    return response.data;
  },

  // Update location status
  updateStatus: async (id, status) => {
    const response = await axios.patch(`/locations/${id}/status`, JSON.stringify(status), {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  // Delete location
  delete: async (id) => {
    const response = await axios.delete(`/locations/${id}`);
    return response.data;
  },
};