import React, { useState } from 'react';
import PDFToolLayout from '@/components/PDFToolLayout';
import { useFileOperation } from '@/hooks/useFileOperation';
import { convertImagesToPDF } from '@/utils/pdfUtils';
import Icons from '@/Icons';

const JpgToPdf = () => {
  const [currentView, setCurrentView] = useState('initial');
  const [files, setFiles] = useState([]);
  const [pageSize, setPageSize] = useState('A4');
  const [orientation, setOrientation] = useState('portrait');
  const [margin, setMargin] = useState('none');
  const [mergeAll, setMergeAll] = useState(true);
  const { execute, loading, error } = useFileOperation(convertImagesToPDF);

  const pageSizeOptions = ['A4', 'Letter', 'Legal', 'A3'];

  const handleFileAdd = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleConvert = async () => {
    try {
      const options = {
        pageSize,
        orientation,
        margin,
        mergeAll
      };

      const convertedPDF = await execute(files, options);
      const url = URL.createObjectURL(convertedPDF);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted.pdf';
      a.click();
      URL.revokeObjectURL(url);
      setCurrentView('complete');
    } catch (err) {
      console.error('Conversion failed:', err);
    }
  };

  const renderInitialView = () => (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-2">JPG to PDF Online</h1>
      <p className="text-gray-600 mb-6">Convert Images to PDF</p>
      <button
        onClick={() => document.getElementById('file-input').click()}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mb-4"
      >
        Select JPG Images
      </button>
      <p className="text-gray-500">or drop JPG images here</p>
    </div>
  );

  const renderEditingView = () => (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">JPG to PDF Online</h1>
        <p className="text-gray-600">Convert Images to PDF</p>
      </div>
    
      <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 mb-6 text-center">
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileAdd}
            className="hidden"
            id="file-input"
          />
          <label
            htmlFor="file-input"
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
          >
            Add More Files
          </label>
        </div>
        
        <div className="min-h-[200px] flex items-center justify-center">
          {files.length === 0 ? (
            <div className="text-gray-400">Drop your images here</div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {files.map((file, index) => (
                <div key={index} className="border rounded p-2">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-32 object-cover"
                  />
                  <p className="text-sm mt-2 truncate">{file.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Page size:</label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value)}
            className="w-full border rounded p-2"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
    
        <div>
          <label className="block text-sm font-medium mb-2">Page orientation:</label>
          <select
            value={orientation}
            onChange={(e) => setOrientation(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>
    
        <div>
          <label className="block text-sm font-medium mb-2">Margin:</label>
          <select
            value={margin}
            onChange={(e) => setMargin(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="none">None</option>
            <option value="small">Small margin (0.5")</option>
            <option value="large">Large margin (1")</option>
          </select>
        </div>
      </div>
    
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={mergeAll}
            onChange={(e) => setMergeAll(e.target.checked)}
            className="mr-2"
          />
          <span>Merge all images in one document</span>
        </label>
      </div>

      {error && (
        <div className="text-red-500 text-center mb-4">
          Error: {error}
        </div>
      )}
    
      <button
        onClick={handleConvert}
        disabled={loading || files.length === 0}
        className={`w-full ${
          loading || files.length === 0 ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
        } text-white py-2 rounded`}
      >
        {loading ? 'Converting...' : 'Convert to PDF'}
      </button>
    </div>
  );

  const renderCompleteView = () => (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-2">Your PDF is Ready!</h1>
      <p className="text-gray-600 mb-6">
        Your JPG images have been successfully converted into a PDF. Download now or convert more images!
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setCurrentView('editing')}
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
        >
          Convert More
        </button>
        <button
          onClick={handleConvert}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Download Again
        </button>
      </div>
    </div>
  );

  return (
    <PDFToolLayout
      title="JPG to PDF"
      description="Convert Images to PDF"
      icon={Icons.jpgTopdf}
    >
      <div className="flex-grow flex items-center justify-center p-4">
        {currentView === 'initial' && renderInitialView()}
        {currentView === 'editing' && renderEditingView()}
        {currentView === 'complete' && renderCompleteView()}
        
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            handleFileAdd(e);
            setCurrentView('editing');
          }}
          className="hidden"
          id="file-input"
        />
      </div>
    </PDFToolLayout>
  );
};

export default JpgToPdf; 