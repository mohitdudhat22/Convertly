import React, { useState } from 'react';
import PDFToolLayout from '@/components/PDFToolLayout';
import { useFileOperation } from '@/hooks/useFileOperation';
import { extractPages } from '@/utils/pdfUtils';
import Icons from '@/Icons';

const ExtractPages = () => {
  const [currentView, setCurrentView] = useState('initial');
  const [file, setFile] = useState(null);
  const [pageNumbers, setPageNumbers] = useState('');
  const { execute, loading, error } = useFileOperation(extractPages);

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
    } catch (err) {
      console.error('Extraction failed:', err);
    }
  };

  const renderInitialView = () => (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-2">Extract Pages</h1>
      <p className="text-gray-600 mb-6">Extract specific pages from your PDF</p>
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
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Extract Pages</h1>
        <p className="text-gray-600">Selected file: {file?.name}</p>
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
        <p className="text-sm text-gray-500 mt-2">
          Enter page numbers separated by commas (e.g., 1,2,5-7)
        </p>
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
        } text-white py-2 rounded`}
      >
        {loading ? 'Extracting...' : 'Extract Pages'}
      </button>
    </div>
  );

  return (
    <PDFToolLayout
      title="Extract Pages"
      description="Extract specific pages from your PDF"
      icon={Icons.extract}
    >
      <div className="flex-grow flex items-center justify-center p-4">
        {currentView === 'initial' && renderInitialView()}
        {currentView === 'processing' && renderProcessingView()}
        
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setCurrentView('processing');
          }}
          className="hidden"
          id="file-input"
        />
      </div>
    </PDFToolLayout>
  );
};

export default ExtractPages; 