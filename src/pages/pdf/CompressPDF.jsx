import React, { useState } from 'react';
import PDFToolLayout from '@/components/PDFToolLayout';
import { useFileOperation } from '@/hooks/useFileOperation';
import { compressPDF } from '@/utils/pdfUtils';
import Icons from '@/Icons';

const CompressPDF = () => {
  const [currentView, setCurrentView] = useState('initial');
  const [file, setFile] = useState(null);
  const { execute, loading, error } = useFileOperation(compressPDF);

  const handleCompress = async () => {
    try {
      const compressedPDF = await execute(file);
      // Create download link
      const url = URL.createObjectURL(compressedPDF);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compressed_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Compression failed:', err);
    }
  };

  const renderInitialView = () => (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-2">Compress PDF</h1>
      <p className="text-gray-600 mb-6">Reduce your PDF file size</p>
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
        <h1 className="text-2xl font-bold mb-2">Compress PDF</h1>
        <p className="text-gray-600">Selected file: {file?.name}</p>
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
        } text-white py-2 rounded`}
      >
        {loading ? 'Compressing...' : 'Compress PDF'}
      </button>
    </div>
  );

  return (
    <PDFToolLayout
      title="Compress PDF"
      description="Reduce your PDF file size"
      icon={Icons.compress}
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

export default CompressPDF; 