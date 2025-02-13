import React from 'react'
import image1 from '@/assets/image-1.png'
const Hero = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center justify-between">
      <div className="md:w-1/2 mb-8 md:mb-0">
        <img 
          src={image1} 
          alt="PDF Editor Illustration" 
          className="w-full max-w-lg mx-auto"
        />
      </div>

      <div className="md:w-1/2 md:pl-12">
        <h1 className="text-4xl font-bold mb-4">
          Edit & Customize Your PDFs Easily
        </h1>
        <p className="text-gray-600 mb-2">
          Modify your PDFs like a pro—no software required!
        </p>
        <p className="text-gray-600 mb-8">
          Make quick edits, highlight important text, and add annotations with ease.
        </p>
        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center">
          Start Editing Now
          <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none">
            <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Hero 