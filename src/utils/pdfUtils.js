import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'


export const compressPDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Basic compression by copying pages to a new document
    const compressedPdf = await PDFDocument.create();
    const pages = await compressedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    pages.forEach(page => compressedPdf.addPage(page));
    
    const compressedBytes = await compressedPdf.save({ useObjectStreams: true });
    return new Blob([compressedBytes], { type: 'application/pdf' });
  } catch (error) {
    throw new Error('Error compressing PDF: ' + error.message);
  }
}

export const protectPDF = async (file, password) => {
  try {
    // Validate inputs
    if (!file) {
      throw new Error('No file provided');
    }
    if (!password || password.length < 1) {
      throw new Error('Password is required');
    }

    // Read the PDF file
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Create a new document and copy all pages
    const protectedDoc = await PDFDocument.create();
    const pages = await protectedDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
    pages.forEach(page => protectedDoc.addPage(page));
    
    // Apply password protection with encryption
    const protectedBytes = await protectedDoc.save({
      userPassword: password,
      ownerPassword: password,
      encryption: {
        keyBits: 128,
        encryptMetadata: true,
        version: 2 // Explicitly set encryption version
      },
      permissions: {
        printing: 'highResolution',
        modifying: false,
        copying: false,
        annotating: false,
        fillingForms: true,
        contentAccessibility: true,
        documentAssembly: false
      }
    });
    
    // Try to load the protected PDF with the password to verify encryption
    try {
      await PDFDocument.load(protectedBytes, { 
        ignoreEncryption: false,
        password: password 
      });
    } catch (verificationError) {
      console.error('Verification error:', verificationError);
      // If we can load it without a password, encryption failed
      const unprotectedTest = await PDFDocument.load(protectedBytes, { 
        ignoreEncryption: true 
      });
      if (!unprotectedTest.isEncrypted) {
        throw new Error('Encryption verification failed');
      }
    }
    
    // Create and return the protected PDF blob
    return new Blob([protectedBytes], { type: 'application/pdf' });

  } catch (error) {
    console.error('Full error:', error);
    if (error.message.includes('Invalid PDF')) {
      throw new Error('The file appears to be corrupted or is not a valid PDF');
    }
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
  // This would require a server-side implementation or a PDF rendering library
  throw new Error('PDF to JPG conversion requires server-side processing');
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

export const convertPDFToWord = async (file) => {
  // PDF to Word conversion logic
} 