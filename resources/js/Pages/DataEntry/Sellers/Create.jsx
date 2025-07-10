import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, Steps, Button, message, Breadcrumb, Row, Col } from 'antd';
import { UploadOutlined, FormOutlined, CheckCircleOutlined, HomeOutlined } from '@ant-design/icons';
import FileUpload from '@/Components/FileUpload';
import SellerForm from '@/Components/SellerForm';
import axios from 'axios';

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

    const steps = [
        {
            title: 'បញ្ចូលឯកសារ',
            icon: <UploadOutlined />,
            content: <FileUpload 
                fileList={fileList} 
                setFileList={setFileList} 
                allowDisplaySelection={true}
                onDisplayImageChange={(file) => setDisplayImage(file)}
            />,
        },
        {
            title: 'បញ្ចូលព័ត៌មាន',
            icon: <FormOutlined />,
            content: (
                <>
                    <SellerForm formData={formData} setFormData={setFormData} displayImage={displayImage} />
                    <div className="mt-6 text-right">
                        <Button 
                            type="primary" 
                            onClick={handleSubmit}
                            loading={loading}
                            disabled={!formData.name || !formData.identity_number || fileList.length === 0}
                        >
                            រក្សាទុក
                        </Button>
                    </div>
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

    const handleSubmit = async () => {
        setLoading(true);
        
        try {
            // Prepare documents data
            const documents = fileList.map(file => {
                const isDisplayFile = displayImage && 
                    ((file.uid && displayImage.uid === file.uid) || 
                     (file.tempPath && displayImage.tempPath === file.tempPath));
                     
                return {
                    tempPath: file.response?.file?.tempPath || file.tempPath,
                    fileName: file.name,
                    isDisplay: isDisplayFile || false
                };
            });
            
            // Submit data to API
            const response = await axios.post('/api/sellers', {
                ...formData,
                documents
            });
            
            if (response.data.success) {
                message.success('ព័ត៌មានអ្នកលក់ត្រូវបានរក្សាទុកដោយជោគជ័យ!');
                router.visit(route('data-entry.sellers.index'));
            } else {
                message.error('មានបញ្ហាក្នុងការរក្សាទុកព័ត៌មានអ្នកលក់។');
            }
        } catch (error) {
            console.error('Error saving seller:', error);
            message.error('មានបញ្ហាក្នុងការរក្សាទុកព័ត៌មានអ្នកលក់។');
        } finally {
            setLoading(false);
        }
    };

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
                            {current < steps.length - 1 && (
                                <Button type="primary" onClick={next}>
                                    បន្ទាប់
                                </Button>
                            )}

                        </Col>
                    </Row>
                </div>
            </Card>
        </>
    );
}

Create.layout = page => <AdminLayout children={page} title="បញ្ចូលព័ត៌មានអ្នកលក់ថ្មី" />
