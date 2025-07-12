import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, Steps, Button, message, Breadcrumb, Row, Col, Space } from 'antd';
import { UploadOutlined, FormOutlined, CheckCircleOutlined, HomeOutlined } from '@ant-design/icons';
import FileUpload from '@/Components/FileUpload';
import LandForm from '@/Components/LandForm';
import axios from 'axios';

export default function Create() {
    const [current, setCurrent] = useState(0);
    const [fileList, setFileList] = useState([]);
    const [formData, setFormData] = useState({
        plot_number: '',
        location: '',
        date_of_registration: '',
        size: '',
    });
    const [loading, setLoading] = useState(false);
    
    // The display image is now derived directly from the fileList state
    const displayImage = fileList.find(file => file.isDisplay) || fileList[0] || null;
    
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
            const response = await axios.post('/api/lands', {
                ...formData,
                documents
            });
            
            // Check for message property which indicates success
            if (response.data.message && response.data.message.includes('successfully')) {
                message.success('ព័ត៌មានដីត្រូវបានរក្សាទុកដោយជោគជ័យ!');
                
                // Add a small delay before redirecting to ensure the success message is seen
                setTimeout(() => {
                    router.visit(route('data-entry.lands.index'));
                }, 1500);
            } else {
                message.error('មានបញ្ហាក្នុងការរក្សាទុកព័ត៌មានដី។');
            }
        } catch (error) {
            // Show more detailed error message if available
            if (error.response && error.response.data) {
                if (error.response.data.error) {
                    message.error(`មានបញ្ហា: ${error.response.data.error}`);
                } else if (error.response.data.errors) {
                    // Handle validation errors
                    const errorMessages = Object.values(error.response.data.errors).flat();
                    errorMessages.forEach(errorMsg => {
                        message.error(errorMsg);
                    });
                } else {
                    message.error(`មានបញ្ហាក្នុងការរក្សាទុកព័ត៌មានដី។ កូដ: ${error.response.status}`);
                }
            } else {
                message.error('មានបញ្ហាក្នុងការរក្សាទុកព័ត៌មានដី។');
            }
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        {
            title: 'បញ្ចូលឯកសារ',
            icon: <UploadOutlined />,
            content: <FileUpload 
                category="land"
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
                    <LandForm 
                        formData={formData} 
                        setFormData={setFormData} 
                        displayImage={displayImage}
                    />
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

    return (
        <>
            <Head title="បញ្ចូលព័ត៌មានដីថ្មី" />
            
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
                        href: route('data-entry.lands.index'),
                        title: 'បញ្ជីដី'
                    },
                    {
                        title: 'បញ្ចូលព័ត៌មានដីថ្មី'
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
                                    <Button type="primary" onClick={next}>
                                        បន្ទាប់
                                    </Button>
                                )}
                                
                                {current === steps.length - 1 && (
                                    <Button 
                                        type="primary" 
                                        onClick={handleSubmit}
                                        loading={loading}
                                        disabled={!formData.plot_number || !formData.location || !formData.date_of_registration || !formData.size || fileList.length === 0}
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

Create.layout = page => <AdminLayout children={page} title="បញ្ចូលព័ត៌មានដីថ្មី" />
