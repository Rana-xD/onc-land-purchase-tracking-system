import { Head, usePage } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Card, Button, Space, Typography, Divider, message, Steps, Modal } from 'antd';
import { PrinterOutlined, DownloadOutlined, EditOutlined, UserOutlined, TeamOutlined, HomeOutlined, DollarOutlined, CheckCircleOutlined, EnvironmentOutlined, EyeOutlined, FileOutlined } from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const { Title } = Typography;

export default function DepositContractPreview({ document, populatedTemplate }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState(populatedTemplate);
  const [previewVisible, setPreviewVisible] = useState(false);
  const editorRef = useRef(null);

  // Embedded CSS styles for consistent loading
  const contractStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Koh+Santepheap:wght@100;300;400;700;900&display=swap');

    body {
      font-family: 'Koh Santepheap', 'Khmer OS', 'Hanuman', serif !important;
      line-height: 2.2;
      margin: 0;
      padding: 40px 60px;
      background: white;
      color: #000;
      font-size: 13pt;
      max-width: 210mm;
      margin: 0 auto;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }

    h1, h2, h3 {
      text-align: center;
      font-family: 'Koh Santepheap', serif !important;
    }

    h1 {
      font-size: 18pt;
      font-weight: 700;
      margin: 15px 0 10px 0;
      letter-spacing: 0.5px;
    }

    h2 {
      font-size: 14pt;
      font-weight: 400;
      margin: 8px 0;
    }

    h3 {
      font-size: 16pt;
      font-weight: 700;
      text-decoration: underline;
      margin: 20px 0 15px 0;
      text-underline-offset: 3px;
    }

    p {
      margin: 12px 0;
      text-align: justify;
      text-indent: 40px;
      line-height: 2.2;
    }

    .contract-intro {
      text-align: center;
      margin: 25px 0;
      font-weight: 600;
    }

    .content-section {
      margin: 20px 0;
      text-align: justify;
    }

    .party-info {
      margin: 15px 0;
      line-height: 2.2;
      background: none;
      border: none;
      padding: 0;
    }

    .fill-text {
      display: inline-block;
      border-bottom: 1px dotted #333;
      padding: 0 5px;
      min-width: 80px;
    }

    strong {
      font-weight: 700;
    }

    .section-title {
      font-weight: 700;
      margin: 30px 0 15px 0;
      text-decoration: underline;
      text-underline-offset: 3px;
      font-size: 14pt;
    }

    .contract-item {
      margin: 15px 0;
      padding-left: 50px;
      text-indent: -30px;
      text-align: justify;
      line-height: 2.2;
    }

    ul {
      list-style: none;
      padding-left: 0;
    }

    ul li {
      margin: 12px 0;
      padding-left: 50px;
      text-indent: -30px;
      line-height: 2.2;
    }

    ul li:before {
      content: "- ";
      font-weight: bold;
      margin-right: 10px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }

    table td, table th {
      border: 1px solid #000;
      padding: 8px 12px;
      text-align: left;
      font-size: 13pt;
    }

    table th {
      font-weight: 700;
      background-color: #f5f5f5;
    }

    .signature-section {
      margin-top: 60px;
      display: flex;
      justify-content: space-between;
    }

    .signature-block {
      width: 45%;
      text-align: center;
    }

    .signature-line {
      margin: 60px 0 10px 0;
      border-bottom: 1px solid #000;
    }

    .page-break {
      page-break-after: always;
      margin-top: 30px;
    }

    .khmer-text {
      letter-spacing: 0.3px;
      word-spacing: 2px;
    }

    .indent-1 {
      padding-left: 40px;
    }

    .indent-2 {
      padding-left: 60px;
    }

    .term-number {
      font-weight: 700;
      margin-right: 10px;
    }

    .date-location {
      text-align: center;
      margin: 20px 0;
      font-weight: 600;
    }

    .kingdom-title {
      font-size: 18pt;
      font-weight: 700;
      margin-bottom: 10px;
      text-align: center;
    }

    .nation-religion-king {
      font-size: 14pt;
      margin-bottom: 8px;
      text-align: center;
    }

    .contract-title {
      font-size: 16pt;
      font-weight: 700;
      margin: 20px 0 15px 0;
      text-decoration: underline;
      text-underline-offset: 3px;
      text-align: center;
    }

    .header {
      text-align: center;
      margin-bottom: 25px;
    }

    .party-title,
    .terms-title {
      font-weight: 700;
      margin: 30px 0 15px 0;
      text-decoration: underline;
      text-underline-offset: 3px;
      font-size: 14pt;
    }

    .info-row {
      margin-bottom: 12px;
      line-height: 2.2;
    }

    .info-label {
      font-weight: 600;
      display: inline;
    }

    .info-value {
      display: inline-block;
      border-bottom: 1px dotted #333;
      padding: 0 5px;
      min-width: 80px;
    }

    .term-item {
      margin: 15px 0;
      padding-left: 50px;
      text-indent: -30px;
      text-align: justify;
      line-height: 2.2;
    }

    .signatures {
      margin-top: 60px;
    }

    .signature-title {
      font-weight: 700;
      margin-bottom: 10px;
    }

    p, div, span, td, th, li, h1, h2, h3, h4, h5, h6 {
      font-family: 'Koh Santepheap', 'Khmer OS', 'Hanuman', serif !important;
      letter-spacing: 0.3px;
    }

    .document-container {
      max-width: 100%;
      margin: 0 auto;
      background: white;
      padding: 0;
      box-shadow: none;
    }

    @media print {
      body {
        padding: 0;
        margin: 0;
      }
      
      .document-container {
        box-shadow: none;
        max-width: none;
      }
      
      .signatures {
        page-break-inside: avoid;
      }
    }
  `;

  const handleSave = async () => {
    if (!editorRef.current) {
      message.error('Editor not ready');
      return;
    }

    setSaving(true);
    try {
      const editorContent = editorRef.current.getContent();
      
      await axios.post(`/api/deposit-contracts/${document.id}/save-document`, {
        content: editorContent
      });
      
      setContent(editorContent);
      message.success('ព្រាងកិច្ចសន្យាត្រូវបានរក្សាទុកដោយជោគជ័យ');
    } catch (error) {
      console.error('Error saving document:', error);
      message.error('មានបញ្ហាក្នុងការរក្សាទុកព្រាង');
    } finally {
      setSaving(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!editorRef.current) {
      message.error('Editor not ready');
      return;
    }

    setLoading(true);
    try {
      // Save the document content first
      const editorContent = editorRef.current.getContent();
      const contractType = document.document_type || 'deposit_contract';
      const saveEndpoint = contractType === 'sale_contract' 
        ? `/api/sale-contracts/${document.id}/save-document`
        : `/api/deposit-contracts/${document.id}/save-document`;
      
      await axios.post(saveEndpoint, {
        content: editorContent
      });

      // Trigger PDF generation and download via direct navigation
      const filename = `${contractType}_${document.id}_${new Date().toISOString().slice(0, 10)}.pdf`;
      
      // Use location.href to trigger download with correct API endpoint
      const apiEndpoint = contractType === 'sale_contract' 
        ? `/api/sale-contracts/${document.id}/generate-pdf?download=${filename}`
        : `/api/deposit-contracts/${document.id}/generate-pdf?download=${filename}`;
      
      window.location.href = apiEndpoint;
      
      message.success('PDF ត្រូវបានបង្កើតដោយជោគជ័យ');
    } catch (error) {
      console.error('Error generating PDF:', error);
      message.error('មានបញ្ហាក្នុងការបង្កើត PDF');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (!editorRef.current) {
      message.error('Editor not ready');
      return;
    }

    const printContent = editorRef.current.getContent();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>កិច្ចសន្យាកក់ប្រាក់ទិញដី</title>
        <link href="https://fonts.googleapis.com/css2?family=Koh+Santepheap:wght@100;300;400;700;900&display=swap" rel="stylesheet">
        <style>
          body { 
            font-family: 'Koh Santepheap', serif; 
            margin: 0; 
            padding: 20px; 
            line-height: 1.6;
          }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handlePreview = () => {
    setPreviewVisible(true);
  };

  const handleBack = () => {
    window.location.href = route('deposit-contracts.success', { id: document.id });
  };

  // Determine current step
  const currentStep = 4; // Fifth step (0-indexed)
  
  const steps = [
    {
      title: 'ជ្រើសរើសអ្នកទិញ',
      icon: <UserOutlined />,
    },
    {
      title: 'ជ្រើសរើសអ្នកលក់',
      icon: <TeamOutlined />,
    },
    {
      title: 'ជ្រើសរើសដី និងកំណត់តម្លៃ',
      icon: <EnvironmentOutlined />,
    },
    {
      title: 'កំណត់ការកក់ប្រាក់',
      icon: <DollarOutlined />,
    },
    {
      title: 'ពិនិត្យ និងបោះពុម្ព',
      icon: <EyeOutlined />,
    },
    {
      title: 'បង្កើតកិច្ចសន្យា',
      icon: <FileOutlined />,
    }
  ];

  return (
    <AdminLayout>
      <Head title="ពិនិត្យ និងកែសម្រួលកិច្ចសន្យា" />
      
      <div className="container mx-auto py-6">
        <Card className="mb-6">
          <Steps 
            current={currentStep} 
            items={steps} 
            responsive={true} 
            className="site-navigation-steps" 
            size="small"
          />
        </Card>
        
        <Card>
          <div className="flex justify-between items-center mb-6">
            <Title level={3}>ពិនិត្យ និងកែសម្រួលកិច្ចសន្យា</Title>
            <div className="space-x-2">
              <Button 
                icon={<EyeOutlined />}
                onClick={handlePreview}
              >
                មើលជាមុន
              </Button>
            </div>
          </div>
          
          <div className="mb-4">
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY || "no-api-key"}
              onInit={(evt, editor) => editorRef.current = editor}
              initialValue={content}
              init={{
                height: 800,
                menubar: false,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic forecolor backcolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | table | preview | help',
                content_css: false,
                content_style: contractStyles,
                font_formats: 'Koh Santepheap=Koh Santepheap,serif;Hanuman=Hanuman,serif;Khmer OS=Khmer OS,serif;',
                extended_valid_elements: 'span[class|style],div[class|style],p[class|style],table[class|style],td[class|style],th[class|style]',
                valid_children: '+body[style]',
                verify_html: false,
                entity_encoding: 'raw',
                directionality: 'ltr',
                setup: (editor) => {
                  editor.on('change', () => {
                    const newContent = editor.getContent();
                    setContent(newContent);
                  });
                }
              }}
            />
          </div>
          
          <div className="flex justify-between mt-6">
            <Button onClick={handleBack}>
              ត្រឡប់ក្រោយ
            </Button>
            
            <div className="space-x-2">
              <Button 
                onClick={handleSave}
                loading={saving}
              >
                រក្សាទុកព្រាង
              </Button>
              <Button 
                onClick={handlePrint}
                disabled={loading}
              >
                បោះពុម្ព
              </Button>
              <Button 
                type="primary"
                onClick={handleGeneratePDF}
                loading={loading}
              >
                បង្កើត PDF
              </Button>
            </div>
          </div>
        </Card>

        {/* Preview Modal */}
        <Modal
          title="មើលជាមុនកិច្ចសន្យា"
          open={previewVisible}
          onCancel={() => setPreviewVisible(false)}
          footer={[
            <Button key="close" onClick={() => setPreviewVisible(false)}>
              បិទ
            </Button>,
            <Button key="print" onClick={handlePrint}>
              បោះពុម្ព
            </Button>,
            <Button key="pdf" type="primary" onClick={handleGeneratePDF} loading={loading}>
              បង្កើត PDF
            </Button>
          ]}
          width="90%"
          style={{ top: 20 }}
          bodyStyle={{ maxHeight: '70vh', overflow: 'auto' }}
        >
          <div 
            dangerouslySetInnerHTML={{ __html: content }}
            style={{ 
              fontFamily: 'Koh Santepheap, serif',
              lineHeight: 1.6,
              fontSize: '14px'
            }}
          />
        </Modal>
      </div>
    </AdminLayout>
  );
}
