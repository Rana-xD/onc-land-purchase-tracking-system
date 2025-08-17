import React, { useState, useRef, useEffect } from 'react';

const YearlyReportHTML = ({ data, year, exportedBy }) => {
  const [pageBreaks, setPageBreaks] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const componentRef = useRef(null);

  // Smart page break calculation function
  const calculatePageBreaks = () => {
    if (!componentRef.current) return;
    
    setIsCalculating(true);
    const sections = componentRef.current.querySelectorAll('[data-section]');
    const pageHeight = 1056; // A4 height in pixels at 96 DPI
    const breaks = [];
    
    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const sectionTop = section.offsetTop;
      const sectionHeight = rect.height;
      
      // Calculate which page this section starts on
      const currentPage = Math.floor(sectionTop / pageHeight);
      const positionOnPage = sectionTop % pageHeight;
      
      // If section would be split across pages, add margin to push it to next page
      if (positionOnPage + sectionHeight > pageHeight && positionOnPage > 100) {
        const marginNeeded = pageHeight - positionOnPage;
        breaks.push({
          sectionIndex: index,
          marginTop: marginNeeded + 20 // Add extra padding
        });
      }
    });
    
    setPageBreaks(breaks);
    setIsCalculating(false);
  };

  // Expose calculatePageBreaks to parent component
  useEffect(() => {
    if (componentRef.current) {
      componentRef.current.calculatePageBreaks = calculatePageBreaks;
    }
  }, []);

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
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '15px',
      color: '#333',
      backgroundColor: '#f8f9fa',
      padding: '12px',
      borderLeft: '4px solid #28a745',
    },
    summaryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '20px',
    },
    summaryCard: {
      display: 'flex',
      alignItems: 'center',
      padding: '15px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #dee2e6',
      gap: '12px',
    },
    summaryIcon: {
      fontSize: '24px',
      minWidth: '30px',
    },
    summaryItem: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px',
      backgroundColor: '#f8f9fa',
      borderRadius: '5px',
      border: '1px solid #dee2e6',
    },
    summaryLabel: {
      fontWeight: 'bold',
      color: '#495057',
    },
    summaryValue: {
      color: '#28a745',
      fontWeight: 'bold',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '15px',
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
    },
    tableHeader: {
      backgroundColor: '#28a745',
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
      padding: '20px',
      color: '#6c757d',
      fontStyle: 'italic',
    },
    footer: {
      textAlign: 'center',
      marginTop: '40px',
      fontSize: '12px',
      color: '#6c757d',
      borderTop: '1px solid #dee2e6',
      paddingTop: '20px',
    },
    divider: {
      borderTop: '1px solid #333',
      margin: '20px 0',
    },
    keepTogether: {
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
    },
  };

  return (
    <div ref={componentRef} style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>របាយការណ៍ប្រចាំឆ្នាំ</h1>
        <p style={styles.subtitle}>ឆ្នាំ {year || '2025'}</p>
        <hr style={styles.divider} />
        <div style={styles.exportInfo}>
          <p>នាយកដ្ឋាន: សេវា</p>
          <p>កាលបរិច្ឆេទនាំចេញ: {new Date().toLocaleDateString('km-KH')}</p>
        </div>
      </div>

      {/* Summary Section */}
      <div 
        data-section="summary" 
        style={{
          ...styles.section,
          marginTop: pageBreaks.find(b => b.sectionIndex === 0)?.marginTop || 0
        }}
      >
        <div style={styles.keepTogether}>
          <h2 style={styles.sectionTitle}>📊 សង្ខេប</h2>
          
          <div style={styles.summaryGrid}>
            <div style={styles.summaryCard}>
              <div style={styles.summaryIcon}>📄</div>
              <div>
                <div style={styles.summaryLabel}>សញ្ញាសរុប:</div>
                <div style={styles.summaryValue}>{data.total_contracts || 1}</div>
              </div>
            </div>
            
            <div style={styles.summaryCard}>
              <div style={styles.summaryIcon}>💰</div>
              <div>
                <div style={styles.summaryLabel}>ចំនួនសរុប:</div>
                <div style={styles.summaryValue}>{formatCurrency(data.total_amount || 32000)}</div>
              </div>
            </div>
            
            <div style={styles.summaryCard}>
              <div style={styles.summaryIcon}>✅</div>
              <div>
                <div style={styles.summaryLabel}>បានទូទាត់:</div>
                <div style={styles.summaryValue}>{formatCurrency(data.paid_amount || 0)}</div>
              </div>
            </div>
            
            <div style={styles.summaryCard}>
              <div style={styles.summaryIcon}>❌</div>
              <div>
                <div style={styles.summaryLabel}>មិនទានទូទាត់:</div>
                <div style={styles.summaryValue}>{formatCurrency(data.unpaid_amount || 32000)}</div>
              </div>
            </div>
            
            <div style={styles.summaryCard}>
              <div style={styles.summaryIcon}>🏞️</div>
              <div>
                <div style={styles.summaryLabel}>ដីសរុប:</div>
                <div style={styles.summaryValue}>{data.total_lands || 1}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contract Details Table */}
      <div 
        data-section="contracts" 
        style={{
          ...styles.section,
          marginTop: pageBreaks.find(b => b.sectionIndex === 1)?.marginTop || 0
        }}
      >
        <div style={styles.keepTogether}>
          <h2 style={styles.sectionTitle}>📋 បញ្ជីកិច្ចសន្យា</h2>
          
          <table style={styles.table}>
          <thead style={styles.tableHeader}>
            <tr>
              <th style={styles.tableHeaderCell}>លេខកិច្ចសន្យា</th>
              <th style={styles.tableHeaderCell}>លេខក្បាលដីធ្លី</th>
              <th style={styles.tableHeaderCell}>ចំនួនសរុប</th>
              <th style={styles.tableHeaderCell}>បានទូទាត់</th>
              <th style={styles.tableHeaderCell}>មិនទានទូទាត់</th>
              <th style={styles.tableHeaderCell}>ស្ថានភាព</th>
            </tr>
          </thead>
          <tbody>
            {data.contracts && data.contracts.length > 0 ? (
              data.contracts.map((contract, index) => {
                // Calculate totals for this contract
                const totalPaid = Object.values(contract.monthly_data || {}).reduce((sum, month) => sum + (month.paid || 0), 0);
                const totalUnpaid = Object.values(contract.monthly_data || {}).reduce((sum, month) => sum + (month.unpaid || 0), 0);
                const totalAmount = totalPaid + totalUnpaid;
                const status = totalUnpaid > 0 ? 'មិនទាន់បង់ប្រាក់' : 'បង់ប្រាក់រួចរាល់';
                
                return (
                  <tr key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                    <td style={styles.tableCell}>{contract.contract_id || 'N/A'}</td>
                    <td style={styles.tableCell}>
                      {contract.lands && contract.lands.length > 0 
                        ? contract.lands[0].plot_number || 'N/A' 
                        : 'N/A'}
                    </td>
                    <td style={styles.tableCell}>{formatCurrency(totalAmount)}</td>
                    <td style={styles.tableCell}>{formatCurrency(totalPaid)}</td>
                    <td style={styles.tableCell}>{formatCurrency(totalUnpaid)}</td>
                    <td style={{...styles.tableCell, color: totalUnpaid > 0 ? '#dc3545' : '#28a745', fontWeight: 'bold'}}>
                      {status}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={styles.noData}>
                  មិនមានទិន្នន័យសញ្ញាសម្រាប់ឆ្នាំនេះ
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Monthly Summary Table */}
      <div 
        data-section="monthly-summary" 
        style={{
          ...styles.section,
          marginTop: pageBreaks.find(b => b.sectionIndex === 2)?.marginTop || 0
        }}
      >
        <div style={styles.keepTogether}>
          <h2 style={styles.sectionTitle}>📅 សង្ខេបប្រចាំខែ</h2>
          
          <table style={styles.table}>
          <thead style={styles.tableHeader}>
            <tr>
              <th style={styles.tableHeaderCell}>ខែ</th>
              <th style={styles.tableHeaderCell}>ចំនួនកិច្ចសន្យា</th>
              <th style={styles.tableHeaderCell}>ចំនួនសរុប</th>
              <th style={styles.tableHeaderCell}>បានទូទាត់</th>
              <th style={styles.tableHeaderCell}>មិនទានទូទាត់</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => {
              // Calculate monthly totals across all contracts
              let monthlyPaid = 0;
              let monthlyUnpaid = 0;
              let contractsWithPayments = 0;
              
              if (data.contracts) {
                data.contracts.forEach(contract => {
                  const monthData = contract.monthly_data?.[month] || { paid: 0, unpaid: 0 };
                  monthlyPaid += monthData.paid || 0;
                  monthlyUnpaid += monthData.unpaid || 0;
                  if ((monthData.paid || 0) > 0 || (monthData.unpaid || 0) > 0) {
                    contractsWithPayments++;
                  }
                });
              }
              
              const monthTotal = monthlyPaid + monthlyUnpaid;
              const monthName = new Date(2025, month - 1, 1).toLocaleDateString('km-KH', { month: 'long' });
              
              return (
                <tr key={month} style={month % 2 === 0 ? styles.tableRowAlt : styles.tableRow}>
                  <td style={styles.tableCell}>{monthName}</td>
                  <td style={styles.tableCell}>{contractsWithPayments}</td>
                  <td style={styles.tableCell}>{formatCurrency(monthTotal)}</td>
                  <td style={styles.tableCell}>{formatCurrency(monthlyPaid)}</td>
                  <td style={styles.tableCell}>{formatCurrency(monthlyUnpaid)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p>របាយការណ៍នេះត្រូវបានបង្កើតដោយប្រព័ន្ធតាមដានដីកម្ពុជា</p>
      </div>
    </div>
  );
};

export default YearlyReportHTML;
