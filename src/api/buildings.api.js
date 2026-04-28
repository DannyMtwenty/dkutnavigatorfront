import axios from './axios.config';
import axiosInstance from './axios.config';

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
  create: async (formData) => {
    try {
    const response = await axiosInstance.post('/buildings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  } catch (error) {
    console.log('API ERROR:', error.response?.data); // Log detailed error response
    throw error;
  }
  },

// buildings.api.js



  // Create building with image
  /*
    const response = await axiosInstance.post('/buildings', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}
}*/

  // Update building
  update: async (id, formData) => {
    try{
        const response = await axios.put(`/buildings/${id}`, formData, {
       headers: { 'Content-Type': 'multipart/form-data' },
      });
    return response.data;
    }
  
    catch (error) { 
       console.log('API UPDATE ERROR:', error.response?.data); // Log detailed error response
       throw error;
    }
  },

  // Delete building
  delete: async (id) => {
    const response = await axios.delete(`/buildings/${id}`);
    return response.data;
  },
};