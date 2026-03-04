import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Converter from './pages/Converter';
import History from './pages/History';
import Charts from './pages/Charts';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100 bg-light">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/converter" element={<Converter />} />
            <Route path="/history" element={<History />} />
            <Route path="/charts" element={<Charts />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
