import axios from './axios.config';

export const buildingsAPI = {
  // Get all buildings
  getAll: async (params = {}) => {
    const response = await axios.get('/buildings', { params });
    return response.data;
  },

  // Get single building
  getById: async (id) => {
    const response = await axios.get(`/buildings/${id}`);
    return response.data;
  },

  // Get building floors
  getFloors: async (id) => {
    const response = await axios.get(`/buildings/${id}/floors`);
    return response.data;
  },

  // Get building locations
  getLocations: async (id) => {
    const response = await axios.get(`/buildings/${id}/locations`);
    return response.data;
  },

  // Create building
  create: async (data) => {
    const response = await axios.post('/buildings', data);
    return response.data;
  },

  // Update building
  update: async (id, data) => {
    const response = await axios.put(`/buildings/${id}`, data);
    return response.data;
  },

  // Delete building
  delete: async (id) => {
    const response = await axios.delete(`/buildings/${id}`);
    return response.data;
  },
};