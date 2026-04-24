import axios from './axios.config';

export const floorsAPI = {
  // Get all floors
  getAll: async (params = {}) => {
    const response = await axios.get('/floors', { params });
    return response.data;
  },

  // Get single floor
  getById: async (id) => {
    const response = await axios.get(`/floors/${id}`);
    return response.data;
  },

  // Get floor by building and number
  getByBuildingAndNumber: async (buildingId, floorNumber) => {
    const response = await axios.get(`/floors/Building/${buildingId}/Floor/${floorNumber}`);
    return response.data;
  },

  // Get floor locations
  getLocations: async (id) => {
    const response = await axios.get(`/floors/${id}/locations`);
    return response.data;
  },

  // Create floor
  create: async (data) => {
    const response = await axios.post('/floors', data);
    return response.data;
  },

  // Update floor
  update: async (id, data) => {
    const response = await axios.put(`/floors/${id}`, data);
    return response.data;
  },

  // Update floor map
  updateMap: async (id, mapImageUrl) => {
    const response = await axios.patch(`/floors/${id}/map`, JSON.stringify(mapImageUrl), {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  // Delete floor
  delete: async (id) => {
    const response = await axios.delete(`/floors/${id}`);
    return response.data;
  },
};