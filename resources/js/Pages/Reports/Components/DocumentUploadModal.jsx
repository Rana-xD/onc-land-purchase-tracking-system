import React, { useState } from 'react';
import { Modal, Upload, Button, Form, message, Spin } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Dragger } = Upload;

export default function DocumentUploadModal({ visible, onCancel, saleContract, onSuccess }) {
    // Component now expects saleContract instead of paymentStep
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
    
    // Debug: Log the saleContract prop when it changes
    React.useEffect(() => {
        console.log('DocumentUploadModal - saleContract prop:', saleContract);
    }, [saleContract]);

    // Reset form when modal becomes visible or sale contract changes
    React.useEffect(() => {
        if (visible) {
            form.resetFields();
            setFileList([]);
        }
    }, [visible, saleContract, form]);

    // Function to convert file to base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    // Handle file upload
    const handleUpload = async () => {
        try {
            // Check if we have a valid sale contract first
            if (!saleContract || !saleContract.contract_id) {
                message.error('ត្រូវការកិច្ចសន្យាលក់ទិញដើម្បីផ្ទុកឯកសារ');
                return;
            }
            
            if (fileList.length === 0) {
                message.error('សូមជ្រើសរើសឯកសារមួយដើម្បីផ្ទុក');
                return;
            }

            setUploading(true);
            
            // Make sure we're accessing the file object correctly
            const fileObj = fileList[0];
            const file = fileObj.originFileObj || fileObj;
            
            // Log file information for debugging
            console.log('File object:', file);
            console.log('File type:', file.type);
            console.log('File size:', file.size);
            
            // Convert file to base64
            const base64File = await fileToBase64(file);
            console.log('File converted to base64');
            
            // Upload to contract documents endpoint
            const endpoint = `/api/reports/contract-documents/${saleContract.contract_id}/upload`;
            
            // Send the base64 file as JSON
            await axios.post(endpoint, {
                file: base64File,
                file_name: file.name,
                file_type: file.type,
                file_size: file.size
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
            });
            
            message.success('ផ្ទុកឯកសារជោគជ័យ');
            onSuccess();
        } catch (error) {
            console.error('បញ្ហាក្នុងការផ្ទុកឯកសារ:', error);
            
            // Handle validation errors from the backend
            const errorData = error.response?.data?.error;
            
            if (typeof errorData === 'string') {
                // Simple string error
                message.error(errorData);
            } else if (errorData && typeof errorData === 'object') {
                // Format validation errors from the backend
                // This handles the case where errorData is like: {file: [...], document_type: [...]}
                const errorMessages = [];
                
                // Extract all error messages from the nested structure
                Object.keys(errorData).forEach(field => {
                    const fieldErrors = errorData[field];
                    if (Array.isArray(fieldErrors)) {
                        // Join multiple errors for the same field
                        errorMessages.push(`${field}: ${fieldErrors.join(', ')}`);
                    } else if (typeof fieldErrors === 'string') {
                        errorMessages.push(`${field}: ${fieldErrors}`);
                    }
                });
                
                if (errorMessages.length > 0) {
                    // Display all validation errors
                    message.error(errorMessages.join('\n'));
                } else {
                    // Fallback if we couldn't extract meaningful messages
                    message.error('មិនអាចផ្ទុកឯកសារបាន');
                }
            } else {
                // Generic error message
                message.error('មិនអាចផ្ទុកឯកសារបាន');
            }
        } finally {
            setUploading(false);
        }
    };

    // File upload props
    const uploadProps = {
        onRemove: (file) => {
            setFileList([]);
        },
        beforeUpload: (file) => {
            // Check file type
            const isValidType = file.type === 'application/pdf' || 
                               file.type === 'image/jpeg' || 
                               file.type === 'image/png';
            
            if (!isValidType) {
                message.error('អ្នកអាចផ្ទុកបានតែឯកសារប្រភេទ PDF, JPG, រឹ PNG ប៉ុណ្ណោះ!');
                return Upload.LIST_IGNORE;
            }
            
            // Check file size (max 10MB)
            const isLessThan10MB = file.size / 1024 / 1024 < 10;
            if (!isLessThan10MB) {
                message.error('ឯកសារត្រូវតែមានទំហំតូចជាង 10MB!');
                return Upload.LIST_IGNORE;
            }
            
            setFileList([file]);
            return false; // Prevent auto upload
        },
        fileList,
    };

    return (
        <Modal
            title={saleContract 
                ? `ផ្ទុកឯកសារសម្រាប់កិច្ចសន្យាលក់ទិញ ${saleContract.title || ''}` 
                : `ផ្ទុកឯកសារទូទៅ`}
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    បោះបង់
                </Button>,
                <Button
                    key="upload"
                    type="primary"
                    onClick={handleUpload}
                    loading={uploading}
                    disabled={fileList.length === 0}
                >
                    ផ្ទុកឯកសារ
                </Button>,
            ]}
        >
            <Spin spinning={uploading}>
                <Form form={form} layout="vertical">
                    
                    <Form.Item label="ឯកសារ">
                        <Dragger {...uploadProps}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">ចុចហើយអូសឯកសារទៅកាន់តំបន់នេះដើម្បីផ្ទុក</p>
                            <p className="ant-upload-hint">
                                គាំទ្រប្រភេទ PDF, JPG, PNG។ ទំហំអតិបរមា: 10MB
                            </p>
                        </Dragger>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
}
