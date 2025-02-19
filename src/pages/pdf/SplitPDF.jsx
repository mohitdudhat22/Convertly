import React, { useState } from 'react';
import PDFToolLayout from '@/components/PDFToolLayout';
import { useFileOperation } from '@/hooks/useFileOperation';
import { splitPDF } from '@/utils/pdfUtils';
import Icons from '@/Icons';

const SplitPDF = () => {
  const [currentView, setCurrentView] = useState('initial');
  const [file, setFile] = useState(null);
  const [pageRanges, setPageRanges] = useState([{ start: '', end: '' }]);
  const { execute, loading, error } = useFileOperation(splitPDF);

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

  const renderInitialView = () => (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-2">Split PDF</h1>
      <p className="text-gray-600 mb-6">Split your PDF into multiple files</p>
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
        <h1 className="text-2xl font-bold mb-2">Split PDF</h1>
        <p className="text-gray-600">Selected file: {file?.name}</p>
      </div>

      <div className="space-y-4 mb-6">
        {pageRanges.map((range, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Start Page:</label>
              <input
                type="number"
                min="1"
                value={range.start}
                onChange={(e) => updatePageRange(index, 'start', e.target.value)}
                className="w-full border rounded p-2"
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
              />
            </div>
          </div>
        ))}
        
        <button
          onClick={addPageRange}
          className="text-blue-500 hover:text-blue-600"
        >
          + Add another range
        </button>
      </div>

      {error && (
        <div className="text-red-500 text-center mb-4">
          Error: {error}
        </div>
      )}

      <button
        onClick={handleSplit}
        disabled={loading}
        className={`w-full ${
          loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
        } text-white py-2 rounded`}
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

export default SplitPDF; 