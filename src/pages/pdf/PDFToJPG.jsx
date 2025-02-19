import React, { useState } from 'react';
import PDFToolLayout from '@/components/PDFToolLayout';
import { useFileOperation } from '@/hooks/useFileOperation';
import { convertPDFToJPG } from '@/utils/pdfUtils';
import Icons from '@/Icons';

const PDFToJPG = () => {
  const [currentView, setCurrentView] = useState('initial');
  const [file, setFile] = useState(null);
  const { execute, loading, error } = useFileOperation(convertPDFToJPG);

  const handleConvert = async () => {
    try {
      const images = await execute(file);
      // Download each image
      images.forEach((blob, index) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `page_${index + 1}.jpg`;
        a.click();
        URL.revokeObjectURL(url);
      });
    } catch (err) {
      console.error('Conversion failed:', err);
    }
  };

  const renderInitialView = () => (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-2">PDF to JPG</h1>
      <p className="text-gray-600 mb-6">Convert PDF pages to JPG images</p>
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
        <h1 className="text-2xl font-bold mb-2">PDF to JPG</h1>
        <p className="text-gray-600">Selected file: {file?.name}</p>
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
        {loading ? 'Converting...' : 'Convert to JPG'}
      </button>
    </div>
  );

  return (
    <PDFToolLayout
      title="PDF to JPG"
      description="Convert PDF pages to JPG images"
      icon={Icons.pdfTojpg}
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

export default PDFToJPG; 