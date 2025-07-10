import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, Steps, Button, message, Breadcrumb, Row, Col } from 'antd';
import { UploadOutlined, FormOutlined, CheckCircleOutlined, HomeOutlined } from '@ant-design/icons';
import FileUpload from '@/Components/FileUpload';
import BuyerForm from '@/Components/BuyerForm';
import axios from 'axios';
import messageUtil from '@/utils/message';

export default function Create() {
    const [current, setCurrent] = useState(0);
    const [fileList, setFileList] = useState([]);
    const [displayImage, setDisplayImage] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        sex: 'male',
        date_of_birth: '',
        identity_number: '',
        address: '',
        phone_number: '',
    });
    const [loading, setLoading] = useState(false);
    
    // Update display image whenever fileList changes
    useEffect(() => {
        console.log('FileList updated:', fileList);
        const newDisplayImage = fileList.find(file => file.isDisplay);
        console.log('New display image:', newDisplayImage);
        if (newDisplayImage) {
            setDisplayImage(newDisplayImage);
        }
    }, [fileList]);

    const steps = [
        {
            title: 'បញ្ចូលឯកសារ',
            icon: <UploadOutlined />,
            content: <FileUpload 
                category="buyer"
                fileList={fileList} 
                onFilesChange={(files) => {
                    console.log('Files received from FileUpload:', files);
                    // Preserve all file information
                    setFileList(files);
                }} 
                maxFiles={4}
            />,
        },
        {
            title: 'បញ្ចូលព័ត៌មាន',
            icon: <FormOutlined />,
            content: <BuyerForm 
                formData={formData} 
                setFormData={setFormData} 
                displayImage={displayImage}
            />,
        },
        {
            title: 'បញ្ជាក់',
            icon: <CheckCircleOutlined />,
            content: (
                <div className="confirmation-content">
                    <p>សូមពិនិត្យមើលព័ត៌មានអ្នកទិញមុនពេលរក្សាទុក។</p>
                    <p>ចំនួនឯកសារបានបញ្ចូល៖ {fileList.length}</p>
                    {fileList.find(file => file.isDisplay) && (
                        <p>រូបភាពបង្ហាញ៖ {fileList.find(file => file.isDisplay).fileName || fileList.find(file => file.isDisplay).name}</p>
                    )}
                </div>
            ),
        },
    ];

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        
        try {
            // Prepare documents data
            const documents = fileList.map(file => ({
                tempPath: file.response?.file?.tempPath || file.tempPath,
                fileName: file.name,
                isDisplay: file.isDisplay || false
            }));
            
            // Submit data to API
            const response = await axios.post('/api/buyers', {
                ...formData,
                documents
            });
            
            if (response.data.success) {
                message.success('ព័ត៌មានអ្នកទិញត្រូវបានរក្សាទុកដោយជោគជ័យ!');
                router.visit(route('data-entry.buyers.index'));
            } else {
                message.error('មានបញ្ហាក្នុងការរក្សាទុកព័ត៌មានអ្នកទិញ។');
            }
        } catch (error) {
            console.error('Error saving buyer:', error);
            message.error('មានបញ្ហាក្នុងការរក្សាទុកព័ត៌មានអ្នកទិញ។');
        } finally {
            setLoading(false);
        }
    };

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
                                >
                                    រក្សាទុក
                                </Button>
                            )}
                        </Col>
                    </Row>
                </div>
            </Card>
        </>
    );
}

Create.layout = page => <AdminLayout children={page} title="បញ្ចូលព័ត៌មានអ្នកទិញថ្មី" />
