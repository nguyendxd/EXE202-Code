import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
import LoginForm from './pages/LoginForm';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ChatPage from './pages/ChatPage';
import AdminAccount from './pages/AdminAccount';
import ProfilePage from './pages/ProfilePage';

// Components
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import Footer from './components/Footer';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import { AuthProvider } from './contexts/AuthContext';
import AdminRoute from './routes/AdminRoute';
import UserWishlist from './pages/UserWishlist';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {isAdminRoute ? <AdminNavbar /> : <Navbar />}
      <ToastContainer />
      <div style={{ paddingTop: '90px' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/adopt" element={<AdoptPage />} />
          <Route path="/pets/:id" element={<PetDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/rescue-map" element={<RescueMapPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogDetailPage />} />
          <Route path="/donate" element={<DonatePage />} />

          {/* Public Routes - Chỉ cho phép người dùng chưa đăng nhập */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/login-form"
            element={
              <PublicRoute>
                <LoginForm />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            }
          />

          {/* Protected Routes - Chỉ cho phép người dùng đã đăng nhập */}
          <Route
            path="/user/:id"
            element={
              <PrivateRoute>
                <UserPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <PrivateRoute>
                <UserWishlist />
              </PrivateRoute>
            }
          />
          {/* Admin Route */}
          <Route path="/admin/account" element={<AdminRoute><AdminAccount /></AdminRoute>} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
      <ToastContainer />
    </BrowserRouter>
  );
}