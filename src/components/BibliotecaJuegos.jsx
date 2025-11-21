import React, { useState, useEffect } from 'react';
import TarjetaJuego from './TarjetaJuego';
import { juegoService } from '../services/api';
import './BibliotecaJuegos.css';

const BibliotecaJuegos = ({ juegos, onJuegoActualizado }) => {
  const [juegosState, setJuegosState] = useState(juegos);
  const [loading, setLoading] = useState(!juegos.length);
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState('recientes');

  useEffect(() => {
    if (!juegos.length) {
      cargarJuegos();
    } else {
      setJuegosState(juegos);
    }
  }, [juegos]);

  const cargarJuegos = async () => {
    try {
      const response = await juegoService.getAll();
      setJuegosState(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando juegos:', error);
      setLoading(false);
    }
  };

  const juegosFiltrados = juegosState.filter(juego => {
    // Filtro por estado
    if (filtro !== 'todos' && juego.estado !== filtro) {
      return false;
    }
    
    // Filtro por búsqueda
    if (busqueda) {
      const termino = busqueda.toLowerCase();
      return (
        juego.titulo.toLowerCase().includes(termino) ||
        juego.desarrolladora.toLowerCase().includes(termino) ||
        juego.genero.toLowerCase().includes(termino)
      );
    }
    
    return true;
  });

  // Ordenar juegos
  const juegosOrdenados = [...juegosFiltrados].sort((a, b) => {
    switch (orden) {
      case 'recientes':
        return new Date(b.fechaAgregado) - new Date(a.fechaAgregado);
      case 'antiguos':
        return new Date(a.fechaAgregado) - new Date(b.fechaAgregado);
      case 'titulo':
        return a.titulo.localeCompare(b.titulo);
      case 'puntuacion':
        return b.puntuacion - a.puntuacion;
      case 'horas':
        return b.horasJugadas - a.horasJugadas;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="biblioteca-loading">
        <div className="loading-spinner"></div>
        <p>Cargando tu biblioteca...</p>
      </div>
    );
  }

  return (
    <div className="biblioteca">
      <div className="biblioteca-header">
        <div className="biblioteca-info">
          <h2>📚 Mi Biblioteca de Juegos</h2>
          <p>Gestiona tu colección personal de videojuegos</p>
        </div>
        
        <div className="biblioteca-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Buscar juegos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filtros-container">
            <select 
              value={filtro} 
              onChange={(e) => setFiltro(e.target.value)}
              className="filtro-select"
            >
              <option value="todos">Todos los estados</option>
              <option value="Por jugar">Por jugar</option>
              <option value="Jugando">Jugando</option>
              <option value="Completado">Completados</option>
              <option value="Abandonado">Abandonados</option>
            </select>

            <select 
              value={orden} 
              onChange={(e) => setOrden(e.target.value)}
              className="orden-select"
            >
              <option value="recientes">Más recientes</option>
              <option value="antiguos">Más antiguos</option>
              <option value="titulo">Por título</option>
              <option value="puntuacion">Mejor puntuados</option>
              <option value="horas">Más horas jugadas</option>
            </select>
          </div>
        </div>
      </div>

      <div className="biblioteca-stats">
        <div className="stat-card">
          <span className="stat-number">{juegosState.length}</span>
          <span className="stat-label">Total juegos</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {juegosState.filter(j => j.estado === 'Completado').length}
          </span>
          <span className="stat-label">Completados</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {juegosState.reduce((total, j) => total + j.horasJugadas, 0)}
          </span>
          <span className="stat-label">Horas totales</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {juegosFiltrados.length}
          </span>
          <span className="stat-label">Filtrados</span>
        </div>
      </div>

      <div className="juegos-grid">
        {juegosOrdenados.map((juego, index) => (
          <TarjetaJuego 
            key={juego._id} 
            juego={juego} 
            onJuegoActualizado={onJuegoActualizado}
            index={index}
          />
        ))}
      </div>

      {juegosOrdenados.length === 0 && (
        <div className="sin-juegos">
          <div className="sin-juegos-icon">🎮</div>
          <h3>No hay juegos en tu biblioteca</h3>
          <p>Comienza agregando tu primer juego a la colección</p>
          <a href="/agregar-juego" className="btn btn-primary">
            ➕ Agregar primer juego
          </a>
        </div>
      )}
    </div>
  );
};

export default BibliotecaJuegos;
