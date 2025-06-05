import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/index.css';

// Pages
import LandingPage from './pages/LandingPage';
import AdoptPage from './pages/AdoptPage';
import AboutPage from './pages/AboutPage';
import DonatePage from './pages/DonatePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PetDetailPage from './pages/PetDetailPage';
import RescueMapPage from './pages/RescueMapPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogPageDetail';
import UserPage from './pages/UserPage';
import { LoginForm } from './pages/LoginForm';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ToastContainer />
      <div style={{ paddingTop: '90px' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/adopt" element={<AdoptPage />} />
          <Route path="/pets/:id" element={<PetDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/login-form" element={<LoginForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/rescue-map" element={<RescueMapPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogDetailPage />} />
          <Route path="/user/:id" element={<UserPage />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}
