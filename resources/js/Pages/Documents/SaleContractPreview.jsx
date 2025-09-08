import { Head, usePage } from '@inertiajs/react';
import React, { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Card, Button, Space, Typography, Divider, message, Steps, Modal } from 'antd';
import { PrinterOutlined, DownloadOutlined, EditOutlined, UserOutlined, TeamOutlined, HomeOutlined, DollarOutlined, CheckCircleOutlined, EnvironmentOutlined, EyeOutlined, FileOutlined } from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const { Title } = Typography;

export default function SaleContractPreview({ document, populatedTemplate }) {
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
      line-height: 1.6;
      margin: 0;
      padding: 40px 60px;
      background: white;
      color: #000;
      font-size: 14pt;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
    }

    .kingdom-title {
      font-size: 18pt;
      font-weight: 700;
      margin-bottom: 5px;
      text-align: center;
    }

    .nation-religion-king {
      font-size: 20pt;
      font-weight: 700;
      margin-bottom: 15px;
      letter-spacing: 2px;
      text-align: center;
    }

    .contract-title {
      font-size: 20pt;
      font-weight: 700;
      color: #000;
      text-align: center;
      margin-bottom: 20px;
    }

    .document-container {
      max-width: 700px;
      margin: 0 auto;
      background: white;
      padding: 0;
    }

    .party-info {
      margin: 15px 0;
      background: none;
      border: none;
      padding: 0;
    }

    .party-info p {
      margin: 0;
      text-align: justify;
      line-height: 1.6;
      text-indent: 50px;
      word-wrap: break-word;
    }

    .contract-intro {
      text-align: center;
      margin: 25px 0;
      font-weight: 600;
    }

    .contract-intro p {
      text-indent: 0;
    }

    .additional-terms {
      margin: 20px 0;
      text-align: justify;
    }

    .additional-terms p {
      text-indent: 40px;
      line-height: 1.6;
    }

    .contract-date {
      margin: 30px 0;
    }

    .contract-date p {
      text-align: center;
      font-weight: 600;
      text-indent: 0;
    }

    .land-section {
      margin: 20px 0;
    }

    .land-section p {
      text-align: justify;
      text-indent: 40px;
      line-height: 1.6;
    }

    .payment-section {
      margin: 20px 0;
    }

    .payment-section p {
      text-align: justify;
      text-indent: 40px;
      line-height: 1.6;
    }

    .payment-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 12pt;
    }

    .payment-table th,
    .payment-table td {
      border: 1px solid #000;
      padding: 8px;
      text-align: center;
    }

    .payment-table th {
      background-color: #f0f0f0;
      font-weight: bold;
    }

    .witnesses {
      margin: 30px 0;
    }

    .witnesses p {
      text-align: justify;
      text-indent: 40px;
      line-height: 1.6;
    }

    .signatures {
      margin-top: 40px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    .signature-section {
      width: 45%;
      text-align: center;
      margin-bottom: 30px;
    }

    .signature-title {
      font-weight: bold;
      margin-bottom: 60px;
    }

    .signature-line {
      border-bottom: 1px solid #000;
      margin: 60px 0 10px 0;
    }

    .fingerprint-section {
      margin-top: 40px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    .fingerprint-box {
      width: 45%;
      text-align: center;
      margin-bottom: 20px;
    }

    .fingerprint-title {
      font-weight: bold;
      margin-bottom: 10px;
    }

    .fingerprint-area {
      border: 1px solid #000;
      height: 80px;
      margin: 10px 0;
    }

    @media print {
      body {
        padding: 20mm !important;
        font-size: 12pt !important;
      }
      
      .document-container {
        max-width: none !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      
      .party-info p {
        text-indent: 50px !important;
      }
      
      .additional-terms p {
        text-indent: 40px !important;
      }
      
      .land-section p {
        text-indent: 40px !important;
      }
      
      .payment-section p {
        text-indent: 40px !important;
      }
      
      .witnesses p {
        text-indent: 40px !important;
      }
    }
  `;

  // Get current step for navigation
  const currentStep = 4; // Document preview step
  
  const steps = [
    {
      title: 'ជ្រើសរើសអ្នកទិញ',
      status: 'finish',
      icon: <UserOutlined />,
    },
    {
      title: 'ជ្រើសរើសអ្នកលក់',
      status: 'finish',
      icon: <TeamOutlined />,
    },
    {
      title: 'ជ្រើសរើសដី',
      status: 'finish',
      icon: <EnvironmentOutlined />,
    },
    {
      title: 'ការបង់ប្រាក់',
      status: 'finish',
      icon: <DollarOutlined />,
    },
    {
      title: 'ពិនិត្យកិច្ចសន្យា',
      status: 'process',
      icon: <FileOutlined />,
    },
    {
      title: 'បញ្ចប់',
      status: 'wait',
      icon: <CheckCircleOutlined />,
    },
  ];

  const handleSave = async () => {
    if (!editorRef.current) return;
    
    setSaving(true);
    try {
      const editorContent = editorRef.current.getContent();
      
      const response = await axios.post(`/documents/${document.id}/save`, {
        content: editorContent
      });

      if (response.status === 200) {
        message.success('កិច្ចសន្យាត្រូវបានរក្សាទុកដោយជោគជ័យ');
        setContent(editorContent);
      }
    } catch (error) {
      console.error('Save error:', error);
      message.error('មានបញ្ហាក្នុងការរក្សាទុក');
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    if (!editorRef.current) return;
    
    const printContent = editorRef.current.getContent();
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>កិច្ចសន្យាលក់ដី</title>
        <style>${contractStyles}</style>
      </head>
      <body>
        ${printContent}
      </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handleGeneratePDF = async () => {
    if (!editorRef.current) return;
    
    setLoading(true);
    try {
      const editorContent = editorRef.current.getContent();
      
      const response = await axios.post(`/documents/${document.id}/generate-pdf`, {
        content: editorContent
      }, {
        responseType: 'blob'
      });

      if (response.status === 200) {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `sale_contract_${document.id}_${new Date().toISOString().slice(0, 10)}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        message.success('បានបង្កើត PDF ដោយជោគជ័យ');
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      message.error('មានបញ្ហាក្នុងការបង្កើត PDF');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    setPreviewVisible(true);
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <AdminLayout>
      <Head title="ពិនិត្យ និងកែសម្រួលកិច្ចសន្យាលក់ដី" />
      
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
            <Title level={3}>ពិនិត្យ និងកែសម្រួលកិច្ចសន្យាលក់ដី</Title>
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
          title="មើលជាមុនកិច្ចសន្យាលក់ដី"
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
