import React, { useState, useRef, useCallback } from 'react';
import PDFToolLayout from '@/components/PDFToolLayout';
import { Document, Page, pdfjs } from 'react-pdf';
import Icons from '@/Icons';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const EditPDF = () => {
  const [currentView, setCurrentView] = useState('initial');
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
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

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setCurrentView('editing');
    }
  }, []);

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
    <div
      className={`text-center p-12 border-2 border-dashed rounded-lg transition-colors
        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
        ${isDragging ? 'animate-pulse' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
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
      <div className="flex gap-4">
        <div className="flex-grow bg-white rounded-lg shadow-sm">
          <div className="border-b p-4">
            <div className="flex gap-2">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleToolSelect(tool.id)}
                  className={`p-2 rounded flex items-center gap-2 transition-colors ${
                    selectedTool === tool.id 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {tool.icon && <tool.icon className="w-5 h-5" />}
                  <span className="text-sm">{tool.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative overflow-auto p-4" ref={canvasRef} onClick={handleAnnotation}>
            <Document
              file={file}
              onLoadSuccess={handleDocumentLoadSuccess}
              className="mx-auto"
            >
              <Page
                pageNumber={currentPage}
                scale={scale}
                className="shadow-lg"
              />
              {annotations
                .filter(ann => ann.page === currentPage)
                .map(annotation => (
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
            </Document>
          </div>
        </div>

        <div className="w-64 bg-white rounded-lg shadow-sm p-4 space-y-6">
          <div>
            <h3 className="font-medium mb-2">Page Navigation</h3>
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm">
                Page {currentPage} of {numPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
                disabled={currentPage >= numPages}
                className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Zoom</h3>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-600 mt-1">
              {Math.round(scale * 100)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <PDFToolLayout
      title="Edit PDF"
      description="Modify your PDF files easily"
      icon={Icons.edit}
    >
      <div 
        className="flex-grow flex items-center justify-center p-4"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {currentView === 'initial' && renderInitialView()}
        {currentView === 'editing' && renderEditingView()}
        
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
              setFile(selectedFile);
              setCurrentView('editing');
            }
          }}
          className="hidden"
          id="file-input"
        />
      </div>
    </PDFToolLayout>
  );
};

export default EditPDF; 