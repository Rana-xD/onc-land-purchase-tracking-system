import React from 'react';

const PaymentStatusReportHTML = ({ data, exportedBy }) => {
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'បានបង់':
        return '#28a745';
      case 'overdue':
      case 'ហួសកំណត់':
        return '#dc3545';
      case 'pending':
      case 'កំពុងរង់ចាំ':
        return '#ffc107';
      default:
        return '#6c757d';
    }
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
      borderLeft: '4px solid #ffc107',
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
      color: '#ffc107',
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
      backgroundColor: '#ffc107',
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
    statusCell: {
      padding: '10px',
      textAlign: 'center',
      border: '1px solid #dee2e6',
      fontWeight: 'bold',
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
        <h1 style={styles.title}>របាយការណ៍ស្ថានភាពការបង់ប្រាក់</h1>
        <p style={styles.subtitle}>ព័ត៌មានលម្អិតអំពីការបង់ប្រាក់</p>
      </div>

      {/* Export Info */}
      <div style={styles.exportInfo}>
        <div>នាំចេញដោយ: {exportedBy}</div>
        <div>កាលបរិច្ឆេទនាំចេញ: {formatDate(new Date().toISOString())}</div>
      </div>

      {/* Summary Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📊 សង្ខេប</h2>
        <div style={styles.summaryGrid}>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>📊 ចំនួនកិច្ចសន្យា:</span>
            <span style={styles.summaryValue}>{data.summary?.contracts_count || 0}</span>
          </div>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>💰 ចំនួនសរុប:</span>
            <span style={styles.summaryValue}>{formatCurrency(data.summary?.total_amount)}</span>
          </div>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>✅ ចំនួនបានទូទាត់:</span>
            <span style={styles.summaryValue}>{formatCurrency(data.summary?.total_paid)}</span>
          </div>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>❌ ចំនួនមិនទានទូទាត់:</span>
            <span style={styles.summaryValue}>{formatCurrency(data.summary?.total_unpaid)}</span>
          </div>
          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>📋 ចំនួនការបង់:</span>
            <span style={styles.summaryValue}>{data.summary?.payment_count || 0}</span>
          </div>
        </div>
      </div>

      {/* Contract Payment Status Details */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📋 ស្ថានភាពទូទាត់កិច្ចសន្យា</h2>
        
        <table style={styles.table}>
          <thead style={styles.tableHeader}>
            <tr>
              <th style={styles.tableHeaderCell}>លេខកិច្ចសន្យា</th>
              <th style={styles.tableHeaderCell}>លេខក្បាលដីធ្លី</th>
              <th style={styles.tableHeaderCell}>ចំនួនសរុប</th>
              <th style={styles.tableHeaderCell}>ចំនួនបានទូទាត់</th>
              <th style={styles.tableHeaderCell}>ចំនួនមិនទានទូទាត់</th>
            </tr>
          </thead>
          <tbody>
            {data.contracts && data.contracts.length > 0 ? (
              data.contracts.map((contract, index) => (
                <tr key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                  <td style={styles.tableCell}>{contract.contract_id || 'N/A'}</td>
                  <td style={styles.tableCell}>{contract.land_plot_number || 'N/A'}</td>
                  <td style={styles.tableCell}>{formatCurrency(contract.total_amount)}</td>
                  <td style={{...styles.tableCell, color: '#28a745', fontWeight: 'bold'}}>
                    {formatCurrency(contract.paid_amount)}
                  </td>
                  <td style={{...styles.tableCell, color: '#dc3545', fontWeight: 'bold'}}>
                    {formatCurrency(contract.unpaid_amount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={styles.noData}>
                  មិនមានទិន្នន័យកិច្ចសន្យា
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Overdue Payments */}
      {data.overdue_payments && data.overdue_payments.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>⚠️ ការបង់ប្រាក់ហួសកំណត់</h2>
          
          <table style={styles.table}>
            <thead style={styles.tableHeader}>
              <tr>
                <th style={styles.tableHeaderCell}>លេខកិច្ចសន្យា</th>
                <th style={styles.tableHeaderCell}>ដំណាក់កាល</th>
                <th style={styles.tableHeaderCell}>ចំនួនទឹកប្រាក់</th>
                <th style={styles.tableHeaderCell}>កាលបរិច្ឆេទកំណត់</th>
                <th style={styles.tableHeaderCell}>ចំនួនថ្ងៃហួសកំណត់</th>
              </tr>
            </thead>
            <tbody>
              {data.overdue_payments.map((payment, index) => (
                <tr key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                  <td style={styles.tableCell}>{payment.contract_id}</td>
                  <td style={styles.tableCell}>{payment.step_number}</td>
                  <td style={styles.tableCell}>{formatCurrency(payment.amount)}</td>
                  <td style={styles.tableCell}>{formatDate(payment.due_date)}</td>
                  <td style={{
                    ...styles.tableCell,
                    color: '#dc3545',
                    fontWeight: 'bold',
                  }}>
                    {payment.days_overdue} ថ្ងៃ
                  </td>
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

export default PaymentStatusReportHTML;
