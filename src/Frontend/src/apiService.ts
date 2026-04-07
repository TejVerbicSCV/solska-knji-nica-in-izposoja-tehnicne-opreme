import axios from 'axios';
import type { User, LibraryItem } from './types';

export const BASE_BACKEND_URL = 'http://localhost:5123';
const API_BASE_URL = `${BASE_BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Image upload
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.url;
  },
  // Auth
  login: async (email: string, password: string): Promise<User> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: any): Promise<User> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getLanguages: async (): Promise<any[]> => {
    const response = await api.get('/jeziki');
    return response.data;
  },

  getCategories: async (): Promise<any[]> => {
    const response = await api.get('/kategorije');
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

  addBook: async (bookData: any): Promise<any> => {
    const response = await api.post('/knjige', bookData);
    return response.data;
  },

  addEquipment: async (equipmentData: any): Promise<any> => {
    const response = await api.post('/oprema', equipmentData);
    return response.data;
  },

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
