import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
// Import new pages
import Home from '@/pages/Home'
import EditPDF from '@/pages/pdf/EditPDF'
import CompressPDF from '@/pages/pdf/CompressPDF'
import ProtectPDF from '@/pages/pdf/ProtectPDF'
import PDFToJPG from '@/pages/pdf/PDFToJPG'
import JpgToPdf from '@/pages/pdf/JpgToPdf'
import SplitPDF from '@/pages/pdf/SplitPDF'
import MergePDF from '@/pages/pdf/MergePDF'
import PDFToWord from '@/pages/pdf/PDFToWord'
import ExtractPages from '@/pages/pdf/ExtractPages'

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit" element={<EditPDF />} />
        <Route path="/compress" element={<CompressPDF />} />
        <Route path="/protect" element={<ProtectPDF />} />
        <Route path="/pdf-to-jpg" element={<PDFToJPG />} />
        <Route path="/jpg-to-pdf" element={<JpgToPdf />} />
        <Route path="/split" element={<SplitPDF />} />
        <Route path="/merge" element={<MergePDF />} />
        <Route path="/pdf-to-word" element={<PDFToWord />} />
        <Route path="/extract" element={<ExtractPages />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App;
