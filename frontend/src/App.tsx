import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DeckControl from './pages/DeckControl';
import PokemonView from './pages/PokemonView';

function App() {
  return (
    <Router>
      <Routes>
        {/* Panel de control principal */}
        <Route path="/deck" element={<DeckControl />} />

        {/* Ruta dinámica para cada slot de pokemon (0 al 5, etc) */}
        <Route path="/pkmn/:id" element={<PokemonView />} />

        {/* Ruta por defecto o 404 */}
        <Route path="*" element={<div>Página no encontrada</div>} />
      </Routes>
    </Router>
  );
}

export default App;