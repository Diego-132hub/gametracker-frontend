import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaTrash, FaEdit, FaClock, FaGamepad } from 'react-icons/fa';
import { juegoService } from '../services/api';
import AnimatedCard from './AnimatedCard';
import './TarjetaJuego.css';

const TarjetaJuego = ({ juego, onJuegoActualizado, index }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const getEstadoColor = (estado) => {
    const colores = {
      'Por jugar': '#6b7280',
      'Jugando': '#3b82f6',
      'Completado': '#10b981',
      'Abandonado': '#ef4444'
    };
    return colores[estado] || '#6b7280';
  };

  const getEstadoIcon = (estado) => {
    const iconos = {
      'Por jugar': '⏳',
      'Jugando': '🎮',
      'Completado': '✅',
      'Abandonado': '❌'
    };
    return iconos[estado] || '🎮';
  };

  const renderEstrellas = (puntuacion) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <FaStar 
        key={i} 
        className={i < puntuacion ? 'estrella-llena' : 'estrella-vacia'}
        size={16}
      />
    ));
  };

  const eliminarJuego = async () => {
    if (window.confirm(`¿Estás seguro de eliminar "${juego.titulo}"?`)) {
      setIsDeleting(true);
      try {
        await juegoService.delete(juego._id);
        setTimeout(() => {
          onJuegoActualizado();
        }, 500);
      } catch (error) {
        console.error('Error eliminando juego:', error);
        setIsDeleting(false);
      }
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return 'No especificada';
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  return (
    <AnimatePresence>
      {!isDeleting && (
        <AnimatedCard 
          className="tarjeta-juego"
          delay={index}
        >
          <motion.div 
            className="tarjeta-portada"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {juego.portada ? (
              <img src={juego.portada} alt={juego.titulo} />
            ) : (
              <div className="portada-placeholder">
                <FaGamepad size={40} />
              </div>
            )}
            <motion.span 
              className="estado-badge"
              style={{ backgroundColor: getEstadoColor(juego.estado) }}
              whileHover={{ scale: 1.1 }}
            >
              {getEstadoIcon(juego.estado)} {juego.estado}
            </motion.span>
          </motion.div>

          <div className="tarjeta-contenido">
            <motion.h3 
              className="juego-titulo"
              whileHover={{ color: '#3b82f6' }}
            >
              {juego.titulo}
            </motion.h3>
            
            <div className="juego-meta">
              <span className="juego-desarrolladora">{juego.desarrolladora}</span>
              <span className="juego-año">{juego.añoLanzamiento}</span>
            </div>
            
            <div className="juego-tags">
              <span className="tag genero">{juego.genero}</span>
              <span className="tag plataforma">{juego.plataforma}</span>
            </div>
            
            <div className="juego-info">
              <motion.div 
                className="puntuacion"
                whileHover={{ scale: 1.1 }}
              >
                {renderEstrellas(juego.puntuacion)}
                <span className="puntuacion-texto">
                  {juego.puntuacion > 0 ? `${juego.puntuacion}/5` : 'Sin puntuar'}
                </span>
              </motion.div>
              
              {juego.horasJugadas > 0 && (
                <motion.div 
                  className="horas"
                  whileHover={{ scale: 1.1 }}
                >
                  <FaClock /> {juego.horasJugadas}h
                </motion.div>
              )}
            </div>

            {(juego.fechaInicio || juego.fechaFin) && (
              <div className="juego-fechas">
                {juego.fechaInicio && (
                  <div className="fecha">
                    <span>Inicio: {formatFecha(juego.fechaInicio)}</span>
                  </div>
                )}
                {juego.fechaFin && (
                  <div className="fecha">
                    <span>Fin: {formatFecha(juego.fechaFin)}</span>
                  </div>
                )}
              </div>
            )}

            <motion.div 
              className="tarjeta-acciones"
              initial={{ opacity: 0.7 }}
              whileHover={{ opacity: 1 }}
            >
              <motion.a 
                href={`/editar-juego/${juego._id}`} 
                className="btn-editar"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaEdit /> Editar
              </motion.a>
              
              <motion.button 
                onClick={eliminarJuego} 
                className="btn-eliminar"
                whileHover={{ scale: 1.05, backgroundColor: '#dc2626' }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTrash /> Eliminar
              </motion.button>
            </motion.div>
          </div>
        </AnimatedCard>
      )}
    </AnimatePresence>
  );
};

export default TarjetaJuego;
