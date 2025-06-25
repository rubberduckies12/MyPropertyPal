import axios from 'axios';

// Adjust the baseURL if your backend runs on a different host or port
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Example API functions for your routes and models

// Users
export const registerUser = (userData) => api.post('/users/register', userData);
export const getUser = (userId) => api.get(`/users/${userId}`);
export const deleteUser = (userId) => api.delete(`/users/${userId}`);

// Properties
export const createProperty = (propertyData) => api.post('/properties', propertyData);
export const getProperties = () => api.get('/properties');
export const getProperty = (propertyId) => api.get(`/properties/${propertyId}`);

// Payments
export const setRent = (rentData) => api.post('/payments/set-rent', rentData);
export const payRent = (paymentData) => api.post('/payments/pay', paymentData);
export const getPayments = () => api.get('/payments');

// Messages
export const sendMessage = (messageData) => api.post('/messages', messageData);
export const getConversation = (userA, userB) =>
  api.get(`/messages/conversation?userA=${userA}&userB=${userB}`);

// Export the axios instance for custom requests
export default api;