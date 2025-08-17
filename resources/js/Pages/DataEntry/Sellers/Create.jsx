import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, Steps, Button, message, Breadcrumb, Row, Col, Space } from 'antd';
import { UploadOutlined, FormOutlined, CheckCircleOutlined, HomeOutlined } from '@ant-design/icons';
import FileUpload from '@/Components/FileUpload';
import SellerForm from '@/Components/SellerForm';
import axios from 'axios';

export default function Create() {
    const [current, setCurrent] = useState(0);
    const [fileList, setFileList] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        sex: 'male',
        date_of_birth: '',
        identity_number: '',
        address: '',
        phone_number: '',
    });
    const [loading, setLoading] = useState(false);
    
    // The display image is now derived directly from the fileList state.
    // Make sure to preserve all properties including base64 data
    const displayImage = fileList.find(file => file.isDisplay) || fileList[0] || null;
    
    // No debug logs needed

    const handleSubmit = async () => {
        setLoading(true);
        
        try {
            // Prepare documents data with base64
            const documents = fileList.map(file => {
                const isDisplayFile = displayImage && 
                    ((file.uid && displayImage.uid === file.uid) || 
                     (file.base64 && displayImage.base64 === file.base64));
                
                const fileName = file.name || file.fileName;
                const mimeType = file.type || 'image/jpeg'; // Default to JPEG if type is not available
                const base64Data = file.base64;
                
                return {
                    fileName: fileName,
                    isDisplay: isDisplayFile || false,
                    base64: base64Data,
                    mimeType: mimeType
                };
            });
            
            // Submit data to API
            const response = await axios.post('/api/sellers', {
                ...formData,
                documents
            });
            
            // Check for message property which indicates success
            if (response.data.message && response.data.message.includes('successfully')) {
                message.success('ព័ត៌មានអ្នកលក់ត្រូវបានរក្សាទុកដោយជោគជ័យ!');
                router.visit(route('data-entry.sellers.index'));
            } else {
                message.error('មានបញ្ហាក្នុងការរក្សាទុកព័ត៌មានអ្នកលក់។');
            }
        } catch (error) {
            message.error('មានបញ្ហាក្នុងការរក្សាទុកព័ត៌មានអ្នកលក់។');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        {
            title: 'បញ្ចូលកិច្ចសន្យា',
            icon: <UploadOutlined />,
            content: <FileUpload 
                category="seller"
                fileList={fileList} 
                onFilesChange={(files) => {
                    setFileList(files); // Update the state in the parent
                }} 
                maxFiles={2}
            />,
        },
        {
            title: 'បញ្ចូលព័ត៌មាន',
            icon: <FormOutlined />,
            content: (
                <>
                    <SellerForm formData={formData} setFormData={setFormData} displayImage={displayImage} />
                </>
            ),
        },
    ];

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    // handleSubmit function moved above its first use

    return (
        <>
            <Head title="បញ្ចូលព័ត៌មានអ្នកលក់ថ្មី" />
            
            <Breadcrumb 
                className="mb-6"
                items={[
                    {
                        href: route('dashboard'),
                        title: <HomeOutlined />
                    },
                    {
                        href: route('data-entry.index'),
                        title: 'ទិន្នន័យបញ្ចូល'
                    },
                    {
                        href: route('data-entry.sellers.index'),
                        title: 'បញ្ជីអ្នកលក់'
                    },
                    {
                        title: 'បញ្ចូលព័ត៌មានអ្នកលក់ថ្មី'
                    }
                ]}
            />
            
            <Card>
                <Steps
                    current={current}
                    items={steps.map(item => ({
                        title: item.title,
                        icon: item.icon,
                    }))}
                    className="mb-8"
                />
                
                <div className="steps-content mb-8">
                    {steps[current].content}
                </div>
                
                <div className="steps-action">
                    <Row justify="space-between">
                        <Col>
                            {current > 0 && (
                                <Button onClick={prev}>
                                    ត្រឡប់ក្រោយ
                                </Button>
                            )}
                        </Col>
                        <Col>
                            <Space>
                                {current < steps.length - 1 && (
                                    <Button 
                                        type="primary" 
                                        onClick={next}
                                        disabled={current === 0 && fileList.length < 2}
                                    >
                                        បន្ទាប់
                                    </Button>
                                )}
                                
                                {current === steps.length - 1 && (
                                    <Button 
                                        type="primary" 
                                        onClick={handleSubmit}
                                        loading={loading}
                                        disabled={!formData.name || !formData.identity_number || fileList.length < 2}
                                    >
                                        រក្សាទុក
                                    </Button>
                                )}
                            </Space>
                        </Col>
                    </Row>
                </div>
            </Card>
        </>
    );
}

Create.layout = page => <AdminLayout children={page} title="បញ្ចូលព័ត៌មានអ្នកលក់ថ្មី" />
