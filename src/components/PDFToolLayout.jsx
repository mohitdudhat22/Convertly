import React from 'react'

const PDFToolLayout = ({ 
  children, 
  title, 
  description, 
  icon 
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-4xl w-full mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4">{icon}</div>
            <h1 className="text-2xl font-bold mb-2">{title}</h1>
            <p className="text-gray-600">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

export default PDFToolLayout 