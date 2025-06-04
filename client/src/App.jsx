import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import { LoginForm } from './pages/LoginForm'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
// import AdoptPage from './pages/AdoptPage'
// import PostPage from './pages/PostPage'
// import BlogPage from './pages/BlogPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
// import AboutPage from './pages/AboutPage'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import RescueMapPage from './pages/RescueMapPage'
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div style={{ paddingTop: '90px' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login-form" element={<LoginForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />}/>
          <Route path="/rescue-map" element={<RescueMapPage />} />
        </Routes>
      </div>

      <Footer />
    </BrowserRouter>
  )
}
