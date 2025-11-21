import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BibliotecaJuegos from './components/BibliotecaJuegos';
import FormularioJuego from './components/FormularioJuego';
import ListaReseñas from './components/ListaReseñas';
import FormularioReseña from './components/FormularioReseña';
import EstadisticasPersonales from './components/EstadisticasPersonales';
import { juegoService } from './services/api';
import './App.css';

function App() {
  const [juegos, setJuegos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarJuegos();
  }, []);

  const cargarJuegos = async () => {
    try {
      const response = await juegoService.getAll();
      setJuegos(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando juegos:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div>Cargando GameTracker...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="container">
            <h1>🎮 GameTracker</h1>
            <p>Tu biblioteca personal de videojuegos</p>
            <nav className="app-nav">
              <a href="/">📚 Biblioteca</a>
              <a href="/reseñas">⭐ Reseñas</a>
              <a href="/estadisticas">📊 Estadísticas</a>
              <a href="/agregar-juego" className="btn-agregar">
                ➕ Agregar Juego
              </a>
            </nav>
          </div>
        </header>

        <main className="main-content">
          <div className="container">
            <Routes>
              <Route 
                path="/" 
                element={
                  <BibliotecaJuegos 
                    juegos={juegos} 
                    onJuegoActualizado={cargarJuegos} 
                  />
                } 
              />
              <Route 
                path="/agregar-juego" 
                element={
                  <FormularioJuego 
                    onJuegoAgregado={cargarJuegos} 
                  />
                } 
              />
              <Route 
                path="/editar-juego/:id" 
                element={
                  <FormularioJuego 
                    onJuegoActualizado={cargarJuegos} 
                  />
                } 
              />
              <Route 
                path="/reseñas" 
                element={<ListaReseñas />} 
              />
              <Route 
                path="/agregar-reseña" 
                element={<FormularioReseña />} 
              />
              <Route 
                path="/estadisticas" 
                element={
                  <EstadisticasPersonales 
                    juegos={juegos} 
                  />
                } 
              />
            </Routes>
          </div>
        </main>

        <footer className="app-footer">
          <div className="container">
            <p>&copy; 2025 GameTracker. Desarrollado con ❤️ para gamers.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
