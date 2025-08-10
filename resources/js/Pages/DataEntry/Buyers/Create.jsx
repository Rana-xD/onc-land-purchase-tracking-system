import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, Steps, Button, message, Breadcrumb, Row, Col, Space } from 'antd';
import { UploadOutlined, FormOutlined, CheckCircleOutlined, HomeOutlined } from '@ant-design/icons';
import FileUpload from '@/Components/FileUpload';
import BuyerForm from '@/Components/BuyerForm';
import axios from 'axios';
import messageUtil from '@/utils/message';

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
    
    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        
        try {
            // Prepare documents data with base64
            const documents = fileList.map(file => {
                // Get base64 data from file
                const base64Data = file.base64 || file.response?.file?.base64;
                const fileName = file.name || file.fileName;
                const mimeType = file.type || 'image/jpeg'; // Default to JPEG if type is not available
                
                // Ensure base64Data exists
                
                return {
                    base64: base64Data,
                    fileName: fileName,
                    mimeType: mimeType,
                    isDisplay: file.isDisplay || false
                };
            });
            




            
            // Submit data to API
            const response = await axios.post('/api/buyers', {
                ...formData,
                documents
            });
            

            
            // Check for success message or status
            if (response.data.success || (response.data.buyer && response.data.buyer.id)) {
                message.success('ព័ត៌មានអ្នកទិញត្រូវបានរក្សាទុកដោយជោគជ័យ!');
                router.visit(route('data-entry.buyers.index'));
            } else {
                message.error('មានបញ្ហាក្នុងការរក្សាទុកព័ត៌មានអ្នកទិញ។');
            }
        } catch (error) {
            message.error('មានបញ្ហាក្នុងការរក្សាទុកព័ត៌មានអ្នកទិញ។');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        {
            title: 'បញ្ចូលកិច្ចសន្យា',
            icon: <UploadOutlined />,
            content: <FileUpload 
                category="buyer"
                fileList={fileList} // Pass fileList as a prop
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
                    <BuyerForm 
                        formData={formData} 
                        setFormData={setFormData} 
                        displayImage={displayImage}
                    />
                </>
            ),
        },
    ];

    

    return (
        <>
            <Head title="បញ្ចូលព័ត៌មានអ្នកទិញថ្មី" />
            
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
                        href: route('data-entry.buyers.index'),
                        title: 'បញ្ជីអ្នកទិញ'
                    },
                    {
                        title: 'បញ្ចូលព័ត៌មានអ្នកទិញថ្មី'
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
                                        disabled={!formData.name || !formData.identity_number || fileList.length === 0}
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

Create.layout = page => <AdminLayout children={page} title="បញ្ចូលព័ត៌មានអ្នកទិញថ្មី" />
