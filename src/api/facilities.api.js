import axios from './axios.config';

export const facilitiesAPI = {
  // Get all facilities
  getAll: async (params = {}) => {
    const response = await axios.get('/facilities', { params });
    return response.data;
  },

  // Get single facility
  getById: async (id) => {
    const response = await axios.get(`/facilities/${id}`);
    return response.data;
  },

  // Search facilities
  search: async (searchTerm, filters = {}) => {
    const response = await axios.get('/facilities/search', {
      params: { searchTerm, ...filters }
    });
    return response.data;
  },

  // Get nearby facilities
  getNearby: async (latitude, longitude, facilityType = null, radiusKm = 1.0, limit = 20) => {
    const response = await axios.get('/facilities/nearby', {
      params: { latitude, longitude, facilityType, radiusKm, limit }
    });
    return response.data;
  },

  // Get facility types
  getTypes: async () => {
    const response = await axios.get('/facilities/types');
    return response.data;
  },

  // Get facilities by type
  getByType: async (facilityType) => {
    const response = await axios.get(`/facilities/type/${facilityType}`);
    return response.data;
  },

  // Create facility
  create: async (data) => {
    const response = await axios.post('/facilities', data);
    return response.data;
  },

  // Update facility
  update: async (id, data) => {
    const response = await axios.put(`/facilities/${id}`, data);
    return response.data;
  },

  // Update operating hours
  updateHours: async (id, operatingHours) => {
    const response = await axios.patch(`/facilities/${id}/hours`, JSON.stringify(operatingHours), {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  // Delete facility
  delete: async (id) => {
    const response = await axios.delete(`/facilities/${id}`);
    return response.data;
  },
};