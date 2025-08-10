import React, { useState, useEffect, useRef } from 'react';

const DocumentReportHTML = ({ data, exportedBy }) => {
  const [pageBreaks, setPageBreaks] = useState({});
  const [isCalculating, setIsCalculating] = useState(false);
  const containerRef = useRef(null);

  // Calculate page breaks to prevent section splitting
  const calculatePageBreaks = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const sections = container.querySelectorAll('[data-section]');
    const pageHeight = 1056; // A4 height in pixels at 96 DPI (11 inches * 96)
    const breaks = {};

    let currentPageHeight = 0;
    let currentPage = 1;

    sections.forEach((section) => {
      const sectionId = section.getAttribute('data-section');
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;

      // Calculate which page this section starts on
      const pageStart = Math.floor(sectionTop / pageHeight) + 1;
      const positionOnPage = sectionTop % pageHeight;

      // Check if section would be split across pages
      if (positionOnPage + sectionHeight > pageHeight) {
        // Calculate margin needed to push to next page
        const marginNeeded = pageHeight - positionOnPage;
        breaks[sectionId] = marginNeeded;
      }
    });

    setPageBreaks(breaks);
  };

  // Expose calculatePageBreaks function globally for PDF generation
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.calculatePageBreaks = calculatePageBreaks;
      containerRef.current.setPageBreaks = setPageBreaks;
      containerRef.current.pageBreaks = pageBreaks;
    }
  }, [pageBreaks]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('km-KH', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('km-KH');
  };

  const styles = {
    container: {
      fontFamily: '"Noto Sans Khmer", "Khmer OS", sans-serif',
      fontSize: '14px',
      lineHeight: '1.6',
      color: '#333',
      backgroundColor: '#fff',
      padding: '40px',
      maxWidth: '210mm', // A4 width
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px',
      borderBottom: '3px solid #333',
      paddingBottom: '20px',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#333',
    },
    subtitle: {
      fontSize: '18px',
      marginBottom: '10px',
      color: '#666',
    },
    exportInfo: {
      textAlign: 'right',
      fontSize: '12px',
      color: '#666',
      marginBottom: '20px',
    },
    section: {
      marginBottom: '30px',
      pageBreakInside: 'avoid', // Prevent section from breaking across pages
      breakInside: 'avoid', // Alternative CSS property for better browser support
      display: 'block', // Ensure block-level element
      overflow: 'visible', // Prevent content clipping
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '15px',
      color: '#333',
      backgroundColor: '#f8f9fa',
      padding: '12px',
      borderLeft: '4px solid #dc3545',
    },
    contractInfo: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '15px',
      marginBottom: '20px',
    },
    buyerSellerSection: {
      marginBottom: '20px',
      padding: '15px',
      backgroundColor: '#f8f9fa',
      borderRadius: '5px',
      border: '1px solid #dee2e6',
      pageBreakInside: 'avoid', // Prevent individual cards from breaking across pages
      breakInside: 'avoid', // Alternative CSS property for better browser support
      display: 'block', // Ensure block-level element
      overflow: 'visible', // Prevent content clipping
      minHeight: 'fit-content', // Ensure proper height calculation
    },
    subSectionTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#2E5984',
      borderBottom: '1px solid #dee2e6',
      paddingBottom: '5px',
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px',
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
    },
    infoItem: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px',
      backgroundColor: '#f8f9fa',
      borderRadius: '4px',
      border: '1px solid #e9ecef',
    },
    infoLabel: {
      fontWeight: 'bold',
      color: '#495057',
    },
    infoValue: {
      color: '#dc3545',
      fontWeight: 'bold',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '15px',
      pageBreakInside: 'avoid', // Prevent table from breaking across pages
      breakInside: 'avoid', // Alternative CSS property for better browser support
    },
    tableHeader: {
      backgroundColor: '#dc3545',
      color: 'white',
    },
    tableHeaderCell: {
      padding: '12px',
      textAlign: 'center',
      fontWeight: 'bold',
      border: '1px solid #dee2e6',
    },
    tableCell: {
      padding: '10px',
      textAlign: 'center',
      border: '1px solid #dee2e6',
    },
    tableRow: {
      backgroundColor: '#fff',
    },
    tableRowAlt: {
      backgroundColor: '#f8f9fa',
    },
    noData: {
      textAlign: 'center',
      fontStyle: 'italic',
      color: '#6c757d',
      padding: '20px',
    },
    footer: {
      textAlign: 'center',
      marginTop: '40px',
      fontSize: '12px',
      color: '#6c757d',
      borderTop: '1px solid #dee2e6',
      paddingTop: '20px',
    },
    keepTogether: {
      // Dynamic margin will be applied based on page break calculations
    },
  };

  return (
    <div ref={containerRef} style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>របាយការណ៍កិច្ចសន្យា</h1>
        <p style={styles.subtitle}>កិច្ចសន្យាលេខ: {data.contract?.contract_id}</p>
      </div>

      {/* Export Info */}
      <div style={styles.exportInfo}>
        <div>នាំចេញដោយ: {exportedBy}</div>
        <div>កាលបរិច្ឆេទនាំចេញ: {formatDate(new Date().toISOString())}</div>
      </div>

      {/* Contract Information */}
      <div 
        data-section="contract-info" 
        style={{
          ...styles.section,
          ...styles.keepTogether,
          marginTop: pageBreaks['contract-info'] ? `${pageBreaks['contract-info']}px` : styles.section.marginTop
        }}
      >
        <h2 style={styles.sectionTitle}>📋 ព័ត៌មានកិច្ចសន្យា</h2>
        <div style={styles.contractInfo}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>លេខកិច្ចសន្យា:</span>
            <span style={styles.infoValue}>{data.contract?.id || data.contract?.contract_id}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>កាលបរិច្ឆេទសញ្ញា:</span>
            <span style={styles.infoValue}>{formatDate(data.contract?.date || data.contract?.contract_date)}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>ស្ថានភាព:</span>
            <span style={styles.infoValue}>{data.contract?.status}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>ចំនួនសរុប:</span>
            <span style={styles.infoValue}>{formatCurrency(data.contract?.total_amount)}</span>
          </div>
        </div>
      </div>

      {/* Buyer Information */}
      <div 
        data-section="buyer-info" 
        style={{
          ...styles.section,
          ...styles.keepTogether,
          marginTop: pageBreaks['buyer-info'] ? `${pageBreaks['buyer-info']}px` : styles.section.marginTop
        }}
      >
        <h2 style={styles.sectionTitle}>👤 ព័ត៌មានអ្នកទិញ</h2>
        {data.contract?.buyers && data.contract.buyers.length > 0 ? (
          data.contract.buyers.map((buyer, index) => (
            <div key={index} style={styles.buyerSellerSection}>
              <h3 style={styles.subSectionTitle}>អ្នកទិញ #{index + 1}</h3>
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>ឈ្មោះ:</span>
                  <span style={styles.infoValue}>{buyer.buyer?.name || buyer.name}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>ទូរស័ព្ទ:</span>
                  <span style={styles.infoValue}>{buyer.buyer?.phone || buyer.phone || 'N/A'}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>អាសយដ្ឋាន:</span>
                  <span style={styles.infoValue}>{buyer.buyer?.address || buyer.address || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))
        ) : data.contract?.buyer_name ? (
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>ឈ្មោះ:</span>
              <span style={styles.infoValue}>{data.contract.buyer_name}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>ទូរស័ព្ទ:</span>
              <span style={styles.infoValue}>{data.contract.buyer_phone || 'N/A'}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>អាសយដ្ឋាន:</span>
              <span style={styles.infoValue}>{data.contract.buyer_address || 'N/A'}</span>
            </div>
          </div>
        ) : (
          <p style={styles.noData}>មិនមានព័ត៌មានអ្នកទិញ</p>
        )}
      </div>

      {/* Seller Information */}
      <div 
        data-section="seller-info" 
        style={{
          ...styles.section,
          ...styles.keepTogether,
          marginTop: pageBreaks['seller-info'] ? `${pageBreaks['seller-info']}px` : styles.section.marginTop
        }}
      >
        <h2 style={styles.sectionTitle}>🏢 ព័ត៌មានអ្នកលក់</h2>
        {data.contract?.sellers && data.contract.sellers.length > 0 ? (
          data.contract.sellers.map((seller, index) => (
            <div key={index} style={styles.buyerSellerSection}>
              <h3 style={styles.subSectionTitle}>អ្នកលក់ #{index + 1}</h3>
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>ឈ្មោះ:</span>
                  <span style={styles.infoValue}>{seller.seller?.name || seller.name}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>ទូរស័ព្ទ:</span>
                  <span style={styles.infoValue}>{seller.seller?.phone || seller.phone || 'N/A'}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>អាសយដ្ឋាន:</span>
                  <span style={styles.infoValue}>{seller.seller?.address || seller.address || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))
        ) : data.contract?.seller_name ? (
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>ឈ្មោះ:</span>
              <span style={styles.infoValue}>{data.contract.seller_name}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>ទូរស័ព្ទ:</span>
              <span style={styles.infoValue}>{data.contract.seller_phone || 'N/A'}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>អាសយដ្ឋាន:</span>
              <span style={styles.infoValue}>{data.contract.seller_address || 'N/A'}</span>
            </div>
          </div>
        ) : (
          <p style={styles.noData}>មិនមានព័ត៌មានអ្នកលក់</p>
        )}
      </div>

      {/* Land Information */}
      <div 
        data-section="land-info" 
        style={{
          ...styles.section,
          ...styles.keepTogether,
          marginTop: pageBreaks['land-info'] ? `${pageBreaks['land-info']}px` : styles.section.marginTop
        }}
      >
        <h2 style={styles.sectionTitle}>🏞️ ព័ត៌មានដី</h2>
        {data.contract?.lands && data.contract.lands.length > 0 ? (
          data.contract.lands.map((land, index) => (
            <div key={index} style={styles.buyerSellerSection}>
              <h3 style={styles.subSectionTitle}>ដី #{index + 1}</h3>
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>លេខក្បាលដី:</span>
                  <span style={styles.infoValue}>{land.land?.plot_number || land.plot_number || 'N/A'}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>ទំហំ:</span>
                  <span style={styles.infoValue}>{land.land?.size || land.size || 'N/A'} ម²</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>ទីតាំង:</span>
                  <span style={styles.infoValue}>{land.land?.location || land.location || 'N/A'}</span>
                </div>

                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>តម្លៃសរុប:</span>
                  <span style={styles.infoValue}>{formatCurrency(land.total_price)}</span>
                </div>
              </div>
            </div>
          ))
        ) : data.contract?.land ? (
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>លេខក្បាលដី:</span>
              <span style={styles.infoValue}>{data.contract.land.plot_number || 'N/A'}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>ទំហំ:</span>
              <span style={styles.infoValue}>{data.contract.land.size || 'N/A'} ម²</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>ទីតាំង:</span>
              <span style={styles.infoValue}>{data.contract.land.location || 'N/A'}</span>
            </div>
          </div>
        ) : (
          <p style={styles.noData}>មិនមានព័ត៌មានដី</p>
        )}
      </div>

      {/* Payment Steps Information */}
      <div 
        data-section="payment-steps" 
        style={{
          ...styles.section,
          ...styles.keepTogether,
          marginTop: pageBreaks['payment-steps'] ? `${pageBreaks['payment-steps']}px` : styles.section.marginTop
        }}
      >
        <h2 style={styles.sectionTitle}>💰 កំណែទឹកការទូទាត់</h2>
        <table style={styles.table}>
          <thead style={styles.tableHeader}>
            <tr>
              <th style={styles.tableHeaderCell}>ជំហាន #</th>
              <th style={styles.tableHeaderCell}>ចំនួនទឹកប្រាក់</th>
              <th style={styles.tableHeaderCell}>កាលបរិច្ឆេទកំណត់</th>
              <th style={styles.tableHeaderCell}>ស្ថានភាព</th>
            </tr>
          </thead>
          <tbody>
            {data.payment_steps && data.payment_steps.length > 0 ? (
              data.payment_steps.map((step, index) => (
                <tr key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                  <td style={styles.tableCell}>{step.step_number}</td>
                  <td style={styles.tableCell}>{formatCurrency(step.amount)}</td>
                  <td style={styles.tableCell}>{formatDate(step.due_date)}</td>
                  <td style={{
                    ...styles.tableCell,
                    color: step.status === 'paid' ? '#28a745' : '#dc3545',
                    fontWeight: 'bold'
                  }}>
                    {step.status === 'paid' ? 'បង់ប្រាក់រួចរាល់' : 'មិនទាន់បង់ប្រាក់'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={styles.noData}>
                  មិនមានទិន្នន័យការទូទាត់
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Contract Documents */}
      {data.contract_documents && data.contract_documents.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📄 កិច្ចសន្យាកិច្ចសន្យា</h2>
          <table style={styles.table}>
            <thead style={styles.tableHeader}>
              <tr>
                <th style={styles.tableHeaderCell}>ឈ្មោះកិច្ចសន្យា</th>
                <th style={styles.tableHeaderCell}>ទំហំកិច្ចសន្យា</th>
                <th style={styles.tableHeaderCell}>ប្រភេទកិច្ចសន្យា</th>
                <th style={styles.tableHeaderCell}>កាលបរិច្ឆេទបញ្ចូល</th>
                <th style={styles.tableHeaderCell}>បញ្ចូលដោយ</th>
              </tr>
            </thead>
            <tbody>
              {data.contract_documents.map((document, index) => (
                <tr key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                  <td style={styles.tableCell}>{document.name}</td>
                  <td style={styles.tableCell}>{formatFileSize(document.file_size)}</td>
                  <td style={styles.tableCell}>{document.mime_type}</td>
                  <td style={styles.tableCell}>{formatDate(document.uploaded_at)}</td>
                  <td style={styles.tableCell}>{document.uploaded_by || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div style={styles.footer}>
        <p>របាយការណ៍នេះត្រូវបានបង្កើតដោយប្រព័ន្ធតាមដានដីកម្ពុជា</p>
      </div>
    </div>
  );
};

export default DocumentReportHTML;
