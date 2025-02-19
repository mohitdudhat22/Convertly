import React, { useState } from 'react';
import PDFToolLayout from '@/components/PDFToolLayout';
import { useFileOperation } from '@/hooks/useFileOperation';
import { mergePDFs } from '@/utils/pdfUtils';
import Icons from '@/Icons';

const MergePDF = () => {
  const [currentView, setCurrentView] = useState('initial');
  const [files, setFiles] = useState([]);
  const { execute, loading, error } = useFileOperation(mergePDFs);

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
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-2">Merge PDF</h1>
      <p className="text-gray-600 mb-6">Combine multiple PDFs into one file</p>
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
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Merge PDF</h1>
        <p className="text-gray-600">Selected files: {files.length}</p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-6">
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <span className="truncate">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => document.getElementById('file-input').click()}
          className="mt-4 text-blue-500 hover:text-blue-600"
        >
          + Add more files
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
        } text-white py-2 rounded`}
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
      <div className="flex-grow flex items-center justify-center p-4">
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