import React from 'react'
import AdminNavbar from './AdminNavbar'
import Footer from './Footer'

export default function AdminLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AdminNavbar />
      <main
        style={{
          flex: 1,
          fontFamily: "'Roboto', sans-serif",
          backgroundColor: "#FAF3E0",
          padding: "20px",
          paddingTop: 100,
          marginTop: 0,
        }}
      >
        {children}
      </main>
      <Footer />
    </div>
  )
} 