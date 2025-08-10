import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const useHTMLToPDF = () => {
  const generatePDFFromHTML = async (elementId, filename, options = {}) => {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with ID "${elementId}" not found`);
      }

      // Default options
      const defaultOptions = {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
      };

      const canvasOptions = { ...defaultOptions, ...options.canvas };

      // Generate canvas from HTML element
      const canvas = await html2canvas(element, canvasOptions);
      
      // Calculate PDF dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      // Add first page
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      pdf.save(filename);

      return { success: true };
    } catch (error) {
      console.error('HTML to PDF generation failed:', error);
      return { success: false, error: error.message };
    }
  };

  const generatePDFFromComponent = async (component, filename, options = {}) => {
    try {
      // Create a temporary container
      const tempContainer = document.createElement('div');
      tempContainer.id = 'temp-pdf-container';
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '210mm'; // A4 width
      tempContainer.style.backgroundColor = '#ffffff';
      
      // Render the component into the container
      const ReactDOM = await import('react-dom/client');
      const root = ReactDOM.createRoot(tempContainer);
      
      document.body.appendChild(tempContainer);
      
      return new Promise((resolve) => {
        root.render(component);
        
        // Wait for rendering to complete
        setTimeout(async () => {
          try {
            // Check if the component has smart page break functionality
            const containerElement = document.getElementById('temp-pdf-container');
            if (containerElement && containerElement.calculatePageBreaks) {
              // Calculate page breaks and apply margins
              containerElement.calculatePageBreaks();
              
              // Wait a bit more for margin adjustments to take effect
              await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            const result = await generatePDFFromHTML('temp-pdf-container', filename, options);
            
            // Reset page breaks after PDF generation
            if (containerElement && containerElement.setPageBreaks) {
              containerElement.setPageBreaks({});
            }
            
            // Cleanup
            root.unmount();
            document.body.removeChild(tempContainer);
            
            resolve(result);
          } catch (error) {
            // Cleanup on error
            root.unmount();
            if (document.body.contains(tempContainer)) {
              document.body.removeChild(tempContainer);
            }
            resolve({ success: false, error: error.message });
          }
        }, 1000); // Wait 1 second for fonts and rendering
      });
    } catch (error) {
      console.error('Component to PDF generation failed:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    generatePDFFromHTML,
    generatePDFFromComponent,
  };
};

export default useHTMLToPDF;
