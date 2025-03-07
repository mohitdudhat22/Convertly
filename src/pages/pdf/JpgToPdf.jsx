import React, { useState, useCallback, useEffect } from 'react';
import PDFToolLayout from '@/components/PDFToolLayout';
import { useFileOperation } from '@/hooks/useFileOperation';
import { convertImagesToPDF } from '@/utils/pdfUtils';
import Icons from '@/Icons';

const JpgToPdf = () => {
  const [currentView, setCurrentView] = useState('initial');
  const [files, setFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [pageSize, setPageSize] = useState('A4');
  const [orientation, setOrientation] = useState('portrait');
  const [margin, setMargin] = useState('none');
  const [mergeAll, setMergeAll] = useState(true);
  const { execute, loading, error } = useFileOperation(convertImagesToPDF);

  const pageSizeOptions = ['A4', 'Letter', 'Legal', 'A3'];

  // Create and manage URLs for the images
  useEffect(() => {
    // Create URLs for all files
    const urls = files.map(file => URL.createObjectURL(file));
    setImageUrls(urls);
    
    // Clean up function to revoke object URLs when component unmounts or files change
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [files]);

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

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/')
    );
    if (droppedFiles.length > 0) {
      setFiles(prev => [...prev, ...droppedFiles]);
      setCurrentView('editing');
    }
  }, []);

  const handleFileAdd = (e) => {
    const newFiles = Array.from(e.target.files).filter(
      file => file.type.startsWith('image/')
    );
    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleConvert = async () => {
    try {
      const options = {
        pageSize,
        orientation,
        margin,
        mergeAll
      };

      const convertedPDF = await execute(files, options);
      const url = URL.createObjectURL(convertedPDF);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted.pdf';
      a.click();
      URL.revokeObjectURL(url);
      setCurrentView('complete');
    } catch (err) {
      console.error('Conversion failed:', err);
    }
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
        Select Images
      </button>
      <p className="text-gray-500">or drop image files here</p>
    </div>
  );

  const renderEditingView = () => (
    <div className="max-w-4xl mx-auto p-4">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 mb-6 transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <div className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={imageUrls[index]}
                  alt={file.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM5OTk5OTkiPkltYWdlPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
              </div>
              <div className="absolute top-0 right-0 p-1">
                <button
                  onClick={() => removeFile(index)}
                  className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm mt-1 truncate">{file.name}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => document.getElementById('file-input').click()}
          className="w-full py-2 border-2 border-dashed border-blue-300 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
        >
          + Add more images
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Page Size:</label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value)}
            className="w-full border rounded p-2"
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Orientation:</label>
          <select
            value={orientation}
            onChange={(e) => setOrientation(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Margin:</label>
          <select
            value={margin}
            onChange={(e) => setMargin(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="none">None</option>
            <option value="small">Small (0.5")</option>
            <option value="large">Large (1")</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="mergeAll"
            checked={mergeAll}
            onChange={(e) => setMergeAll(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="mergeAll" className="text-sm">
            Merge all images into one PDF
          </label>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-center mb-4">
          Error: {error}
        </div>
      )}

      <button
        onClick={handleConvert}
        disabled={loading || files.length === 0}
        className={`w-full ${
          loading || files.length === 0 ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
        } text-white py-2 rounded transition-colors`}
      >
        {loading ? 'Converting...' : 'Convert to PDF'}
      </button>
    </div>
  );

  const renderCompleteView = () => (
    <div className="text-center p-8">
      <div className="mb-6">
        <div className="w-16 h-16 mx-auto mb-4 text-green-500">
          <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-lg font-medium">Conversion Complete!</p>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => {
            setFiles([]);
            setCurrentView('initial');
          }}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
        >
          Convert More
        </button>
        <button
          onClick={handleConvert}
          className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded transition-colors"
        >
          Download Again
        </button>
      </div>
    </div>
  );

  return (
    <PDFToolLayout
      title="JPG to PDF"
      description="Convert Images to PDF"
      icon={Icons.jpgTopdf}
    >
      <div 
        className="flex-grow flex items-center justify-center p-4"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {currentView === 'initial' && renderInitialView()}
        {currentView === 'editing' && renderEditingView()}
        {currentView === 'complete' && renderCompleteView()}
        
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            handleFileAdd(e);
            setCurrentView('editing');
          }}
          className="hidden"
          id="file-input"
        />
      </div>
    </PDFToolLayout>
  );
};

export default JpgToPdf;