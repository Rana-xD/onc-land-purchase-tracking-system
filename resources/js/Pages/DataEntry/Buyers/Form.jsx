import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Form, Input, Button, Card, Row, Col, DatePicker, 
    Select, Typography, Breadcrumb, message, Steps, Divider 
} from 'antd';
import { 
    SaveOutlined, ArrowLeftOutlined, 
    FileOutlined, UserOutlined, CheckOutlined 
} from '@ant-design/icons';
import FileUpload from '@/Components/FileUpload';
import axios from 'axios';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Step } = Steps;

export default function BuyerForm({ buyer, documents }) {
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const isEditing = !!buyer;
    
    useEffect(() => {
        if (buyer) {
            form.setFieldsValue({
                ...buyer,
                date_of_birth: buyer.date_of_birth ? dayjs(buyer.date_of_birth) : null,
            });
            
            if (documents) {
                setFiles(documents);
            }
        }
    }, [buyer, documents]);

    const handleFilesChange = (newFiles) => {
        setFiles(newFiles);
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        
        try {
            const formData = {
                ...values,
                date_of_birth: values.date_of_birth ? values.date_of_birth.format('YYYY-MM-DD') : null,
                documents: files
            };
            
            let response;
            
            if (isEditing) {
                response = await axios.put(`/api/buyers/${buyer.id}`, formData);
                message.success('ព័ត៌មានអ្នកទិញត្រូវបានកែប្រែដោយជោគជ័យ');
            } else {
                response = await axios.post('/api/buyers', formData);
                message.success('ព័ត៌មានអ្នកទិញត្រូវបានបង្កើតដោយជោគជ័យ');
            }
            
            router.visit(route('data-entry.buyers.index'));
        } catch (error) {
            console.error('Error saving buyer:', error);
            
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
                message.error('មានបញ្ហាក្នុងការរក្សាទុកព័ត៌មានអ្នកទិញ');
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

    const steps = [
        {
            title: 'កិច្ចសន្យា',
            icon: <FileOutlined />,
            content: (
                <div className="document-step">
                    <FileUpload
                        category="buyer"
                        referenceId={buyer?.id}
                        initialFiles={documents || []}
                        onFilesChange={handleFilesChange}
                        maxFiles={4}
                    />
                    
                    <div className="mt-6">
                        <Text type="danger" className="khmer-text">
                            * សូមផ្ទុកឡើងយ៉ាងហោចណាស់កិច្ចសន្យាមួយ និងកំណត់កិច្ចសន្យាមួយជាកិច្ចសន្យាបង្ហាញ
                        </Text>
                    </div>
                </div>
            )
        },
        {
            title: 'ព័ត៌មានអ្នកទិញ',
            icon: <UserOutlined />,
            content: (
                <div className="buyer-info-step">
                    <Form.Item
                        label="ឈ្មោះ"
                        name="name"
                        rules={[{ required: true, message: 'សូមបញ្ចូលឈ្មោះ' }]}
                    >
                        <Input placeholder="បញ្ចូលឈ្មោះ" />
                    </Form.Item>
                    
                    <Form.Item
                        label="ភេទ"
                        name="sex"
                        rules={[{ required: true, message: 'សូមជ្រើសរើសភេទ' }]}
                    >
                        <Select placeholder="ជ្រើសរើសភេទ">
                            <Select.Option value="male">ប្រុស</Select.Option>
                            <Select.Option value="female">ស្រី</Select.Option>
                        </Select>
                    </Form.Item>
                    
                    <Form.Item
                        label="ថ្ងៃខែឆ្នាំកំណើត"
                        name="date_of_birth"
                        rules={[{ required: true, message: 'សូមជ្រើសរើសថ្ងៃខែឆ្នាំកំណើត' }]}
                    >
                        <DatePicker 
                            style={{ width: '100%' }} 
                            format="YYYY-MM-DD" 
                            placeholder="ជ្រើសរើសថ្ងៃខែឆ្នាំកំណើត"
                        />
                    </Form.Item>
                    
                    <Form.Item
                        label="លេខអត្តសញ្ញាណប័ណ្ណ"
                        name="identity_number"
                        rules={[{ required: true, message: 'សូមបញ្ចូលលេខអត្តសញ្ញាណប័ណ្ណ' }]}
                    >
                        <Input placeholder="បញ្ចូលលេខអត្តសញ្ញាណប័ណ្ណ" />
                    </Form.Item>
                    
                    <Form.Item
                        label="អាសយដ្ឋាន"
                        name="address"
                        rules={[{ required: true, message: 'សូមបញ្ចូលអាសយដ្ឋាន' }]}
                    >
                        <Input.TextArea rows={4} placeholder="បញ្ចូលអាសយដ្ឋាន" />
                    </Form.Item>
                    
                    <Form.Item
                        label="លេខទូរស័ព្ទ"
                        name="phone_number"
                        rules={[{ required: true, message: 'សូមបញ្ចូលលេខទូរស័ព្ទ' }]}
                    >
                        <Input placeholder="បញ្ចូលលេខទូរស័ព្ទ" />
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
                        <Title level={5} className="khmer-heading mb-4">ព័ត៌មានអ្នកទិញ</Title>
                        
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Text strong className="khmer-text">ឈ្មោះ:</Text>
                                <div>{form.getFieldValue('name')}</div>
                            </Col>
                            <Col span={12}>
                                <Text strong className="khmer-text">ភេទ:</Text>
                                <div>{form.getFieldValue('sex') === 'male' ? 'ប្រុស' : 'ស្រី'}</div>
                            </Col>
                            <Col span={12}>
                                <Text strong className="khmer-text">ថ្ងៃខែឆ្នាំកំណើត:</Text>
                                <div>{form.getFieldValue('date_of_birth')?.format('YYYY-MM-DD')}</div>
                            </Col>
                            <Col span={12}>
                                <Text strong className="khmer-text">លេខអត្តសញ្ញាណប័ណ្ណ:</Text>
                                <div>{form.getFieldValue('identity_number')}</div>
                            </Col>
                            <Col span={24}>
                                <Text strong className="khmer-text">អាសយដ្ឋាន:</Text>
                                <div>{form.getFieldValue('address')}</div>
                            </Col>
                            <Col span={12}>
                                <Text strong className="khmer-text">លេខទូរស័ព្ទ:</Text>
                                <div>{form.getFieldValue('phone_number')}</div>
                            </Col>
                        </Row>
                    </Card>
                    
                    <Card>
                        <Title level={5} className="khmer-heading mb-4">កិច្ចសន្យា</Title>
                        
                        <Text className="khmer-text mb-2 block">
                            ចំនួនកិច្ចសន្យា: {files.length}
                        </Text>
                        
                        {files.length === 0 && (
                            <Text type="danger" className="khmer-text">
                                មិនមានកិច្ចសន្យាត្រូវបានផ្ទុកឡើងទេ
                            </Text>
                        )}
                    </Card>
                </div>
            )
        }
    ];

    return (
        <>
            <Head title={isEditing ? 'កែប្រែព័ត៌មានអ្នកទិញ' : 'បង្កើតព័ត៌មានអ្នកទិញថ្មី'} />
            
            <div className="buyer-form">
                <Breadcrumb
                    items={[
                        { title: <Link href={route('data-entry.index')}>ជ្រើសរើសប្រភេទទិន្នន័យ</Link> },
                        { title: <Link href={route('data-entry.buyers.index')}>បញ្ជីអ្នកទិញ</Link> },
                        { title: isEditing ? 'កែប្រែព័ត៌មានអ្នកទិញ' : 'បង្កើតព័ត៌មានអ្នកទិញថ្មី' },
                    ]}
                    className="mb-6"
                />
                
                <Card>
                    <Title level={4} className="khmer-heading mb-6">
                        {isEditing ? 'កែប្រែព័ត៌មានអ្នកទិញ' : 'បង្កើតព័ត៌មានអ្នកទិញថ្មី'}
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

BuyerForm.layout = page => <AdminLayout title={page.props.buyer ? 'កែប្រែព័ត៌មានអ្នកទិញ' : 'បង្កើតព័ត៌មានអ្នកទិញថ្មី'} children={page} />
