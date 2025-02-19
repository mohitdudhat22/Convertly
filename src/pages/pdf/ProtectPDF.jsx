import React, { useState } from 'react';
import PDFToolLayout from '@/components/PDFToolLayout';
import { useFileOperation } from '@/hooks/useFileOperation';
import { protectPDF } from '@/utils/pdfUtils';
import Icons from '@/Icons';

const ProtectPDF = () => {
  const [currentView, setCurrentView] = useState('initial');
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { execute, loading, error } = useFileOperation(protectPDF);

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
    } catch (err) {
      console.error('Protection failed:', err);
    }
  };

  const renderInitialView = () => (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-2">Protect PDF</h1>
      <p className="text-gray-600 mb-6">Add password protection to your PDF</p>
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
        <h1 className="text-2xl font-bold mb-2">Protect PDF</h1>
        <p className="text-gray-600">Selected file: {file?.name}</p>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Enter password"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Confirm password"
          />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-center mb-4">
          Error: {error}
        </div>
      )}

      <button
        onClick={handleProtect}
        disabled={loading || !password || !confirmPassword}
        className={`w-full ${
          loading || !password || !confirmPassword
            ? 'bg-gray-400'
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white py-2 rounded`}
      >
        {loading ? 'Protecting...' : 'Protect PDF'}
      </button>
    </div>
  );

  return (
    <PDFToolLayout
      title="Protect PDF"
      description="Add password protection to your PDF"
      icon={Icons.protect}
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

export default ProtectPDF; 