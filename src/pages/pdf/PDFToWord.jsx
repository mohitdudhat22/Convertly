import React, { useState, useCallback } from 'react';
import PDFToolLayout from '@/components/PDFToolLayout';
import { useFileOperation } from '@/hooks/useFileOperation';
import { convertPDFToWord } from '@/utils/pdfUtils';
import Icons from '@/Icons';

const PDFToWord = () => {
  const [currentView, setCurrentView] = useState('initial');
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const { execute, loading, error } = useFileOperation(convertPDFToWord);

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

  const handleConvert = async () => {
    try {
      const wordDoc = await execute(file);
      const url = URL.createObjectURL(wordDoc);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace('.pdf', '.docx');
      a.click();
      URL.revokeObjectURL(url);
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
        Select PDF File
      </button>
      <p className="text-gray-500">or drop PDF file here</p>
    </div>
  );

  const renderProcessingView = () => (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <p className="text-gray-600">Selected file: {file?.name}</p>
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-4">
          <p className="text-sm text-blue-800">
            Converting PDF to Word maintains the layout while making the text editable.
            The conversion process may take a few moments depending on the file size.
          </p>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-center mb-4">
          Error: {error}
        </div>
      )}

      <button
        onClick={handleConvert}
        disabled={loading}
        className={`w-full ${
          loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
        } text-white py-2 rounded`}
      >
        {loading ? 'Converting...' : 'Convert to Word'}
      </button>
    </div>
  );

  return (
    <PDFToolLayout
      title="PDF to Word"
      description="Convert PDF to editable Word document"
      icon={Icons.pdftoWord}
    >
      <div 
        className="flex-grow flex items-center justify-center p-4"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {currentView === 'initial' && renderInitialView()}
        {currentView === 'processing' && renderProcessingView()}
        
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

export default PDFToWord; 