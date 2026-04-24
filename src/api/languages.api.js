import axios from './axios.config';

export const languagesAPI = {
  // Get all languages
  getAll: async () => {
    const response = await axios.get('/languages');
    return response.data;
  },

  // Get active languages
  getActive: async () => {
    const response = await axios.get('/languages/active');
    return response.data;
  },

  // Get single language
  getById: async (id) => {
    const response = await axios.get(`/languages/${id}`);
    return response.data;
  },

  // Create language
  create: async (data) => {
    const response = await axios.post('/languages', data);
    return response.data;
  },

  // Update language
  update: async (id, data) => {
    const response = await axios.put(`/languages/${id}`, data);
    return response.data;
  },

  // Delete language
  delete: async (id) => {
    const response = await axios.delete(`/languages/${id}`);
    return response.data;
  },
};