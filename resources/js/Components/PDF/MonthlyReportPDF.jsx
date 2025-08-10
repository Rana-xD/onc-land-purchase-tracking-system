import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register Khmer fonts for react-pdf using the correct approach
Font.register({
  family: 'NotoSansKhmer',
  fonts: [
    {
      src: '/fonts/NotoSansKhmer-Regular.ttf',
      fontStyle: 'normal',
      fontWeight: 'normal',
    },
    {
      src: '/fonts/NotoSansKhmer-Bold.ttf',
      fontStyle: 'normal',
      fontWeight: 'bold',
    },
  ],
});

// Register KhmerOS as fallback
Font.register({
  family: 'KhmerOS',
  src: '/fonts/KhmerOS.ttf',
  fontStyle: 'normal',
  fontWeight: 'normal',
});

// Create styles with Khmer font support
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontFamily: 'NotoSansKhmer',
    fontSize: 12,
  },
  header: {
    textAlign: 'center',
    marginBottom: 30,
    borderBottom: '2px solid #333333',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
    backgroundColor: '#f5f5f5',
    padding: 8,
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  summaryItem: {
    width: '50%',
    marginBottom: 8,
    flexDirection: 'row',
  },
  summaryLabel: {
    fontWeight: 'bold',
    width: '60%',
  },
  summaryValue: {
    width: '40%',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: '#cccccc',
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    backgroundColor: '#f8f9fa',
    padding: 8,
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
    padding: 8,
  },
  tableCellHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableCell: {
    fontSize: 10,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    textAlign: 'center',
    fontSize: 10,
    color: '#666666',
  },
  exportInfo: {
    textAlign: 'right',
    fontSize: 10,
    color: '#666666',
    marginBottom: 10,
  },
});

const MonthlyReportPDF = ({ data, startDate, endDate, exportedBy }) => {
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>របាយការណ៍ប្រចាំខែ</Text>
          <Text style={styles.subtitle}>
            ពី {formatDate(startDate)} ដល់ {formatDate(endDate)}
          </Text>
        </View>

        {/* Export Info */}
        <View style={styles.exportInfo}>
          <Text>នាំចេញដោយ: {exportedBy}</Text>
          <Text>កាលបរិច្ឆេទនាំចេញ: {formatDate(new Date().toISOString())}</Text>
        </View>

        {/* Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 សង្ខេប</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>💰 ចំនួនសរុប:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(data.summary?.total_amount)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>✅ បានបង់:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(data.summary?.total_paid)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>⏰ ហួសកំណត់:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(data.summary?.total_overdue)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>⏳ កំពុងរង់ចាំ:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(data.summary?.total_pending)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>📋 ចំនួនការបង់:</Text>
              <Text style={styles.summaryValue}>{data.summary?.payment_count || 0}</Text>
            </View>
          </View>
        </View>

        {/* Monthly Breakdown Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 បំបែកប្រចាំខែ</Text>
          
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>ខែ</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>ចំនួនសរុប</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>បានបង់</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>ហួសកំណត់</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>កំពុងរង់ចាំ</Text>
              </View>
            </View>

            {/* Table Rows */}
            {data.monthly_data && data.monthly_data.length > 0 ? (
              data.monthly_data.map((monthData, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{monthData.month}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{formatCurrency(monthData.total_amount)}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{formatCurrency(monthData.paid)}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{formatCurrency(monthData.overdue)}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{formatCurrency(monthData.pending)}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <View style={[styles.tableCol, { width: '100%' }]}>
                  <Text style={styles.tableCell}>មិនមានទិន្នន័យសម្រាប់ខែនេះ</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>របាយការណ៍នេះត្រូវបានបង្កើតដោយប្រព័ន្ធតាមដានដីកម្ពុជា</Text>
        </View>
      </Page>
    </Document>
  );
};

export default MonthlyReportPDF;
