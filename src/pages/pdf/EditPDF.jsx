import React, { useState, useRef } from 'react';
import PDFToolLayout from '@/components/PDFToolLayout';
import { useFileOperation } from '@/hooks/useFileOperation';
import Icons from '@/Icons';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const EditPDF = () => {
  const [currentView, setCurrentView] = useState('initial');
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [annotations, setAnnotations] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const canvasRef = useRef(null);

  const tools = [
    { id: 'text', name: 'Add Text', icon: Icons?.text },
    { id: 'draw', name: 'Draw', icon: Icons?.pen },
    { id: 'highlight', name: 'Highlight', icon: Icons?.highlight },
    { id: 'shape', name: 'Add Shape', icon: Icons?.shape },
  ];

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleToolSelect = (toolId) => {
    setSelectedTool(toolId);
  };

  const handleAnnotation = (e) => {
    if (!selectedTool) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newAnnotation = {
      id: Date.now(),
      tool: selectedTool,
      x,
      y,
      page: currentPage,
    };

    setAnnotations([...annotations, newAnnotation]);
  };

  const renderInitialView = () => (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-2">Edit PDF Online</h1>
      <p className="text-gray-600 mb-6">Modify your PDF files easily</p>
      <button
        onClick={() => document.getElementById('file-input').click()}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mb-4"
      >
        Select PDF File
      </button>
      <p className="text-gray-500">or drop PDF file here</p>
    </div>
  );

  const renderEditingView = () => (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex gap-4 mb-4">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => handleToolSelect(tool.id)}
            className={`p-2 rounded ${
              selectedTool === tool.id ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            <tool.icon className="w-6 h-6" />
            <span className="text-sm">{tool.name}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        <div className="flex-1 border rounded-lg p-4">
          <Document
            file={file}
            onLoadSuccess={handleDocumentLoadSuccess}
            className="pdf-document"
          >
            <div className="relative" onClick={handleAnnotation} ref={canvasRef}>
              <Page
                pageNumber={currentPage}
                scale={scale}
                className="pdf-page"
              />
              {annotations
                .filter((ann) => ann.page === currentPage)
                .map((annotation) => (
                  <div
                    key={annotation.id}
                    className="absolute"
                    style={{
                      left: annotation.x,
                      top: annotation.y,
                    }}
                  >
                    {/* Render annotation based on tool type */}
                  </div>
                ))}
            </div>
          </Document>
        </div>

        <div className="w-64 border rounded-lg p-4">
          <div className="mb-4">
            <h3 className="font-bold mb-2">Page Navigation</h3>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="px-2 py-1 bg-gray-100 rounded"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {numPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
                disabled={currentPage >= numPages}
                className="px-2 py-1 bg-gray-100 rounded"
              >
                Next
              </button>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-bold mb-2">Zoom</h3>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <PDFToolLayout
      title="Edit PDF"
      description="Modify your PDF files easily"
      icon={Icons.pdf}
    >
      <div className="flex-grow flex items-center justify-center p-4">
        {currentView === 'initial' && renderInitialView()}
        {currentView === 'editing' && renderEditingView()}
        
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setCurrentView('editing');
          }}
          className="hidden"
          id="file-input"
        />
      </div>
    </PDFToolLayout>
  );
};

export default EditPDF; 