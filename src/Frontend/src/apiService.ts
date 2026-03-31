import axios from 'axios';
import type { User, LibraryItem } from './types';

const API_BASE_URL = 'http://localhost:5123/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Auth
  login: async (email: string, password: string): Promise<User> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: any): Promise<User> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Items
  getItems: async (): Promise<LibraryItem[]> => {
    const response = await api.get('/items');
    return response.data;
  },

  // Reservations
  reserveItem: async (reservationData: any): Promise<any> => {
    const response = await api.post('/reservations', reservationData);
    return response.data;
  },

  getReservations: async (): Promise<any[]> => {
    const response = await api.get('/reservations');
    return response.data;
  },

  // updateReservationStatus removed — buttons kept in UI but non-functional

  // Loans
  getLoans: async (): Promise<any[]> => {
    const response = await api.get('/loans');
    return response.data;
  },

  returnItem: async (id: number, returnData: any): Promise<any> => {
    const response = await api.put(`/loans/${id}/return`, returnData);
    return response.data;
  },

  // (Add more endpoints for loans, reservations etc. as needed)
};

export default apiService;
