import React, { useState, useCallback } from 'react';
import PDFToolLayout from '@/components/PDFToolLayout';
import { useFileOperation } from '@/hooks/useFileOperation';
import { mergePDFs } from '@/utils/pdfUtils';
import Icons from '@/Icons';

const MergePDF = () => {
  const [currentView, setCurrentView] = useState('initial');
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const { execute, loading, error } = useFileOperation(mergePDFs);

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
      file => file.type === 'application/pdf'
    );
    if (droppedFiles.length > 0) {
      setFiles(prev => [...prev, ...droppedFiles]);
      setCurrentView('processing');
    }
  }, []);

  const handleFileAdd = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    try {
      const mergedPDF = await execute(files);
      const url = URL.createObjectURL(mergedPDF);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Merging failed:', err);
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
        Select PDF Files
      </button>
      <p className="text-gray-500">or drop PDF files here</p>
    </div>
  );

  const renderProcessingView = () => (
    <div className="max-w-4xl mx-auto p-4">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 mb-6 transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-white p-3 rounded shadow-sm">
              <span className="truncate flex-1">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="ml-2 text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => document.getElementById('file-input').click()}
          className="mt-4 text-blue-500 hover:text-blue-600 flex items-center justify-center w-full"
        >
          <span className="mr-2">+</span> Add more files
        </button>
      </div>

      {error && (
        <div className="text-red-500 text-center mb-4">
          Error: {error}
        </div>
      )}

      <button
        onClick={handleMerge}
        disabled={loading || files.length < 2}
        className={`w-full ${
          loading || files.length < 2 ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
        } text-white py-2 rounded transition-colors`}
      >
        {loading ? 'Merging...' : 'Merge PDFs'}
      </button>
    </div>
  );

  return (
    <PDFToolLayout
      title="Merge PDF"
      description="Combine multiple PDFs into one file"
      icon={Icons.merge}
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
          multiple
          onChange={(e) => {
            handleFileAdd(e);
            setCurrentView('processing');
          }}
          className="hidden"
          id="file-input"
        />
      </div>
    </PDFToolLayout>
  );
};

export default MergePDF; 