import React, { useState, useCallback } from 'react';
import PDFToolLayout from '@/components/PDFToolLayout';
import { useFileOperation } from '@/hooks/useFileOperation';
import { compressPDF } from '@/utils/pdfUtils';
import Icons from '@/Icons';

const CompressPDF = () => {
  const [currentView, setCurrentView] = useState('initial');
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState('medium');
  const { execute, loading, error } = useFileOperation(compressPDF);

  const compressionOptions = [
    { value: 'low', label: 'Low Compression', description: 'Best quality, larger file size' },
    { value: 'medium', label: 'Medium Compression', description: 'Good balance of quality and size' },
    { value: 'high', label: 'High Compression', description: 'Smallest file size, lower quality' }
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
      setCurrentView('processing');
    }
  }, []);

  const handleCompress = async () => {
    try {
      const compressedPDF = await execute(file, compressionLevel);
      const url = URL.createObjectURL(compressedPDF);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compressed_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
      setCurrentView('complete');
    } catch (err) {
      console.error('Compression failed:', err);
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
        Select PDF File
      </button>
      <p className="text-gray-500">or drop PDF file here</p>
    </div>
  );

  const renderProcessingView = () => (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <p className="text-gray-600 mb-4">Selected file: {file?.name}</p>

        <div className="space-y-4 mb-6">
          {compressionOptions.map((option) => (
            <div
              key={option.value}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors
                ${compressionLevel === option.value 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-200'}`}
              onClick={() => setCompressionLevel(option.value)}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="compression"
                  value={option.value}
                  checked={compressionLevel === option.value}
                  onChange={() => setCompressionLevel(option.value)}
                  className="mr-3"
                />
                <div>
                  <h3 className="font-medium">{option.label}</h3>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="text-red-500 text-center mb-4">
            Error: {error}
          </div>
        )}

        <button
          onClick={handleCompress}
          disabled={loading}
          className={`w-full ${
            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          } text-white py-2 rounded transition-colors`}
        >
          {loading ? 'Compressing...' : 'Compress PDF'}
        </button>
      </div>
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
        <p className="text-lg font-medium">Compression Complete!</p>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => {
            setFile(null);
            setCurrentView('initial');
          }}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
        >
          Compress Another File
        </button>
        <button
          onClick={handleCompress}
          className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded transition-colors"
        >
          Download Again
        </button>
      </div>
    </div>
  );

  return (
    <PDFToolLayout
      title="Compress PDF"
      description="Reduce PDF file size while maintaining quality"
      icon={Icons.compress}
    >
      <div 
        className="flex-grow flex items-center justify-center p-4"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {currentView === 'initial' && renderInitialView()}
        {currentView === 'processing' && renderProcessingView()}
        {currentView === 'complete' && renderCompleteView()}
        
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
              setFile(selectedFile);
              setCurrentView('processing');
            }
          }}
          className="hidden"
          id="file-input"
        />
      </div>
    </PDFToolLayout>
  );
};

export default CompressPDF; 