import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
// import AdoptPage from './pages/AdoptPage'
// import PostPage from './pages/PostPage'
// import BlogPage from './pages/BlogPage'
// import LoginPage from './pages/LoginPage'
// import RegisterPage from './pages/RegisterPage'
// import AboutPage from './pages/AboutPage'
import Navbar from './components/Navbar'
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ paddingTop: '90px' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* <Route path="/adopt" element={<AdoptPage />} />
          <Route path="/posts" element={<PostPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  )
}