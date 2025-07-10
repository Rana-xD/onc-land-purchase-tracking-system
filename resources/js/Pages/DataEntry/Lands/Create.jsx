import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, Steps, Button, message, Breadcrumb, Row, Col } from 'antd';
import { UploadOutlined, FormOutlined, CheckCircleOutlined, HomeOutlined } from '@ant-design/icons';
import FileUpload from '@/Components/FileUpload';
import LandForm from '@/Components/LandForm';
import axios from 'axios';

export default function Create() {
    const [current, setCurrent] = useState(0);
    const [fileList, setFileList] = useState([]);
    const [formData, setFormData] = useState({
        title_deed_number: '',
        location: '',
        province: '',
        district: '',
        commune: '',
        village: '',
        size: '',
        size_unit: 'sqm',
        price_per_unit: '',
        total_price: '',
    });
    const [loading, setLoading] = useState(false);

    const steps = [
        {
            title: 'បញ្ចូលឯកសារ',
            icon: <UploadOutlined />,
            content: <FileUpload 
                category="land"
                fileList={fileList} 
                onFilesChange={(files) => {
                    setFileList(files);
                }} 
                maxFiles={4}
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
                        displayImage={fileList.find(file => file.isDisplay)}
                    />
                    <div className="mt-6 text-right">
                        <Button 
                            type="primary" 
                            onClick={handleSubmit}
                            loading={loading}
                            disabled={!formData.title_deed_number || !formData.location || fileList.length === 0}
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
            const documents = fileList.map(file => ({
                tempPath: file.response?.file?.tempPath || file.tempPath,
                fileName: file.name,
                isDisplay: file.isDisplay || false
            }));
            
            // Submit data to API
            const response = await axios.post('/api/lands', {
                ...formData,
                documents
            });
            
            if (response.data.success) {
                message.success('ព័ត៌មានដីត្រូវបានរក្សាទុកដោយជោគជ័យ!');
                router.visit(route('data-entry.lands.index'));
            } else {
                message.error('មានបញ្ហាក្នុងការរក្សាទុកព័ត៌មានដី។');
            }
        } catch (error) {
            console.error('Error saving land:', error);
            message.error('មានបញ្ហាក្នុងការរក្សាទុកព័ត៌មានដី។');
        } finally {
            setLoading(false);
        }
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

Create.layout = page => <AdminLayout children={page} title="បញ្ចូលព័ត៌មានដីថ្មី" />
