import React, { useState, useCallback } from 'react';
import PDFToolLayout from '@/components/PDFToolLayout';
import { useFileOperation } from '@/hooks/useFileOperation';
import { protectPDF } from '@/utils/pdfUtils';
import Icons from '@/Icons';

const ProtectPDF = () => {
  const [currentView, setCurrentView] = useState('initial');
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { execute, loading, error } = useFileOperation(protectPDF);

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

  const handleProtect = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const protectedPDF = await execute(file, password);
      const url = URL.createObjectURL(protectedPDF);
      const a = document.createElement('a');
      a.href = url;
      a.download = `protected_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
      setCurrentView('complete');
    } catch (err) {
      console.error('Protection failed:', err);
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

        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Set Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded p-2 pr-10"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded p-2 pr-10"
                placeholder="Confirm password"
              />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
          <p className="text-sm text-blue-800">
            Make sure to remember your password. Once the PDF is protected, 
            you'll need this password to open the document.
          </p>
        </div>

        {error && (
          <div className="text-red-500 text-center mb-4">
            Error: {error}
          </div>
        )}

        <button
          onClick={handleProtect}
          disabled={loading || !password || !confirmPassword || password !== confirmPassword}
          className={`w-full ${
            loading || !password || !confirmPassword || password !== confirmPassword
              ? 'bg-gray-400'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white py-2 rounded transition-colors`}
        >
          {loading ? 'Protecting...' : 'Protect PDF'}
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
        <p className="text-lg font-medium">PDF Protected Successfully!</p>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => {
            setFile(null);
            setPassword('');
            setConfirmPassword('');
            setCurrentView('initial');
          }}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
        >
          Protect Another File
        </button>
        <button
          onClick={handleProtect}
          className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded transition-colors"
        >
          Download Again
        </button>
      </div>
    </div>
  );

  return (
    <PDFToolLayout
      title="Protect PDF"
      description="Add password protection to your PDF"
      icon={Icons.protect}
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

export default ProtectPDF; 