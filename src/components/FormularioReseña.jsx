import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSave, FaTimes, FaPlus, FaMinus, FaStar, FaComment } from 'react-icons/fa';
import { reseñaService, juegoService } from '../services/api';
import './FormularioReseña.css';

const FormularioReseña = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [juegos, setJuegos] = useState([]);
  
  const [formData, setFormData] = useState({
    juegoId: '',
    titulo: '',
    contenido: '',
    puntuacion: 0,
    pros: [''],
    contras: [''],
    horasJugadasParaReseña: 0,
    recomendado: true
  });

  const [errors, setErrors] = useState({});
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    cargarJuegos();
  }, []);

  const cargarJuegos = async () => {
    try {
      const response = await juegoService.getAll();
      setJuegos(response.data.data);
    } catch (error) {
      console.error('Error cargando juegos:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleArrayChange = (arrayName, index, value) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (arrayName) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], '']
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    if (formData[arrayName].length > 1) {
      setFormData(prev => ({
        ...prev,
        [arrayName]: prev[arrayName].filter((_, i) => i !== index)
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

    if (!formData.juegoId) {
      newErrors.juegoId = 'Debes seleccionar un juego';
    }

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título de la reseña es obligatorio';
    } else if (formData.titulo.length > 100) {
      newErrors.titulo = 'El título no puede tener más de 100 caracteres';
    }

    if (!formData.contenido.trim()) {
      newErrors.contenido = 'El contenido de la reseña es obligatorio';
    } else if (formData.contenido.length > 2000) {
      newErrors.contenido = 'La reseña no puede tener más de 2000 caracteres';
    }

    if (formData.puntuacion < 1 || formData.puntuacion > 5) {
      newErrors.puntuacion = 'La puntuación es obligatoria';
    }

    if (formData.horasJugadasParaReseña < 0) {
      newErrors.horasJugadasParaReseña = 'Las horas jugadas no pueden ser negativas';
    }

    // Validar que los arrays no tengan elementos vacíos
    const prosValidos = formData.pros.filter(pro => pro.trim() !== '');
    const contrasValidos = formData.contras.filter(contra => contra.trim() !== '');

    if (prosValidos.length === 0 && contrasValidos.length === 0) {
      newErrors.prosContras = 'Agrega al menos un punto positivo o negativo';
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
      // Filtrar elementos vacíos de los arrays
      const reseñaData = {
        ...formData,
        pros: formData.pros.filter(pro => pro.trim() !== ''),
        contras: formData.contras.filter(contra => contra.trim() !== ''),
        horasJugadasParaReseña: parseFloat(formData.horasJugadasParaReseña) || 0,
        puntuacion: parseInt(formData.puntuacion)
      };

      await reseñaService.create(reseñaData);
      alert('¡Reseña creada exitosamente!');
      navigate('/reseñas');
    } catch (error) {
      console.error('Error creando reseña:', error);
      alert('Error al crear la reseña: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/reseñas');
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

  const juegoSeleccionado = juegos.find(j => j._id === formData.juegoId);

  return (
    <motion.div 
      className="formulario-reseña"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="formulario-header">
        <h2>
          <FaComment /> Escribir Nueva Reseña
        </h2>
        <p>Comparte tu experiencia y opinión sobre un juego</p>
      </div>

      <form onSubmit={handleSubmit} className="formulario-contenido">
        <div className="form-grid">
          {/* Información Básica */}
          <div className="form-section">
            <h3>Información Básica</h3>
            
            <div className="form-group">
              <label htmlFor="juegoId">Juego a Reseñar *</label>
              <select
                id="juegoId"
                name="juegoId"
                value={formData.juegoId}
                onChange={handleChange}
                className={errors.juegoId ? 'error' : ''}
              >
                <option value="">Selecciona un juego</option>
                {juegos.map(juego => (
                  <option key={juego._id} value={juego._id}>
                    {juego.titulo} ({juego.añoLanzamiento})
                  </option>
                ))}
              </select>
              {errors.juegoId && <span className="error-message">{errors.juegoId}</span>}
            </div>

            {juegoSeleccionado && (
              <div className="juego-preview">
                <div className="juego-info">
                  {juegoSeleccionado.portada ? (
                    <img src={juegoSeleccionado.portada} alt={juegoSeleccionado.titulo} />
                  ) : (
                    <div className="portada-placeholder">
                      🎮
                    </div>
                  )}
                  <div className="juego-details">
                    <h4>{juegoSeleccionado.titulo}</h4>
                    <p>{juegoSeleccionado.desarrolladora} • {juegoSeleccionado.genero}</p>
                    <p>Plataforma: {juegoSeleccionado.plataforma}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="titulo">Título de la Reseña *</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className={errors.titulo ? 'error' : ''}
                placeholder="Ej: Una experiencia increíble que redefine el género..."
                maxLength={100}
              />
              <div className="char-counter">
                {formData.titulo.length}/100 caracteres
              </div>
              {errors.titulo && <span className="error-message">{errors.titulo}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="contenido">Contenido de la Reseña *</label>
              <textarea
                id="contenido"
                name="contenido"
                value={formData.contenido}
                onChange={handleChange}
                className={errors.contenido ? 'error' : ''}
                placeholder="Describe tu experiencia con el juego, qué te gustó, qué no te gustó, recomendaciones..."
                rows={6}
                maxLength={2000}
              />
              <div className="char-counter">
                {formData.contenido.length}/2000 caracteres
              </div>
              {errors.contenido && <span className="error-message">{errors.contenido}</span>}
            </div>
          </div>

          {/* Valoración y Detalles */}
          <div className="form-section">
            <h3>Valoración y Detalles</h3>
            
            <div className="form-group">
              <label>Puntuación General *</label>
              <div className="stars-container">
                {renderStars()}
                <span className="puntuacion-text">
                  {formData.puntuacion > 0 ? `${formData.puntuacion} estrellas` : 'Selecciona una puntuación'}
                </span>
              </div>
              {errors.puntuacion && <span className="error-message">{errors.puntuacion}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="horasJugadasParaReseña">Horas Jugadas</label>
                <input
                  type="number"
                  id="horasJugadasParaReseña"
                  name="horasJugadasParaReseña"
                  value={formData.horasJugadasParaReseña}
                  onChange={handleChange}
                  className={errors.horasJugadasParaReseña ? 'error' : ''}
                  min="0"
                  step="0.5"
                  placeholder="0"
                />
                {errors.horasJugadasParaReseña && <span className="error-message">{errors.horasJugadasParaReseña}</span>}
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="recomendado"
                    checked={formData.recomendado}
                    onChange={handleChange}
                  />
                  <span className="checkmark"></span>
                  ¿Recomendarías este juego?
                </label>
              </div>
            </div>

            {/* Puntos Positivos */}
            <div className="form-group">
              <label>Puntos Positivos</label>
              {formData.pros.map((pro, index) => (
                <div key={index} className="array-input-group">
                  <input
                    type="text"
                    value={pro}
                    onChange={(e) => handleArrayChange('pros', index, e.target.value)}
                    placeholder="Ej: Gráficos impresionantes, jugabilidad fluida..."
                    className="array-input"
                  />
                  {formData.pros.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('pros', index)}
                      className="btn-remove"
                    >
                      <FaMinus />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('pros')}
                className="btn-add"
              >
                <FaPlus /> Agregar punto positivo
              </button>
            </div>

            {/* Puntos a Mejorar */}
            <div className="form-group">
              <label>Puntos a Mejorar</label>
              {formData.contras.map((contra, index) => (
                <div key={index} className="array-input-group">
                  <input
                    type="text"
                    value={contra}
                    onChange={(e) => handleArrayChange('contras', index, e.target.value)}
                    placeholder="Ej: Optimización pobre, historia predecible..."
                    className="array-input"
                  />
                  {formData.contras.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('contras', index)}
                      className="btn-remove"
                    >
                      <FaMinus />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('contras')}
                className="btn-add"
              >
                <FaPlus /> Agregar punto a mejorar
              </button>
            </div>

            {errors.prosContras && (
              <span className="error-message">{errors.prosContras}</span>
            )}
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
            {loading ? 'Publicando...' : 'Publicar Reseña'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default FormularioReseña;
