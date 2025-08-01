import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Form, Input, Button, Steps, Card, Row, Col, 
    Typography, DatePicker, Radio, message, Breadcrumb, 
    Space
} from 'antd';
import { 
    SaveOutlined, ArrowLeftOutlined, ArrowRightOutlined, 
    CheckCircleOutlined, FileAddOutlined, UserOutlined
} from '@ant-design/icons';
import FileUpload from '@/Components/FileUpload';
import dayjs from 'dayjs';
import axios from 'axios';

const { Title, Text } = Typography;
const { Step } = Steps;

export default function SellerEdit({ seller, documents }) {
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        name: seller.name,
        sex: seller.sex,
        date_of_birth: seller.date_of_birth,
        identity_number: seller.identity_number,
        address: seller.address,
        phone_number: seller.phone_number
    });

    // Initialize fileList from existing documents
    useEffect(() => {
        if (documents && documents.length > 0) {
            const files = documents.map(doc => ({
                uid: doc.id,
                name: doc.file_name,
                status: 'done',
                url: `/storage/${doc.file_path}`,
                isExisting: true,
                id: doc.id,
                isDisplay: doc.is_display
            }));
            setFileList(files);
        }
    }, [documents]);

    const steps = [
        {
            title: 'ឯកសារ',
            icon: <FileAddOutlined />,
            content: (
                <Card title="បញ្ចូលឯកសារ" className="mb-6">
                    <FileUpload
                        fileList={fileList}
                        setFileList={setFileList}
                        maxFiles={2}
                    />
                </Card>
            ),
        },
        {
            title: 'ព័ត៌មានអ្នកលក់',
            icon: <UserOutlined />,
            content: (
                <Card title="បញ្ចូលព័ត៌មានអ្នកលក់" className="mb-6">
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={{
                            name: seller.name,
                            sex: seller.sex,
                            date_of_birth: seller.date_of_birth ? dayjs(seller.date_of_birth) : null,
                            identity_number: seller.identity_number,
                            address: seller.address,
                            phone_number: seller.phone_number
                        }}
                        onValuesChange={(changedValues, allValues) => {
                            setFormValues({...formValues, ...changedValues});
                        }}
                    >
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="ឈ្មោះ"
                                    name="name"
                                    rules={[{ required: true, message: 'សូមបញ្ចូលឈ្មោះ' }]}
                                >
                                    <Input placeholder="បញ្ចូលឈ្មោះ" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="ភេទ"
                                    name="sex"
                                    rules={[{ required: true, message: 'សូមជ្រើសរើសភេទ' }]}
                                >
                                    <Radio.Group>
                                        <Radio value="male">ប្រុស</Radio>
                                        <Radio value="female">ស្រី</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="ថ្ងៃខែឆ្នាំកំណើត"
                                    name="date_of_birth"
                                >
                                    <DatePicker 
                                        style={{ width: '100%' }}
                                        format="YYYY-MM-DD"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="លេខអត្តសញ្ញាណប័ណ្ណ"
                                    name="identity_number"
                                >
                                    <Input placeholder="បញ្ចូលលេខអត្តសញ្ញាណប័ណ្ណ" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="អាសយដ្ឋាន"
                                    name="address"
                                >
                                    <Input.TextArea 
                                        rows={4}
                                        placeholder="បញ្ចូលអាសយដ្ឋាន"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="លេខទូរស័ព្ទ"
                                    name="phone_number"
                                >
                                    <Input placeholder="បញ្ចូលលេខទូរស័ព្ទ" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            ),
        },
    ];

    const next = async () => {
        if (currentStep === 0) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prev = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            
            // Prepare form data
            const formData = {
                ...formValues,
                date_of_birth: formValues.date_of_birth instanceof dayjs 
                    ? formValues.date_of_birth.format('YYYY-MM-DD') 
                    : formValues.date_of_birth,
                documents: fileList.map(file => ({
                    id: file.id,
                    isExisting: file.isExisting || false,
                    tempPath: file.tempPath,
                    fileName: file.name,
                    isDisplay: file.isDisplay || false
                }))
            };
            
            // Submit data
            await axios.put(`/api/sellers/${seller.id}`, formData);
            
            message.success('អ្នកលក់ត្រូវបានកែប្រែដោយជោគជ័យ');
            router.visit(route('data-entry.sellers.index'));
        } catch (error) {
            console.error('Error updating seller:', error);
            message.error('មានបញ្ហាក្នុងការកែប្រែអ្នកលក់');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="កែប្រែអ្នកលក់" />
            
            <div className="seller-edit">
                <Breadcrumb
                    items={[
                        { title: <Link href={route('data-entry.index')}>ជ្រើសរើសប្រភេទទិន្នន័យ</Link> },
                        { title: <Link href={route('data-entry.sellers.index')}>បញ្ជីអ្នកលក់</Link> },
                        { title: 'កែប្រែអ្នកលក់' },
                    ]}
                    className="mb-6"
                />
                
                <Card>
                    <Title level={4} className="khmer-heading mb-6">កែប្រែអ្នកលក់</Title>
                    
                    <Steps current={currentStep} className="mb-8">
                        {steps.map(item => (
                            <Step key={item.title} title={item.title} icon={item.icon} />
                        ))}
                    </Steps>
                    
                    <div className="steps-content mb-6">
                        {steps[currentStep].content}
                    </div>
                    
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
                                <Space>
                                    <Button 
                                        onClick={() => router.visit(route('data-entry.sellers.index'))}
                                    >
                                        បោះបង់
                                    </Button>
                                    
                                    {currentStep < steps.length - 1 && (
                                        <Button 
                                            type="primary" 
                                            onClick={next}
                                            icon={<ArrowRightOutlined />}
                                        >
                                            បន្ទាប់
                                        </Button>
                                    )}
                                    
                                    {currentStep === steps.length - 1 && (
                                        <Button 
                                            type="primary" 
                                            onClick={handleSubmit}
                                            loading={loading}
                                            icon={<SaveOutlined />}
                                        >
                                            រក្សាទុក
                                        </Button>
                                    )}
                                </Space>
                            </Col>
                        </Row>
                    </div>
                </Card>
            </div>
        </>
    );
}

SellerEdit.layout = page => <AdminLayout title="កែប្រែអ្នកលក់" children={page} />
