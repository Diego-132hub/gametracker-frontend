import axios from 'axios';

// Para desarrollo local y GitHub Pages
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:10000/api'
  : 'https://gametracker-backend-8tg9.onrender.com/api'; // Backend en Render

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      // El servidor respondió con un código de error
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      console.error('No response received:', error.request);
    } else {
      // Algo pasó al configurar la solicitud
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

// Servicios para Juegos
export const juegoService = {
  getAll: () => api.get('/juegos'),
  getById: (id) => api.get(`/juegos/${id}`),
  create: (juego) => api.post('/juegos', juego),
  update: (id, juego) => api.put(`/juegos/${id}`, juego),
  delete: (id) => api.delete(`/juegos/${id}`),
  getEstadisticas: () => api.get('/juegos/estadisticas')
};

// Servicios para Reseñas
export const reseñaService = {
  getAll: () => api.get('/reseñas'),
  getByJuegoId: (juegoId) => api.get(`/reseñas/juego/${juegoId}`),
  create: (reseña) => api.post('/reseñas', reseña),
  update: (id, reseña) => api.put(`/reseñas/${id}`, reseña),
  delete: (id) => api.delete(`/reseñas/${id}`),
  getEstadisticas: () => api.get('/reseñas/estadisticas')
};

export default api;
