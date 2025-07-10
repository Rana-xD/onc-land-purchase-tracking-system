import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Form, Input, Button, Card, Row, Col, DatePicker, 
    InputNumber, Typography, Breadcrumb, message, Steps, Divider 
} from 'antd';
import { 
    SaveOutlined, ArrowLeftOutlined, 
    FileOutlined, EnvironmentOutlined, CheckOutlined 
} from '@ant-design/icons';
import FileUpload from '@/Components/FileUpload';
import axios from 'axios';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Step } = Steps;

export default function LandForm({ land, documents }) {
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const isEditing = !!land;
    
    useEffect(() => {
        if (land) {
            form.setFieldsValue({
                ...land,
                date_of_registration: land.date_of_registration ? dayjs(land.date_of_registration) : null,
            });
            
            if (documents) {
                setFiles(documents);
            }
        }
    }, [land, documents]);

    const handleFilesChange = (newFiles) => {
        setFiles(newFiles);
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        
        try {
            const formData = {
                ...values,
                date_of_registration: values.date_of_registration ? values.date_of_registration.format('YYYY-MM-DD') : null,
                documents: files
            };
            
            let response;
            
            if (isEditing) {
                response = await axios.put(`/api/lands/${land.id}`, formData);
                message.success('ព័ត៌មានដីត្រូវបានកែប្រែដោយជោគជ័យ');
            } else {
                response = await axios.post('/api/lands', formData);
                message.success('ព័ត៌មានដីត្រូវបានបង្កើតដោយជោគជ័យ');
            }
            
            router.visit(route('data-entry.lands.index'));
        } catch (error) {
            console.error('Error saving land:', error);
            
            if (error.response && error.response.data && error.response.data.errors) {
                // Set form errors
                const serverErrors = error.response.data.errors;
                const formErrors = {};
                
                Object.keys(serverErrors).forEach(field => {
                    formErrors[field] = {
                        name: field,
                        errors: [serverErrors[field][0]]
                    };
                });
                
                form.setFields(Object.values(formErrors));
            } else {
                message.error('មានបញ្ហាក្នុងការរក្សាទុកព័ត៌មានដី');
            }
        } finally {
            setLoading(false);
        }
    };

    const next = () => {
        form.validateFields().then(() => {
            setCurrentStep(currentStep + 1);
        }).catch(error => {
            console.log('Validation failed:', error);
        });
    };

    const prev = () => {
        setCurrentStep(currentStep - 1);
    };

    const formatSize = (size) => {
        return `${Number(size).toLocaleString('en-US', { maximumFractionDigits: 2 })} ម²`;
    };

    const steps = [
        {
            title: 'ឯកសារ',
            icon: <FileOutlined />,
            content: (
                <div className="document-step">
                    <FileUpload
                        category="land"
                        referenceId={land?.id}
                        initialFiles={documents || []}
                        onFilesChange={handleFilesChange}
                        maxFiles={4}
                    />
                    
                    <div className="mt-6">
                        <Text type="danger" className="khmer-text">
                            * សូមផ្ទុកឡើងយ៉ាងហោចណាស់ឯកសារមួយ និងកំណត់ឯកសារមួយជាឯកសារបង្ហាញ
                        </Text>
                    </div>
                </div>
            )
        },
        {
            title: 'ព័ត៌មានដី',
            icon: <EnvironmentOutlined />,
            content: (
                <div className="land-info-step">
                    <Form.Item
                        label="លេខក្បាលដី"
                        name="plot_number"
                        rules={[{ required: true, message: 'សូមបញ្ចូលលេខក្បាលដី' }]}
                    >
                        <Input placeholder="បញ្ចូលលេខក្បាលដី" />
                    </Form.Item>
                    
                    <Form.Item
                        label="ទំហំ (ម²)"
                        name="size"
                        rules={[{ required: true, message: 'សូមបញ្ចូលទំហំដី' }]}
                    >
                        <InputNumber 
                            style={{ width: '100%' }} 
                            placeholder="បញ្ចូលទំហំដី" 
                            min={0}
                            step={0.01}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>
                    
                    <Form.Item
                        label="ទីតាំង"
                        name="location"
                        rules={[{ required: true, message: 'សូមបញ្ចូលទីតាំងដី' }]}
                    >
                        <Input.TextArea rows={4} placeholder="បញ្ចូលទីតាំងដី" />
                    </Form.Item>
                    
                    <Form.Item
                        label="កាលបរិច្ឆេទចុះបញ្ជី"
                        name="date_of_registration"
                        rules={[{ required: true, message: 'សូមជ្រើសរើសកាលបរិច្ឆេទចុះបញ្ជី' }]}
                    >
                        <DatePicker 
                            style={{ width: '100%' }} 
                            format="YYYY-MM-DD" 
                            placeholder="ជ្រើសរើសកាលបរិច្ឆេទចុះបញ្ជី"
                        />
                    </Form.Item>
                    
                    <Form.Item
                        label="កំណត់សម្គាល់"
                        name="notes"
                    >
                        <Input.TextArea rows={4} placeholder="បញ្ចូលកំណត់សម្គាល់" />
                    </Form.Item>
                </div>
            )
        },
        {
            title: 'បញ្ចប់',
            icon: <CheckOutlined />,
            content: (
                <div className="confirmation-step">
                    <Title level={4} className="khmer-heading mb-4">បញ្ជាក់ព័ត៌មាន</Title>
                    
                    <Text className="khmer-text mb-6 block">
                        សូមពិនិត្យមើលព័ត៌មានដែលបានបញ្ចូលម្តងទៀត មុនពេលរក្សាទុក។
                    </Text>
                    
                    <Card className="mb-4">
                        <Title level={5} className="khmer-heading mb-4">ព័ត៌មានដី</Title>
                        
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Text strong className="khmer-text">លេខក្បាលដី:</Text>
                                <div>{form.getFieldValue('plot_number')}</div>
                            </Col>
                            <Col span={12}>
                                <Text strong className="khmer-text">ទំហំ:</Text>
                                <div>{form.getFieldValue('size') ? formatSize(form.getFieldValue('size')) : ''}</div>
                            </Col>
                            <Col span={24}>
                                <Text strong className="khmer-text">ទីតាំង:</Text>
                                <div>{form.getFieldValue('location')}</div>
                            </Col>
                            <Col span={12}>
                                <Text strong className="khmer-text">កាលបរិច្ឆេទចុះបញ្ជី:</Text>
                                <div>{form.getFieldValue('date_of_registration')?.format('YYYY-MM-DD')}</div>
                            </Col>
                            <Col span={24}>
                                <Text strong className="khmer-text">កំណត់សម្គាល់:</Text>
                                <div>{form.getFieldValue('notes') || 'គ្មាន'}</div>
                            </Col>
                        </Row>
                    </Card>
                    
                    <Card>
                        <Title level={5} className="khmer-heading mb-4">ឯកសារ</Title>
                        
                        <Text className="khmer-text mb-2 block">
                            ចំនួនឯកសារ: {files.length}
                        </Text>
                        
                        {files.length === 0 && (
                            <Text type="danger" className="khmer-text">
                                មិនមានឯកសារត្រូវបានផ្ទុកឡើងទេ
                            </Text>
                        )}
                    </Card>
                </div>
            )
        }
    ];

    return (
        <>
            <Head title={isEditing ? 'កែប្រែព័ត៌មានដី' : 'បង្កើតព័ត៌មានដីថ្មី'} />
            
            <div className="land-form">
                <Breadcrumb
                    items={[
                        { title: <Link href={route('data-entry.index')}>ជ្រើសរើសប្រភេទទិន្នន័យ</Link> },
                        { title: <Link href={route('data-entry.lands.index')}>បញ្ជីដី</Link> },
                        { title: isEditing ? 'កែប្រែព័ត៌មានដី' : 'បង្កើតព័ត៌មានដីថ្មី' },
                    ]}
                    className="mb-6"
                />
                
                <Card>
                    <Title level={4} className="khmer-heading mb-6">
                        {isEditing ? 'កែប្រែព័ត៌មានដី' : 'បង្កើតព័ត៌មានដីថ្មី'}
                    </Title>
                    
                    <Steps
                        current={currentStep}
                        items={steps.map(item => ({
                            title: item.title,
                            icon: item.icon,
                        }))}
                        className="mb-8"
                    />
                    
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        className="mt-6"
                    >
                        <div className="steps-content">
                            {steps[currentStep].content}
                        </div>
                        
                        <Divider />
                        
                        <div className="steps-action">
                            <Row justify="space-between">
                                <Col>
                                    {currentStep > 0 && (
                                        <Button 
                                            icon={<ArrowLeftOutlined />} 
                                            onClick={prev}
                                        >
                                            ត្រឡប់ក្រោយ
                                        </Button>
                                    )}
                                </Col>
                                <Col>
                                    {currentStep < steps.length - 1 && (
                                        <Button type="primary" onClick={next}>
                                            បន្ទាប់
                                        </Button>
                                    )}
                                    {currentStep === steps.length - 1 && (
                                        <Button 
                                            type="primary" 
                                            icon={<SaveOutlined />} 
                                            loading={loading}
                                            onClick={() => form.submit()}
                                        >
                                            រក្សាទុក
                                        </Button>
                                    )}
                                </Col>
                            </Row>
                        </div>
                    </Form>
                </Card>
            </div>
        </>
    );
}

LandForm.layout = page => <AdminLayout title={page.props.land ? 'កែប្រែព័ត៌មានដី' : 'បង្កើតព័ត៌មានដីថ្មី'} children={page} />
