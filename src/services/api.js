import axios from 'axios';

// Configuración automática para producción/desarrollo
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://tu-backend-en-render.com/api'  // Actualizar después con tu backend en producción
  : 'http://localhost:5000/api';

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
