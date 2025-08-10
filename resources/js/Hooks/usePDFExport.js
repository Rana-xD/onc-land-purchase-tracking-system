import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

export const usePDFExport = () => {
  const generateAndDownloadPDF = async (PDFComponent, filename) => {
    try {
      // Generate PDF blob
      const blob = await pdf(PDFComponent).toBlob();
      
      // Download the PDF
      saveAs(blob, filename);
      
      return { success: true };
    } catch (error) {
      console.error('PDF generation failed:', error);
      return { success: false, error: error.message };
    }
  };

  const generatePDFBlob = async (PDFComponent) => {
    try {
      const blob = await pdf(PDFComponent).toBlob();
      return { success: true, blob };
    } catch (error) {
      console.error('PDF generation failed:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    generateAndDownloadPDF,
    generatePDFBlob,
  };
};

export default usePDFExport;
