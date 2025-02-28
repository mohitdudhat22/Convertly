import React, { useState, useCallback } from 'react';
import PDFToolLayout from '@/components/PDFToolLayout';
import { useFileOperation } from '@/hooks/useFileOperation';
import { splitPDF } from '@/utils/pdfUtils';
import Icons from '@/Icons';

const SplitPDF = () => {
  const [currentView, setCurrentView] = useState('initial');
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pageRanges, setPageRanges] = useState([{ start: '', end: '' }]);
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

  const handleSplit = async () => {
    try {
      const ranges = pageRanges
        .filter(range => range.start && range.end)
        .map(range => {
          const start = parseInt(range.start) - 1;
          const end = parseInt(range.end);
          return Array.from({ length: end - start }, (_, i) => start + i);
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

  const addPageRange = () => {
    setPageRanges([...pageRanges, { start: '', end: '' }]);
  };

  const updatePageRange = (index, field, value) => {
    const newRanges = [...pageRanges];
    newRanges[index][field] = value;
    setPageRanges(newRanges);
  };

  const removePageRange = (index) => {
    if (pageRanges.length > 1) {
      setPageRanges(pageRanges.filter((_, i) => i !== index));
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
        
        <div className="space-y-4">
          {pageRanges.map((range, index) => (
            <div key={index} className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Start Page:</label>
                <input
                  type="number"
                  min="1"
                  value={range.start}
                  onChange={(e) => updatePageRange(index, 'start', e.target.value)}
                  className="w-full border rounded p-2"
                  placeholder="1"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">End Page:</label>
                <input
                  type="number"
                  min="1"
                  value={range.end}
                  onChange={(e) => updatePageRange(index, 'end', e.target.value)}
                  className="w-full border rounded p-2"
                  placeholder="5"
                />
              </div>
              {pageRanges.length > 1 && (
                <button
                  onClick={() => removePageRange(index)}
                  className="text-red-500 hover:text-red-600 p-2"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        
        <button
          onClick={addPageRange}
          className="mt-4 text-blue-500 hover:text-blue-600 flex items-center"
        >
          <span className="mr-2">+</span> Add another range
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
        <p className="text-sm text-blue-800">
          Enter the page ranges you want to split into separate PDF files. 
          Each range will create a new PDF document.
        </p>
      </div>

      {error && (
        <div className="text-red-500 text-center mb-4">
          Error: {error}
        </div>
      )}

      <button
        onClick={handleSplit}
        disabled={loading || !pageRanges.some(range => range.start && range.end)}
        className={`w-full ${
          loading || !pageRanges.some(range => range.start && range.end)
            ? 'bg-gray-400'
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white py-2 rounded transition-colors`}
      >
        {loading ? 'Splitting...' : 'Split PDF'}
      </button>
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