import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MorseTrainer from './pages/MorseTrainer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/morse" element={<MorseTrainer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
