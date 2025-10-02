import React, { useState, useRef } from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Card, Button, Space, Typography, notification, Steps } from "antd";
import {
    PrinterOutlined,
    ArrowLeftOutlined,
    FileTextOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";

const { Title } = Typography;

export default function AcceptanceContractPreview({
    auth,
    document,
    paymentStep,
    populatedTemplate,
}) {
    const [content, setContent] = useState(populatedTemplate);
    const [loading, setLoading] = useState(false);
    const editorRef = useRef(null);

    // Embedded CSS styles for consistent loading (based on deposit contract)
    const contractStyles = `
        @import url('https://fonts.googleapis.com/css2?family=Koh+Santepheap:wght@100;300;400;700;900&display=swap');

        body {
            font-family: 'Koh Santepheap', 'Khmer OS', 'Hanuman', serif !important;
            line-height: 1.6;
            margin: 0;
            padding: 40px 20px;
            background: white;
            color: #000;
            font-size: 14pt;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
        }

        .document-container {
            max-width: 700px;
            margin: 0 auto;
            background: white;
            padding: 0;
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
        font-size: 18pt !important;
        margin-bottom: 5px !important;
        text-align: center !important;
        font-weight: 700 !important;
      }

        .contract-title {
            font-size: 16pt;
            font-weight: 700;
            margin: 15px 0;
            text-decoration: underline;
            text-underline-offset: 3px;
            text-align: center;
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

        .contract-intro {
            text-align: center;
            margin: 25px 0;
            font-weight: 600;
        }

        .contract-intro p {
            text-align: center;
            margin: 0;
        }

        .land-section, .payment-acceptance-section {
            margin: 20px 0;
            text-align: justify;
        }

        .land-section p, .payment-acceptance-section p {
            text-indent: 40px;
            margin: 15px 0;
            line-height: 1.6;
        }

        .land-details, .conditions {
            list-style: none;
            padding-left: 0;
            margin: 15px 0;
        }

        .land-details li, .conditions li {
            margin: 10px 0;
            padding-left: 50px;
            text-indent: -30px;
            line-height: 1.6;
            text-align: justify;
        }

        .land-details li:before, .conditions li:before {
            content: "- ";
            font-weight: bold;
            margin-right: 10px;
        }

        .fingerprint-section {
            margin-top: 40px;
        }

        .fingerprint-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 30px;
        }

        .fingerprint-group {
            flex: 1;
            text-align: center;
            margin: 0 10px;
        }

        .fingerprint-label {
            font-size: 12pt;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .fingerprint-box {
            width: 120px;
            height: 120px;
            margin: 0 auto 10px auto;
            display: block;
        }

        .signature-line {
            width: 120px;
            height: 2px;
            border-bottom: 1px dotted #000;
            margin: 10px auto;
            display: block;
        }

        p, div, span, td, th, li, h1, h2, h3, h4, h5, h6 {
            font-family: 'Koh Santepheap', 'Khmer OS', 'Hanuman', serif !important;
            letter-spacing: 0.3px;
        }

        strong {
            font-weight: 700;
        }

        .indent-text {
            text-indent: 50px;
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
        }
    `;

    const handlePrint = () => {
        // Generate PDF and open in new tab for printing (GET request for inline display)
        const contractTypePrefix =
            document.contract_type === "sale_contract"
                ? "sale-contracts"
                : "deposit-contracts";
        const printUrl = `/api/${contractTypePrefix}/${document.id}/payment-step/${paymentStep.id}/generate-acceptance-contract-pdf`;
        window.open(printUrl, "_blank");
    };

    const handleBack = () => {
        window.history.back();
    };

    // Steps for acceptance contract
    const steps = [
        {
            title: "កិច្ចសន្យាដើម",
            status: "finish",
            icon: <FileTextOutlined />,
        },
        {
            title: "ការបង់ប្រាក់",
            status: "finish",
            icon: <CheckCircleOutlined />,
        },
        {
            title: "កិច្ចសន្យាទទួលយកប្រាក់",
            status: "process",
            icon: <FileTextOutlined />,
        },
    ];

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    លិខិតទទួល-ប្រគល់ប្រាក់ - ដំណាក់កាលទី
                    {paymentStep.step_number}
                </h2>
            }
        >
            <Head
                title={`កិច្ចសន្យាទទួលយកប្រាក់ - ${document.document_code || document.id}`}
            />

            <div className="container mx-auto py-6">
                <Card className="mb-6">
                    <Steps
                        current={2}
                        items={steps}
                        responsive={true}
                        className="site-navigation-steps"
                        size="small"
                    />
                </Card>

                <Card>
                    <div className="flex justify-between items-center mb-6">
                        <Title level={3}>
                            លិខិតទទួល-ប្រគល់ប្រាក់ - ដំណាក់កាលទី
                            {paymentStep.step_number}
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
