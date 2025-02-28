import React, { useState, useCallback } from 'react';
import PDFToolLayout from '@/components/PDFToolLayout';
import { useFileOperation } from '@/hooks/useFileOperation';
import { extractPages } from '@/utils/pdfUtils';
import Icons from '@/Icons';

const ExtractPages = () => {
  const [currentView, setCurrentView] = useState('initial');
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pageNumbers, setPageNumbers] = useState('');
  const { execute, loading, error } = useFileOperation(extractPages);

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

  const handleExtract = async () => {
    try {
      // Convert page numbers string to array of numbers
      const pages = pageNumbers
        .split(',')
        .map(page => page.trim())
        .filter(page => page)
        .map(page => parseInt(page) - 1); // Convert to 0-based index

      const extractedPDF = await execute(file, pages);
      const url = URL.createObjectURL(extractedPDF);
      const a = document.createElement('a');
      a.href = url;
      a.download = `extracted_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
      setCurrentView('complete');
    } catch (err) {
      console.error('Extraction failed:', err);
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

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Page Numbers to Extract:
          </label>
          <input
            type="text"
            value={pageNumbers}
            onChange={(e) => setPageNumbers(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="e.g., 1,2,5-7"
          />
          <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-2">
            <p className="text-sm text-blue-800">
              Enter page numbers separated by commas. You can also specify ranges using a hyphen (e.g., 1-3,5,7-9).
              Page numbers start from 1.
            </p>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-center mb-4">
            Error: {error}
          </div>
        )}

        <button
          onClick={handleExtract}
          disabled={loading || !pageNumbers.trim()}
          className={`w-full ${
            loading || !pageNumbers.trim() ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          } text-white py-2 rounded transition-colors`}
        >
          {loading ? 'Extracting...' : 'Extract Pages'}
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
        <p className="text-lg font-medium">Pages Extracted Successfully!</p>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => {
            setFile(null);
            setPageNumbers('');
            setCurrentView('initial');
          }}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
        >
          Extract from Another File
        </button>
        <button
          onClick={handleExtract}
          className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded transition-colors"
        >
          Download Again
        </button>
      </div>
    </div>
  );

  return (
    <PDFToolLayout
      title="Extract Pages"
      description="Extract specific pages from your PDF"
      icon={Icons.extract}
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

export default ExtractPages; 