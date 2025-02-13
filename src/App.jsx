import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
// Import new pages
import Home from '@/pages/Home'
import JpgToPdf from '@/pages/JpgToPdf'

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jpg-to-pdf" element={<JpgToPdf />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App;
