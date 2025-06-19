// API utilities for the hotel reservation app
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }
  
  return response.json();
};

// Users API
export const usersAPI = {
  getAll: () => apiCall('/users'),
  getById: (id) => apiCall(`/users/${id}`),
  create: (userData) => apiCall('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  update: (id, userData) => apiCall(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  delete: (id) => apiCall(`/users/${id}`, {
    method: 'DELETE',
  }),
};

// Hotels API
export const hotelsAPI = {
  getAll: () => apiCall('/hotels'),
  getById: (id) => apiCall(`/hotels/${id}`),
  create: (hotelData) => apiCall('/hotels', {
    method: 'POST',
    body: JSON.stringify(hotelData),
  }),
  update: (id, hotelData) => apiCall(`/hotels/${id}`, {
    method: 'PUT',
    body: JSON.stringify(hotelData),
  }),
  delete: (id) => apiCall(`/hotels/${id}`, {
    method: 'DELETE',
  }),
  getRoomTypes: (hotelId) => apiCall(`/hotels/${hotelId}/room-types`),
  addRoomType: (hotelId, roomTypeData) => apiCall(`/hotels/${hotelId}/room-types`, {
    method: 'POST',
    body: JSON.stringify(roomTypeData),
  }),
};

// Room Types API
export const roomTypesAPI = {
  getInventory: (roomTypeId, date) => {
    const params = date ? `?date=${date}` : '';
    return apiCall(`/room-types/${roomTypeId}/inventory${params}`);
  },
  addInventory: (roomTypeId, inventoryData) => apiCall(`/room-types/${roomTypeId}/inventory`, {
    method: 'POST',
    body: JSON.stringify(inventoryData),
  }),
  updateInventory: (id, inventoryData) => apiCall(`/room-inventory/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(inventoryData),
  }),
};

// Reservations API
export const reservationsAPI = {
  getAll: () => apiCall('/reservations'),
  getById: (id) => apiCall(`/reservations/${id}`),
  create: (reservationData) => apiCall('/reservations', {
    method: 'POST',
    body: JSON.stringify(reservationData),
  }),
  delete: (id) => apiCall(`/reservations/${id}`, {
    method: 'DELETE',
  }),
}; 