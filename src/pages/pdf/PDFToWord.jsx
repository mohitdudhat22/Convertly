import React, { useState } from 'react';
import PDFToolLayout from '@/components/PDFToolLayout';
import { useFileOperation } from '@/hooks/useFileOperation';
import Icons from '@/Icons';

const PDFToWord = () => {
  const [currentView, setCurrentView] = useState('initial');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConvert = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Note: PDF to Word conversion typically requires server-side processing
      // This is a placeholder for the actual implementation
      alert('PDF to Word conversion requires server-side processing. This is a demo interface.');
    } catch (err) {
      setError(err.message);
      console.error('Conversion failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderInitialView = () => (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-2">PDF to Word</h1>
      <p className="text-gray-600 mb-6">Convert PDF to editable Word document</p>
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
        <h1 className="text-2xl font-bold mb-2">PDF to Word</h1>
        <p className="text-gray-600">Selected file: {file?.name}</p>
      </div>

      <div className="mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
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

export default PDFToWord; 