import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaChartBar, 
  FaGamepad, 
  FaClock, 
  FaStar, 
  FaTrophy, 
  FaCalendarAlt,
  FaDownload
} from 'react-icons/fa';
import { juegoService, reseñaService } from '../services/api';
import './EstadisticasPersonales.css';

const EstadisticasPersonales = ({ juegos }) => {
  const [estadisticas, setEstadisticas] = useState(null);
  const [estadisticasReseñas, setEstadisticasReseñas] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, [juegos]);

  const cargarEstadisticas = async () => {
    try {
      const [juegosStats, reseñasStats] = await Promise.all([
        juegoService.getEstadisticas(),
        reseñaService.getEstadisticas()
      ]);

      setEstadisticas(juegosStats.data.data);
      setEstadisticasReseñas(reseñasStats.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      setLoading(false);
    }
  };

  const generarReportePDF = () => {
    alert('¡Funcionalidad de exportar PDF será implementada próximamente!');
    // Aquí iría la lógica para generar el PDF
  };

  if (loading) {
    return (
      <div className="estadisticas-loading">
        <div className="loading-spinner"></div>
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  if (!estadisticas) {
    return (
      <div className="sin-estadisticas">
        <h3>No hay datos suficientes para mostrar estadísticas</h3>
        <p>Agrega algunos juegos a tu biblioteca para ver estadísticas</p>
      </div>
    );
  }

  const {
    totalJuegos,
    juegosCompletados,
    juegosJugando,
    totalHoras,
    juegoMasJugado,
    generosStats
  } = estadisticas;

  const porcentajeCompletados = totalJuegos > 0 ? (juegosCompletados / totalJuegos) * 100 : 0;
  const porcentajeJugando = totalJuegos > 0 ? (juegosJugando / totalJuegos) * 100 : 0;

  return (
    <div className="estadisticas">
      <div className="estadisticas-header">
        <div className="header-info">
          <h2><FaChartBar /> Dashboard de Estadísticas</h2>
          <p>Resumen completo de tu experiencia gaming</p>
        </div>
        <motion.button
          className="btn btn-primary"
          onClick={generarReportePDF}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaDownload /> Exportar Reporte
        </motion.button>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="resumen-cards">
        <motion.div 
          className="resumen-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="card-icon total">
            <FaGamepad />
          </div>
          <div className="card-content">
            <h3>{totalJuegos}</h3>
            <p>Total de Juegos</p>
          </div>
        </motion.div>

        <motion.div 
          className="resumen-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card-icon completados">
            <FaTrophy />
          </div>
          <div className="card-content">
            <h3>{juegosCompletados}</h3>
            <p>Juegos Completados</p>
          </div>
        </motion.div>

        <motion.div 
          className="resumen-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="card-icon horas">
            <FaClock />
          </div>
          <div className="card-content">
            <h3>{totalHoras}</h3>
            <p>Horas Totales</p>
          </div>
        </motion.div>

        <motion.div 
          className="resumen-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="card-icon jugando">
            <FaStar />
          </div>
          <div className="card-content">
            <h3>{juegosJugando}</h3>
            <p>Jugando Actualmente</p>
          </div>
        </motion.div>
      </div>

      <div className="estadisticas-grid">
        {/* Distribución por Estado */}
        <motion.div 
          className="estadistica-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3>Distribución por Estado</h3>
          <div className="estado-bars">
            <div className="estado-bar">
              <div className="bar-label">
                <span>Completados</span>
                <span>{juegosCompletados} ({porcentajeCompletados.toFixed(1)}%)</span>
              </div>
              <div className="bar-container">
                <div 
                  className="bar-fill completado"
                  style={{ width: `${porcentajeCompletados}%` }}
                ></div>
              </div>
            </div>

            <div className="estado-bar">
              <div className="bar-label">
                <span>Jugando</span>
                <span>{juegosJugando} ({porcentajeJugando.toFixed(1)}%)</span>
              </div>
              <div className="bar-container">
                <div 
                  className="bar-fill jugando"
                  style={{ width: `${porcentajeJugando}%` }}
                ></div>
              </div>
            </div>

            <div className="estado-bar">
              <div className="bar-label">
                <span>Por Jugar</span>
                <span>
                  {totalJuegos - juegosCompletados - juegosJugando} 
                  ({((totalJuegos - juegosCompletados - juegosJugando) / totalJuegos * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="bar-container">
                <div 
                  className="bar-fill por-jugar"
                  style={{ 
                    width: `${((totalJuegos - juegosCompletados - juegosJugando) / totalJuegos * 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Distribución por Género */}
        <motion.div 
          className="estadistica-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3>Distribución por Género</h3>
          <div className="generos-list">
            {generosStats.slice(0, 8).map((genero, index) => {
              const porcentaje = (genero.count / totalJuegos) * 100;
              return (
                <div key={genero._id} className="genero-item">
                  <div className="genero-info">
                    <span className="genero-nombre">{genero._id}</span>
                    <span className="genero-count">{genero.count}</span>
                  </div>
                  <div className="genero-bar-container">
                    <div 
                      className="genero-bar"
                      style={{ width: `${porcentaje}%` }}
                    ></div>
                  </div>
                  <span className="genero-porcentaje">{porcentaje.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
          {generosStats.length > 8 && (
            <div className="mas-generos">
              +{generosStats.length - 8} géneros más
            </div>
          )}
        </motion.div>

        {/* Juego Más Jugado */}
        {juegoMasJugado && (
          <motion.div 
            className="estadistica-card destacado"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h3><FaTrophy /> Juego Más Jugado</h3>
            <div className="juego-destacado">
              <div className="juego-portada">
                {juegoMasJugado.portada ? (
                  <img src={juegoMasJugado.portada} alt={juegoMasJugado.titulo} />
                ) : (
                  <div className="portada-placeholder">
                    <FaGamepad />
                  </div>
                )}
              </div>
              <div className="juego-info">
                <h4>{juegoMasJugado.titulo}</h4>
                <p>{juegoMasJugado.desarrolladora}</p>
                <div className="juego-stats">
                  <div className="stat">
                    <FaClock />
                    <span>{juegoMasJugado.horasJugadas} horas</span>
                  </div>
                  <div className="stat">
                    <FaStar />
                    <span>{juegoMasJugado.puntuacion}/5</span>
                  </div>
                  <div className="stat">
                    <FaCalendarAlt />
                    <span>{juegoMasJugado.estado}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Estadísticas de Reseñas */}
        {estadisticasReseñas && (
          <motion.div 
            className="estadistica-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h3>Estadísticas de Reseñas</h3>
            <div className="reseñas-stats">
              <div className="reseña-stat">
                <span className="stat-number">{estadisticasReseñas.totalReseñas}</span>
                <span className="stat-label">Reseñas Totales</span>
              </div>
              <div className="reseña-stat">
                <span className="stat-number">{estadisticasReseñas.promedioPuntuacion.toFixed(1)}</span>
                <span className="stat-label">Puntuación Promedio</span>
              </div>
              <div className="reseña-stat">
                <span className="stat-number">
                  {estadisticasReseñas.juegosMejorCalificados?.length || 0}
                </span>
                <span className="stat-label">Juegos Mejor Calificados</span>
              </div>
            </div>

            {estadisticasReseñas.juegosMejorCalificados && 
             estadisticasReseñas.juegosMejorCalificados.length > 0 && (
              <div className="mejor-calificados">
                <h4>Top Juegos Mejor Calificados</h4>
                {estadisticasReseñas.juegosMejorCalificados.slice(0, 3).map((juego, index) => (
                  <div key={juego._id} className="top-juego">
                    <span className="rank">{index + 1}</span>
                    <span className="juego-titulo">{juego.juegoInfo.titulo}</span>
                    <span className="puntuacion-promedio">
                      {juego.avgPuntuacion.toFixed(1)}/5
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Metas Personales */}
      <motion.div 
        className="metas-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <h3>🎯 Metas Personales</h3>
        <div className="metas-grid">
          <div className="meta-card">
            <h4>Completar 10 Juegos</h4>
            <div className="meta-progress">
              <div 
                className="progress-fill"
                style={{ width: `${Math.min((juegosCompletados / 10) * 100, 100)}%` }}
              ></div>
            </div>
            <span>{juegosCompletados}/10 completados</span>
          </div>

          <div className="meta-card">
            <h4>100 Horas de Juego</h4>
            <div className="meta-progress">
              <div 
                className="progress-fill"
                style={{ width: `${Math.min((totalHoras / 100) * 100, 100)}%` }}
              ></div>
            </div>
            <span>{totalHoras}/100 horas</span>
          </div>

          <div className="meta-card">
            <h4>5 Reseñas Escritas</h4>
            <div className="meta-progress">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${Math.min(((estadisticasReseñas?.totalReseñas || 0) / 5) * 100, 100)}%` 
                }}
              ></div>
            </div>
            <span>{(estadisticasReseñas?.totalReseñas || 0)}/5 reseñas</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EstadisticasPersonales;
