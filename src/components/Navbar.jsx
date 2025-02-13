import React from 'react'
import { logo } from '@/assets'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/">
          <img src={logo} alt="Convertly" className="h-8" />
        </Link>
      </div>
      
      {/* Main Navigation */}
      <div className="hidden md:flex items-center space-x-6">
        <Link to="/" className="text-gray-700 hover:text-gray-900">Home</Link>
        <div className="relative group">
          <Link to="/tools" className="text-gray-700 hover:text-gray-900 inline-flex items-center">
            All Tools
            <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        <Link to="/compress" className="text-gray-700 hover:text-gray-900">Compress</Link>
        <Link to="/edit" className="text-gray-700 hover:text-gray-900">Edit</Link>
        <Link to="/fill-sign" className="text-gray-700 hover:text-gray-900">Fill & Sign</Link>
        <Link to="/merge" className="text-gray-700 hover:text-gray-900">Merge</Link>
        <Link to="/delete-pages" className="text-gray-700 hover:text-gray-900">Delete Pages</Link>
        <Link to="/crop" className="text-gray-700 hover:text-gray-900">Crop</Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button className="text-gray-700 hover:text-gray-900">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  )
}

export default Navbar