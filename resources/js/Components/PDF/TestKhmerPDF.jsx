import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Test different font registration approaches
// Approach 1: Try without custom fonts first (use default fonts)
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontSize: 14,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 15,
  },
  text: {
    fontSize: 12,
    lineHeight: 1.5,
  },
});

const TestKhmerPDF = () => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Font Test</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.text}>English: This is English text</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.text}>Khmer: ការបង្កើតកិច្ចសន្យា</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.text}>Khmer: របាយការណ៍ប្រចាំខែ</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.text}>Khmer: អ្នកទិញ និង អ្នកលក់</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.text}>Numbers: 123456789</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.text}>Mixed: របាយការណ៍ 2025 ការបង្កើត</Text>
        </View>
      </Page>
    </Document>
  );
};

export default TestKhmerPDF;
