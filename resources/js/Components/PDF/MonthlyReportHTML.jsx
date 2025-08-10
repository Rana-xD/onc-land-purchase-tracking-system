import React from 'react';

const MonthlyReportHTML = ({ data, startDate, endDate, exportedBy }) => {
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
      borderLeft: '4px solid #007bff',
    },
    summaryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '15px',
      marginBottom: '20px',
    },
    summaryItem: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px',
      backgroundColor: '#f8f9fa',
      borderRadius: '4px',
      border: '1px solid #e9ecef',
    },
    summaryLabel: {
      fontWeight: 'bold',
      color: '#495057',
    },
    summaryValue: {
      color: '#007bff',
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
      backgroundColor: '#007bff',
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
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>របាយការណ៍ប្រចាំខែ</h1>
        <p style={styles.subtitle}>
          ពី {formatDate(startDate)} ដល់ {formatDate(endDate)}
        </p>
      </div>

      {/* Export Info */}
      <div style={styles.exportInfo}>
        <div>នាំចេញដោយ: {exportedBy}</div>
        <div>កាលបរិច្ឆេទនាំចេញ: {formatDate(new Date().toISOString())}</div>
      </div>

      {/* Summary Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📈 សង្ខេប</h2>
        <div style={styles.summaryGrid}>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>💰 ចំនួនសរុប:</span>
            <span style={styles.summaryValue}>{formatCurrency(data.summary?.total_amount)}</span>
          </div>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>📋 ចំនួនជំហានការបង់:</span>
            <span style={styles.summaryValue}>{data.summary?.payment_steps_count || 0}</span>
          </div>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>📅 ពីកាលបរិច្ឆេទ:</span>
            <span style={styles.summaryValue}>{formatDate(startDate)}</span>
          </div>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>📅 ដល់កាលបរិច្ឆេទ:</span>
            <span style={styles.summaryValue}>{formatDate(endDate)}</span>
          </div>
        </div>
      </div>

      {/* Payment Details Table */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>💰 ព័ត៌មានការទូទាត់</h2>
        
        <table style={styles.table}>
          <thead style={styles.tableHeader}>
            <tr>
              <th style={styles.tableHeaderCell}>លេខកុងត្រា</th>
              <th style={styles.tableHeaderCell}>លេខក្បាលដី</th>
              <th style={styles.tableHeaderCell}>អ្នកទិញ</th>
              <th style={styles.tableHeaderCell}>អ្នកលក់</th>
              <th style={styles.tableHeaderCell}>ជំហាន</th>
              <th style={styles.tableHeaderCell}>ការពិពណ៌នា</th>
              <th style={styles.tableHeaderCell}>ចំនួនទឹកប្រាក់</th>
              <th style={styles.tableHeaderCell}>កាលបរិច្ឆេទកំណត់</th>
              <th style={styles.tableHeaderCell}>ស្ថានភាព</th>
            </tr>
          </thead>
          <tbody>
            {data.payments && data.payments.length > 0 ? (
              data.payments.map((payment, index) => (
                <tr key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                  <td style={styles.tableCell}>{payment.contract_id || 'N/A'}</td>
                  <td style={styles.tableCell}>{payment.land_plot_number || 'N/A'}</td>
                  <td style={styles.tableCell}>{payment.buyer_names || 'N/A'}</td>
                  <td style={styles.tableCell}>{payment.seller_names || 'N/A'}</td>
                  <td style={styles.tableCell}>ជំហាន {payment.step_number || 'N/A'}</td>
                  <td style={styles.tableCell}>{payment.payment_time_description || 'N/A'}</td>
                  <td style={styles.tableCell}>{formatCurrency(payment.amount)}</td>
                  <td style={styles.tableCell}>{formatDate(payment.due_date)}</td>
                  <td style={{
                    ...styles.tableCell,
                    color: payment.status === 'paid' ? '#28a745' : 
                           payment.status === 'overdue' ? '#dc3545' : 
                           payment.status === 'pending' ? '#ffc107' : '#6c757d',
                    fontWeight: 'bold'
                  }}>
                    {payment.status === 'paid' ? 'បានបង់' :
                     payment.status === 'overdue' ? 'ហួសកំណត់' :
                     payment.status === 'pending' ? 'កំពុងរង់ចាំ' :
                     payment.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={styles.noData}>
                  មិនមានទិន្នន័យការទូទាត់
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p>របាយការណ៍នេះត្រូវបានបង្កើតដោយប្រព័ន្ធតាមដានដីកម្ពុជា</p>
      </div>
    </div>
  );
};

export default MonthlyReportHTML;
