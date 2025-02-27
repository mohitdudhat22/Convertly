import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

const API_BASE_URL = import.meta.env.VITE_BASE_API;

export const compressPDF = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('compression_mode', 'medium');

    const response = await fetch(`${API_BASE_URL}/compress/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Compression failed');
    }

    return await response.blob();
  } catch (error) {
    throw new Error('Error compressing PDF: ' + error.message);
  }
}

export const protectPDF = async (file, password) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/protect/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Protection failed');
    }

    return await response.blob();
  } catch (error) {
    throw new Error('Failed to protect PDF: ' + error.message);
  }
}

// Helper function to verify if a PDF is password protected
export const isPDFProtected = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: false });
    return false;
  } catch (error) {
    if (error.message.includes('password')) {
      return true;
    }
    throw error;
  }
}

export const convertPDFToJPG = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/convert/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Conversion failed');
    }

    return await response.blob();
  } catch (error) {
    throw new Error('Error converting PDF to JPG: ' + error.message);
  }
}

export const convertPDFToWord = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/convert/pdf-to-word/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Conversion failed');
    }

    return await response.blob();
  } catch (error) {
    throw new Error('Error converting PDF to Word: ' + error.message);
  }
}

export const mergePDFs = async (files) => {
  try {
    const mergedPdf = await PDFDocument.create();
    
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      pages.forEach(page => mergedPdf.addPage(page));
    }
    
    const mergedBytes = await mergedPdf.save();
    return new Blob([mergedBytes], { type: 'application/pdf' });
  } catch (error) {
    throw new Error('Error merging PDFs: ' + error.message);
  }
}

export const splitPDF = async (file, pageRanges) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const results = [];
    
    for (const range of pageRanges) {
      const newPdf = await PDFDocument.create();
      const pages = await newPdf.copyPages(pdfDoc, range);
      pages.forEach(page => newPdf.addPage(page));
      
      const pdfBytes = await newPdf.save();
      results.push(new Blob([pdfBytes], { type: 'application/pdf' }));
    }
    
    return results;
  } catch (error) {
    throw new Error('Error splitting PDF: ' + error.message);
  }
}

export const extractPages = async (file, pageNumbers) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const newPdf = await PDFDocument.create();
    
    const pages = await newPdf.copyPages(pdfDoc, pageNumbers);
    pages.forEach(page => newPdf.addPage(page));
    
    const pdfBytes = await newPdf.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    throw new Error('Error extracting pages: ' + error.message);
  }
}

export const convertImagesToPDF = async (files, options = {}) => {
  try {
    const pdfDoc = await PDFDocument.create();
    
    for (const file of files) {
      const imageBytes = await file.arrayBuffer();
      let image;
      
      if (file.type.includes('png')) {
        image = await pdfDoc.embedPng(imageBytes);
      } else {
        image = await pdfDoc.embedJpg(imageBytes);
      }
      
      const page = pdfDoc.addPage([
        options.width || 612, // Letter width in points
        options.height || 792 // Letter height in points
      ]);
      
      const { width, height } = page.getSize();
      const scale = Math.min(
        width / image.width,
        height / image.height
      );
      
      page.drawImage(image, {
        x: (width - image.width * scale) / 2,
        y: (height - image.height * scale) / 2,
        width: image.width * scale,
        height: image.height * scale
      });
    }
    
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    throw new Error('Error converting images to PDF: ' + error.message);
  }
} 