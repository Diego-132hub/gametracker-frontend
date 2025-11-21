import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSave, FaTimes, FaGamepad, FaClock, FaStar } from 'react-icons/fa';
import { juegoService } from '../services/api';
import './FormularioJuego.css';

const FormularioJuego = ({ onJuegoAgregado, onJuegoActualizado }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isEditing] = useState(!!id);
  
  const [formData, setFormData] = useState({
    titulo: '',
    desarrolladora: '',
    genero: '',
    plataforma: '',
    añoLanzamiento: new Date().getFullYear(),
    portada: '',
    estado: 'Por jugar',
    puntuacion: 0,
    horasJugadas: 0,
    fechaInicio: '',
    fechaFin: ''
  });

  const [errors, setErrors] = useState({});
  const [hoveredStar, setHoveredStar] = useState(0);

  const generos = [
    'Acción', 'Aventura', 'RPG', 'Estrategia', 'Deportes',
    'Carreras', 'Shooter', 'Indie', 'Simulación', 'Terror',
    'Plataformas', 'Lucha', 'Mundo abierto'
  ];

  const plataformas = [
    'PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile', 'Multiplataforma'
  ];

  const estados = [
    'Por jugar', 'Jugando', 'Completado', 'Abandonado'
  ];

  useEffect(() => {
    if (isEditing) {
      cargarJuego();
    }
  }, [id, isEditing]);

  const cargarJuego = async () => {
    try {
      const response = await juegoService.getById(id);
      const juego = response.data.data;
      
      setFormData({
        titulo: juego.titulo || '',
        desarrolladora: juego.desarrolladora || '',
        genero: juego.genero || '',
        plataforma: juego.plataforma || '',
        añoLanzamiento: juego.añoLanzamiento || new Date().getFullYear(),
        portada: juego.portada || '',
        estado: juego.estado || 'Por jugar',
        puntuacion: juego.puntuacion || 0,
        horasJugadas: juego.horasJugadas || 0,
        fechaInicio: juego.fechaInicio ? juego.fechaInicio.split('T')[0] : '',
        fechaFin: juego.fechaFin ? juego.fechaFin.split('T')[0] : ''
      });
    } catch (error) {
      console.error('Error cargando juego:', error);
      alert('Error al cargar el juego');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleStarClick = (puntuacion) => {
    setFormData(prev => ({
      ...prev,
      puntuacion
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es obligatorio';
    }

    if (!formData.desarrolladora.trim()) {
      newErrors.desarrolladora = 'La desarrolladora es obligatoria';
    }

    if (!formData.genero) {
      newErrors.genero = 'El género es obligatorio';
    }

    if (!formData.plataforma) {
      newErrors.plataforma = 'La plataforma es obligatoria';
    }

    if (!formData.añoLanzamiento || formData.añoLanzamiento < 1970 || formData.añoLanzamiento > new Date().getFullYear() + 5) {
      newErrors.añoLanzamiento = 'El año de lanzamiento no es válido';
    }

    if (formData.horasJugadas < 0) {
      newErrors.horasJugadas = 'Las horas jugadas no pueden ser negativas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const juegoData = {
        ...formData,
        añoLanzamiento: parseInt(formData.añoLanzamiento),
        horasJugadas: parseFloat(formData.horasJugadas) || 0,
        puntuacion: parseInt(formData.puntuacion) || 0,
        fechaInicio: formData.fechaInicio || undefined,
        fechaFin: formData.fechaFin || undefined
      };

      if (isEditing) {
        await juegoService.update(id, juegoData);
        if (onJuegoActualizado) onJuegoActualizado();
        alert('¡Juego actualizado exitosamente!');
      } else {
        await juegoService.create(juegoData);
        if (onJuegoAgregado) onJuegoAgregado();
        alert('¡Juego agregado exitosamente!');
      }

      navigate('/');
    } catch (error) {
      console.error('Error guardando juego:', error);
      alert('Error al guardar el juego: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, index) => {
      const starValue = index + 1;
      return (
        <motion.button
          key={starValue}
          type="button"
          className={`star-button ${starValue <= (hoveredStar || formData.puntuacion) ? 'active' : ''}`}
          onClick={() => handleStarClick(starValue)}
          onMouseEnter={() => setHoveredStar(starValue)}
          onMouseLeave={() => setHoveredStar(0)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaStar size={24} />
        </motion.button>
      );
    });
  };

  return (
    <motion.div 
      className="formulario-juego"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="formulario-header">
        <h2>
          <FaGamepad /> 
          {isEditing ? 'Editar Juego' : 'Agregar Nuevo Juego'}
        </h2>
        <p>
          {isEditing 
            ? 'Modifica la información de tu juego' 
            : 'Completa la información para agregar un nuevo juego a tu biblioteca'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="formulario-contenido">
        <div className="form-grid">
          {/* Información Básica */}
          <div className="form-section">
            <h3>Información Básica</h3>
            
            <div className="form-group">
              <label htmlFor="titulo">Título del Juego *</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className={errors.titulo ? 'error' : ''}
                placeholder="Ej: The Legend of Zelda: Breath of the Wild"
              />
              {errors.titulo && <span className="error-message">{errors.titulo}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="desarrolladora">Desarrolladora *</label>
              <input
                type="text"
                id="desarrolladora"
                name="desarrolladora"
                value={formData.desarrolladora}
                onChange={handleChange}
                className={errors.desarrolladora ? 'error' : ''}
                placeholder="Ej: Nintendo"
              />
              {errors.desarrolladora && <span className="error-message">{errors.desarrolladora}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="genero">Género *</label>
                <select
                  id="genero"
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  className={errors.genero ? 'error' : ''}
                >
                  <option value="">Selecciona un género</option>
                  {generos.map(genero => (
                    <option key={genero} value={genero}>{genero}</option>
                  ))}
                </select>
                {errors.genero && <span className="error-message">{errors.genero}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="plataforma">Plataforma *</label>
                <select
                  id="plataforma"
                  name="plataforma"
                  value={formData.plataforma}
                  onChange={handleChange}
                  className={errors.plataforma ? 'error' : ''}
                >
                  <option value="">Selecciona una plataforma</option>
                  {plataformas.map(plataforma => (
                    <option key={plataforma} value={plataforma}>{plataforma}</option>
                  ))}
                </select>
                {errors.plataforma && <span className="error-message">{errors.plataforma}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="añoLanzamiento">Año de Lanzamiento *</label>
                <input
                  type="number"
                  id="añoLanzamiento"
                  name="añoLanzamiento"
                  value={formData.añoLanzamiento}
                  onChange={handleChange}
                  className={errors.añoLanzamiento ? 'error' : ''}
                  min="1970"
                  max={new Date().getFullYear() + 5}
                />
                {errors.añoLanzamiento && <span className="error-message">{errors.añoLanzamiento}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="portada">URL de la Portada</label>
                <input
                  type="url"
                  id="portada"
                  name="portada"
                  value={formData.portada}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/portada.jpg"
                />
              </div>
            </div>
          </div>

          {/* Progreso y Valoración */}
          <div className="form-section">
            <h3>Progreso y Valoración</h3>
            
            <div className="form-group">
              <label htmlFor="estado">Estado *</label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
              >
                {estados.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Puntuación</label>
              <div className="stars-container">
                {renderStars()}
                <span className="puntuacion-text">
                  {formData.puntuacion > 0 ? `${formData.puntuacion} estrellas` : 'Sin puntuar'}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="horasJugadas">
                <FaClock /> Horas Jugadas
              </label>
              <input
                type="number"
                id="horasJugadas"
                name="horasJugadas"
                value={formData.horasJugadas}
                onChange={handleChange}
                className={errors.horasJugadas ? 'error' : ''}
                min="0"
                step="0.5"
                placeholder="0"
              />
              {errors.horasJugadas && <span className="error-message">{errors.horasJugadas}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fechaInicio">Fecha de Inicio</label>
                <input
                  type="date"
                  id="fechaInicio"
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="fechaFin">Fecha de Finalización</label>
                <input
                  type="date"
                  id="fechaFin"
                  name="fechaFin"
                  value={formData.fechaFin}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <motion.button
            type="button"
            onClick={handleCancel}
            className="btn btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            <FaTimes /> Cancelar
          </motion.button>
          
          <motion.button
            type="submit"
            className="btn btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            <FaSave /> 
            {loading ? 'Guardando...' : (isEditing ? 'Actualizar Juego' : 'Agregar Juego')}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default FormularioJuego;
