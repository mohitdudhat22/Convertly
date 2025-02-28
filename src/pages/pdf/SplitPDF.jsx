import React, { useState, useCallback } from 'react';
import PDFToolLayout from '@/components/PDFToolLayout';
import { useFileOperation } from '@/hooks/useFileOperation';
import { splitPDF } from '@/utils/pdfUtils';
import { Document, Page, pdfjs } from 'react-pdf';
import Icons from '@/Icons';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const SplitPDF = () => {
  const [currentView, setCurrentView] = useState('initial');
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pageNumbers, setPageNumbers] = useState('');
  const [numPages, setNumPages] = useState(null);
  const { execute, loading, error } = useFileOperation(splitPDF);

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

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleExtract = async () => {
    try {
      const ranges = pageNumbers.split(',').map(range => {
        const [start, end] = range.split('-');
        return { start: parseInt(start) - 1, end: parseInt(end) };
      });

      const splitPDFs = await execute(file, ranges);
      
      // Download each split PDF
      splitPDFs.forEach((blob, index) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `split_${index + 1}_${file.name}`;
        a.click();
        URL.revokeObjectURL(url);
      });
    } catch (err) {
      console.error('Splitting failed:', err);
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

        <div className="mb-6 overflow-auto max-h-96">
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            className="mb-4"
          >
            {Array.from(new Array(numPages), (el, index) => (
              <div key={`page_${index + 1}`} className="mb-4">
                <div className="bg-gray-100 p-2 mb-2 rounded">
                  <span className="text-sm text-gray-600">Page {index + 1}</span>
                </div>
                <Page
                  pageNumber={index + 1}
                  width={400}
                  className="border rounded shadow-sm"
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </div>
            ))}
          </Document>
        </div>

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
              Total pages: {numPages}
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

  return (
    <PDFToolLayout
      title="Split PDF"
      description="Split your PDF into multiple files"
      icon={Icons.split}
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

export default SplitPDF; 