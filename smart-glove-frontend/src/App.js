

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import './App.css';
import './styles/global.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route Page d'Accueil */}
          <Route path="/" element={<Home />} />
          
          {/* Route Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Route 404 - Page non trouvée */}
          <Route 
            path="*" 
            element={
              <div className="error-container">
                <div className="error-icon">🔍</div>
                <h1 className="error-title">404 - Page Non Trouvée</h1>
                <p className="error-message">
                  Désolé, la page que vous recherchez n'existe pas.
                </p>
                <a href="/" className="error-button">
                  Retour à l'Accueil
                </a>
              </div>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;