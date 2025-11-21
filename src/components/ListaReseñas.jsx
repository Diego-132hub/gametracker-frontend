import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaPlus, FaComment, FaGamepad } from 'react-icons/fa';
import { reseñaService, juegoService } from '../services/api';
import './ListaReseñas.css';

const ListaReseñas = () => {
  const [reseñas, setReseñas] = useState([]);
  const [juegos, setJuegos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroJuego, setFiltroJuego] = useState('todos');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [reseñasResponse, juegosResponse] = await Promise.all([
        reseñaService.getAll(),
        juegoService.getAll()
      ]);

      setReseñas(reseñasResponse.data.data);
      setJuegos(juegosResponse.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setLoading(false);
    }
  };

  const reseñasFiltradas = filtroJuego === 'todos' 
    ? reseñas 
    : reseñas.filter(reseña => reseña.juegoId._id === filtroJuego);

  const renderEstrellas = (puntuacion) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <FaStar 
        key={i} 
        className={i < puntuacion ? 'estrella-llena' : 'estrella-vacia'}
        size={16}
      />
    ));
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="reseñas-loading">
        <div className="loading-spinner"></div>
        <p>Cargando reseñas...</p>
      </div>
    );
  }

  return (
    <div className="lista-reseñas">
      <div className="reseñas-header">
        <div className="reseñas-info">
          <h2><FaComment /> Reseñas de Juegos</h2>
          <p>Comparte tu experiencia y opiniones sobre los juegos que has jugado</p>
        </div>
        
        <div className="reseñas-actions">
          <select 
            value={filtroJuego} 
            onChange={(e) => setFiltroJuego(e.target.value)}
            className="filtro-juego"
          >
            <option value="todos">Todos los juegos</option>
            {juegos.map(juego => (
              <option key={juego._id} value={juego._id}>
                {juego.titulo}
              </option>
            ))}
          </select>
          
          <a href="/agregar-reseña" className="btn btn-primary">
            <FaPlus /> Nueva Reseña
          </a>
        </div>
      </div>

      <div className="reseñas-stats">
        <div className="stat-card">
          <span className="stat-number">{reseñas.length}</span>
          <span className="stat-label">Total reseñas</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {reseñas.filter(r => r.recomendado).length}
          </span>
          <span className="stat-label">Recomendados</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {(reseñas.reduce((sum, r) => sum + r.puntuacion, 0) / reseñas.length || 0).toFixed(1)}
          </span>
          <span className="stat-label">Puntuación promedio</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {new Set(reseñas.map(r => r.juegoId._id)).size}
          </span>
          <span className="stat-label">Juegos reseñados</span>
        </div>
      </div>

      <div className="reseñas-grid">
        {reseñasFiltradas.map((reseña, index) => (
          <motion.div
            key={reseña._id}
            className="reseña-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}
          >
            <div className="reseña-header">
              <div className="juego-info">
                <div className="juego-portada">
                  {reseña.juegoId.portada ? (
                    <img src={reseña.juegoId.portada} alt={reseña.juegoId.titulo} />
                  ) : (
                    <div className="portada-placeholder">
                      <FaGamepad />
                    </div>
                  )}
                </div>
                <div className="juego-details">
                  <h3 className="juego-titulo">{reseña.juegoId.titulo}</h3>
                  <p className="juego-desarrolladora">{reseña.juegoId.desarrolladora}</p>
                  <div className="reseña-meta">
                    <span className="fecha-reseña">{formatFecha(reseña.fechaReseña)}</span>
                    {reseña.horasJugadasParaReseña > 0 && (
                      <span className="horas-reseña">
                        • {reseña.horasJugadasParaReseña}h jugadas
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="reseña-rating">
                <div className="puntuacion">
                  {renderEstrellas(reseña.puntuacion)}
                  <span className="puntuacion-numero">{reseña.puntuacion}/5</span>
                </div>
                <div className={`recomendacion ${reseña.recomendado ? 'recomendado' : 'no-recomendado'}`}>
                  {reseña.recomendado ? '👍 Recomendado' : '👎 No recomendado'}
                </div>
              </div>
            </div>

            <div className="reseña-contenido">
              <h4 className="reseña-titulo">{reseña.titulo}</h4>
              <p className="reseña-texto">{reseña.contenido}</p>
              
              {(reseña.pros.length > 0 || reseña.contras.length > 0) && (
                <div className="reseña-listas">
                  {reseña.pros.length > 0 && (
                    <div className="pros-contras">
                      <h5>✅ Puntos positivos:</h5>
                      <ul>
                        {reseña.pros.map((pro, index) => (
                          <li key={index}>{pro}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {reseña.contras.length > 0 && (
                    <div className="pros-contras">
                      <h5>❌ Puntos a mejorar:</h5>
                      <ul>
                        {reseña.contras.map((contra, index) => (
                          <li key={index}>{contra}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="reseña-actions">
              <button className="btn-editar">Editar</button>
              <button className="btn-eliminar">Eliminar</button>
            </div>
          </motion.div>
        ))}
      </div>

      {reseñasFiltradas.length === 0 && (
        <div className="sin-reseñas">
          <div className="sin-reseñas-icon">📝</div>
          <h3>No hay reseñas</h3>
          <p>
            {reseñas.length === 0 
              ? 'Comienza compartiendo tu opinión sobre los juegos que has jugado' 
              : 'No hay reseñas para el juego seleccionado'
            }
          </p>
          <a href="/agregar-reseña" className="btn btn-primary">
            <FaPlus /> Escribir primera reseña
          </a>
        </div>
      )}
    </div>
  );
};

export default ListaReseñas;
