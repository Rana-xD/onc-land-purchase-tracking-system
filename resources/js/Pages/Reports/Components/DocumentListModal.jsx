import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, Space, Tooltip, Empty, message, Spin, Popconfirm } from 'antd';
import { 
    DownloadOutlined, 
    DeleteOutlined, 
    FileTextOutlined, 
    FilePdfOutlined, 
    FileImageOutlined, 
    FileUnknownOutlined 
} from '@ant-design/icons';
import axios from 'axios';

export default function DocumentListModal({ visible, onCancel, paymentStep }) {
    // paymentStep can be null if we're showing all documents
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch documents when modal becomes visible or payment step changes
    useEffect(() => {
        if (visible) {
            fetchDocuments();
        }
    }, [visible, paymentStep]);

    // Fetch documents for the payment step or all documents
    const fetchDocuments = async () => {
        setLoading(true);
        try {
            // If paymentStep is null, fetch all documents
            // Otherwise, fetch documents for specific payment step
            const endpoint = paymentStep
                ? `/api/reports/payment-steps/${paymentStep.id}/documents`
                : `/api/reports/contract-documents`;
                
            const response = await axios.get(endpoint);
            setDocuments(response.data.documents || []);
        } catch (error) {
            console.error('បញ្ហាក្នុងការទាញកិច្ចសន្យា:', error);
            message.error('មានបញ្ហាក្នុងការផ្ទុកកិច្ចសន្យា');
        } finally {
            setLoading(false);
        }
    };

    // Handle document download
    const handleDownload = (documentId) => {
        window.open(`/api/reports/contract-documents/${documentId}/download`, '_blank');
    };

    // Handle document deletion
    const handleDelete = async (documentId) => {
        try {
            setLoading(true);
            await axios.delete(`/api/reports/contract-documents/${documentId}`);
            message.success('លុបកិច្ចសន្យាជោគជ័យ');
            fetchDocuments();
        } catch (error) {
            console.error('បញ្ហាក្នុងការលុបកិច្ចសន្យា:', error);
            message.error(error.response?.data?.error || 'មានបញ្ហាក្នុងការលុបកិច្ចសន្យា');
        } finally {
            setLoading(false);
        }
    };

    // Get document type icon
    const getDocumentIcon = (mimeType) => {
        if (mimeType === 'application/pdf') {
            return <FilePdfOutlined style={{ fontSize: '20px', color: '#ff4d4f' }} />;
        } else if (mimeType.startsWith('image/')) {
            return <FileImageOutlined style={{ fontSize: '20px', color: '#1890ff' }} />;
        } else {
            return <FileUnknownOutlined style={{ fontSize: '20px' }} />;
        }
    };

    // Document type tag
    const getDocumentTypeTag = (type) => {
        if (type === 'payment_contract') {
            return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">កិច្ចសន្យាបង់ប្រាក់</span>;
        } else if (type === 'payment_evidence') {
            return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs">ភស្តុតាងនៃការបង់ប្រាក់</span>;
        } else if (type === 'land_certificate') {
            return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-xs">វិញ្ញាបនបត្រដី</span>;
        } else {
            return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-xs">កិច្ចសន្យាផ្សេងទៀត</span>;
        }
    };

    // Table columns
    const columns = [
        {
            title: 'ឈ្មោះកិច្ចសន្យា',
            dataIndex: 'file_name',
            key: 'file_name',
            render: (text, record) => (
                <div className="flex items-center">
                    {getDocumentIcon(record.mime_type)}
                    <span className="ml-2">{text}</span>
                </div>
            ),
        },
        {
            title: 'ទំហំ',
            dataIndex: 'file_size',
            key: 'file_size',
            render: (size) => {
                const kb = size / 1024;
                if (kb < 1024) {
                    return `${kb.toFixed(2)} KB`;
                } else {
                    return `${(kb / 1024).toFixed(2)} MB`;
                }
            },
        },
        {
            title: 'ផ្ទុកនៅពេល',
            dataIndex: 'uploaded_at',
            key: 'uploaded_at',
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: 'សកម្មភាព',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="ទាញយក">
                        <Button 
                            icon={<DownloadOutlined />} 
                            size="small"
                            onClick={() => handleDownload(record.id)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="លុបកិច្ចសន្យា"
                        description="តើអ្នកចង់លុបកិច្ចសន្យានេះមែនទេ?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="យល់ព្រម"
                        cancelText="មិនយល់ព្រម"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="លុប">
                            <Button 
                                danger
                                icon={<DeleteOutlined />} 
                                size="small"
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Modal
            title={paymentStep 
                ? `កិច្ចសន្យាសម្រាប់ដំណាក់កាលបង់ប្រាក់ទី${paymentStep.step_number}` 
                : `កិច្ចសន្យាទាំងអស់`}
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="close" onClick={onCancel}>
                    បិទ
                </Button>,
            ]}
            width={800}
        >
            <Spin spinning={loading}>
                {documents.length > 0 ? (
                    <Table 
                        columns={columns} 
                        dataSource={documents} 
                        rowKey="id"
                        pagination={false}
                        size="middle"
                    />
                ) : (
                    <Empty 
                        description="មិនមានកិច្ចសន្យាទេ" 
                        image={Empty.PRESENTED_IMAGE_SIMPLE} 
                    />
                )}
            </Spin>
        </Modal>
    );
}
