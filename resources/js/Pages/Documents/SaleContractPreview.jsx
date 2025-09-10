import { Head, usePage } from "@inertiajs/react";
import React, { useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import {
    Card,
    Button,
    Space,
    Typography,
    Divider,
    message,
    Steps,
    Modal,
} from "antd";
import {
    PrinterOutlined,
    DownloadOutlined,
    EditOutlined,
    UserOutlined,
    TeamOutlined,
    HomeOutlined,
    DollarOutlined,
    CheckCircleOutlined,
    EnvironmentOutlined,
    EyeOutlined,
    FileOutlined,
    ArrowLeftOutlined,
} from "@ant-design/icons";
import AdminLayout from "@/Layouts/AdminLayout";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const { Title } = Typography;

export default function SaleContractPreview({ document, populatedTemplate }) {
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState(populatedTemplate);
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
      font-size: 18pt;
      font-weight: 700;
      margin-bottom: 15px;
      letter-spacing: 2px;
      text-align: center;
    }

    .contract-title {
      font-size: 16pt !important;
      font-weight: 700 !important;
      margin: 15px 0 !important;
      text-decoration: underline !important;
      text-underline-offset: 3px !important;
      text-align: center !important;
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
      text-indent: 0;
      word-wrap: break-word;
    }

    /* Two-column flex party section structure */
    .party-section {
      margin: 20px 0;
      padding: 0;
      border: none;
      background: none;
      line-height: 1.6;
      display: flex;
      align-items: flex-start;
      gap: 5px;
    }

    .party-title {
      font-weight: 700;
      font-size: 14pt;
      flex: 0 0 auto;
      min-width: 120px;
    }

    .party-content {
      flex: 1;
    }

    .party-details {
      flex: 1;
      line-height: 1.6;
    }

    .party-form-line {
      margin: 2px 0;
      line-height: 1.6;
      display: inline;
      white-space: wrap;
    }

    .form-label {
      font-weight: 400;
      display: inline;
      margin-right: 5px;
    }

    .form-value {
      display: inline;
      border: none;
      padding: 0;
      margin: 0 3px;
      font-weight: 400;
    }

    .party-separator {
      font-weight: 600;
      margin: 15px 0;
      text-align: center;
      font-size: 14pt;
    }

    .party-designation {
      margin-top: 15px;
      font-weight: 600;
      text-align: right;
      font-style: italic;
    }

    .contract-form-field {
      display: inline;
      border: none;
      padding: 0;
      margin: 0 3px;
      font-weight: 400;
    }

    /* Reusable two-column section layout */
    .two-column-section {
      margin: 20px 0;
      padding: 0;
      border: none;
      background: none;
      line-height: 1.6;
      display: flex;
      align-items: flex-start;
      gap: 5px;
    }

    .section-label {
      font-weight: 700;
      font-size: 14pt;
      flex: 0 0 auto;
      min-width: 120px;
    }

    .section-content {
      flex: 1;
    }

    .content-line {
      margin: 2px 0;
      line-height: 1.6;
      display: inline;
      white-space: wrap;
    }

    /* Land terms section with numbered subsections */
    .land-terms-section {
      margin: 20px 0;
      line-height: 1.8;
    }

    .term-subsection {
      margin: 15px 0;
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }

    .term-number {
      font-weight: 700;
      font-size: 14pt;
      flex: 0 0 auto;
      min-width: 40px;
    }

    .term-content {
      flex: 1;
      text-align: justify;
      line-height: 1.8;
    }

    .land-detail-item {
      margin: 8px 0;
      padding-left: 20px;
      text-indent: -20px;
      line-height: 1.8;
    }

    .sub-item {
      margin: 5px 0;
      padding-left: 20px;
      text-indent: -20px;
      line-height: 1.8;
    }

    /* Payment schedule section styling */
    .payment-schedule-section {
      margin: 20px 0;
    }

    .payment-schedule-section .two-column-section {
      margin: 10px 0;
    }

    .payment-schedule-section .section-label {
      font-weight: 700;
      font-size: 14pt;
      min-width: 140px;
    }

    .payment-schedule-section .content-line {
      text-align: justify;
      line-height: 1.8;
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
      flex-wrap: nowrap;
      gap: 10px;
    }

    .signature-block {
      flex: 1;
      text-align: center;
      margin-bottom: 30px;
      min-width: 0;
    }

    .signature-title {
      font-weight: bold;
      margin-bottom: 60px;
    }

    .signature-line {
      border-bottom: 1px solid #000;
      margin: 60px 0 10px 0;
    }

    /* Fingerprint section styles */
    .fingerprint-section {
      margin-top: 30px !important;
      width: 100% !important;
    }

    .fingerprint-row {
      margin-top: 30px !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: flex-start !important;
      gap: 20px !important;
      width: 100% !important;
      flex-wrap: nowrap !important;
    }

    .fingerprint-group {
      flex: 1 !important;
      text-align: center !important;
      font-size: 14pt !important;
      line-height: 1.6 !important;
      min-width: 0 !important;
      max-width: 25% !important;
    }

    .fingerprint-label {
      font-weight: 700 !important;
      margin-bottom: 20px !important;
      display: block !important;
      font-size: 14pt !important;
    }

    .fingerprint-box {
      width: 80px !important;
      height: 80px !important;
      margin: 0 auto 10px auto !important;
      display: block !important;
      border: 1px solid transparent !important;
    }

    .signature-line {
      width: 100px !important;
      height: 2px !important;
      border-bottom: 1px dotted #000 !important;
      margin: 10px auto !important;
      display: block !important;
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
            title: "ជ្រើសរើសអ្នកទិញ",
            status: "finish",
            icon: <UserOutlined />,
        },
        {
            title: "ជ្រើសរើសអ្នកលក់",
            status: "finish",
            icon: <TeamOutlined />,
        },
        {
            title: "ជ្រើសរើសដី",
            status: "finish",
            icon: <EnvironmentOutlined />,
        },
        {
            title: "ការបង់ប្រាក់",
            status: "finish",
            icon: <DollarOutlined />,
        },
        {
            title: "ពិនិត្យកិច្ចសន្យា",
            status: "process",
            icon: <FileOutlined />,
        },
        {
            title: "បញ្ចប់",
            status: "wait",
            icon: <CheckCircleOutlined />,
        },
    ];


    const handlePrint = () => {
        // Generate PDF first, then open in new tab for printing
        const printUrl = `/api/sale-contracts/${document.id}/print-pdf`;
        window.open(printUrl, '_blank');
    };



    const handleBack = () => {
        window.location.href = route('sale-contracts.success', { id: document.id });
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
                        <Title level={3}>
                            ពិនិត្យ និងកែសម្រួលកិច្ចសន្យាលក់ដី
                        </Title>
                    </div>

                    <div className="mb-4">
                        <Editor
                            apiKey={
                                import.meta.env.VITE_TINYMCE_API_KEY ||
                                "no-api-key"
                            }
                            onInit={(evt, editor) =>
                                (editorRef.current = editor)
                            }
                            initialValue={content}
                            init={{
                                height: 800,
                                menubar: false,
                                plugins: [
                                    "advlist",
                                    "autolink",
                                    "lists",
                                    "link",
                                    "image",
                                    "charmap",
                                    "preview",
                                    "anchor",
                                    "searchreplace",
                                    "visualblocks",
                                    "code",
                                    "fullscreen",
                                    "insertdatetime",
                                    "media",
                                    "table",
                                    "help",
                                    "wordcount",
                                ],
                                toolbar:
                                    "undo redo | blocks | " +
                                    "bold italic forecolor backcolor | alignleft aligncenter " +
                                    "alignright alignjustify | bullist numlist outdent indent | " +
                                    "removeformat | table | preview | help",
                                content_css: false,
                                content_style: contractStyles,
                                font_formats:
                                    "Koh Santepheap=Koh Santepheap,serif;Hanuman=Hanuman,serif;Khmer OS=Khmer OS,serif;",
                                extended_valid_elements:
                                    "span[class|style],div[class|style],p[class|style],table[class|style],td[class|style],th[class|style]",
                                valid_children: "+body[style]",
                                verify_html: false,
                                entity_encoding: "raw",
                                directionality: "ltr",
                                setup: (editor) => {
                                    editor.on("change", () => {
                                        const newContent = editor.getContent();
                                        setContent(newContent);
                                    });
                                },
                            }}
                        />
                    </div>

                    <div className="flex justify-between mt-6">
                        <Space size="middle">
                            <Button 
                                type="primary" 
                                icon={<PrinterOutlined />} 
                                onClick={handlePrint}
                                size="large"
                            >
                                បោះពុម្ព
                            </Button>
                            
                            <Button 
                                type="default" 
                                icon={<ArrowLeftOutlined />} 
                                onClick={handleBack}
                                size="large"
                            >
                                ត្រឡប់ក្រោយ
                            </Button>
                        </Space>
                    </div>
                </Card>

            </div>
        </AdminLayout>
    );
}
