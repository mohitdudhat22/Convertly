import React from 'react'
import Icons from '../Icons'
import { useNavigate } from 'react-router-dom'

const ToolCard = ({ icon, title, description, path }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(path)}
      className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="w-12 h-12 mb-4">{icon}</div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}

const PDFTools = () => {
  const navigate = useNavigate();

  const tools = [
    { icon: Icons.pdf, title: "Edit PDF", description: "Modify text, images, and links in your PDFs", path: "/edit" },
    { icon: Icons.compress, title: "Compress PDF", description: "Reduce file size without losing quality", path: "/compress" },
    { icon: Icons.protect, title: "Protect PDF", description: "Add passwords and encrypt your PDFs", path: "/protect" },
    { icon: Icons.pdfTojpg, title: "PDF to JPG", description: "Convert PDF pages into high-quality images", path: "/pdf-to-jpg" },
    { icon: Icons.jpgTopdf, title: "JPG to PDF", description: "Turn images into a PDF file", path: "/jpg-to-pdf" },
    { icon: Icons.split, title: "Split PDF", description: "Extract specific pages or split large PDFs into multiple files", path: "/split" },
    { icon: Icons.merge, title: "Merge PDF", description: "Combine multiple PDFs into one document", path: "/merge" },
    { icon: Icons.pdftoWord, title: "PDF to Word", description: "Convert PDFs into fully editable Word documents", path: "/pdf-to-word" },
    { icon: Icons.extract, title: "Extract Pages", description: "Get a new document containing only the desired pages", path: "/extract" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-12">
        All the PDF Tools You Need – In One Place!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <ToolCard
            key={index}
            icon={tool.icon}
            title={tool.title}
            description={tool.description}
            path={tool.path}
          />
        ))}
      </div>

      <div className="text-center mt-8">
        <button 
          onClick={() => navigate('/tools')}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          See All PDF Tools
        </button>
      </div>
    </div>
  )
}

export default PDFTools 