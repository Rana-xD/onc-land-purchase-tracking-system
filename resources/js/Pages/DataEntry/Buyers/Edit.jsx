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

export default function BuyerEdit({ buyer, documents }) {
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        name: buyer.name,
        sex: buyer.sex,
        date_of_birth: buyer.date_of_birth,
        identity_number: buyer.identity_number,
        address: buyer.address,
        phone_number: buyer.phone_number
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
                        maxFiles={4}
                    />
                </Card>
            ),
        },
        {
            title: 'ព័ត៌មានអ្នកទិញ',
            icon: <UserOutlined />,
            content: (
                <Card title="បញ្ចូលព័ត៌មានអ្នកទិញ" className="mb-6">
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={{
                            name: buyer.name,
                            sex: buyer.sex,
                            date_of_birth: buyer.date_of_birth ? dayjs(buyer.date_of_birth) : null,
                            identity_number: buyer.identity_number,
                            address: buyer.address,
                            phone_number: buyer.phone_number
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
                                    rules={[{ required: true, message: 'សូមបញ្ចូលថ្ងៃខែឆ្នាំកំណើត' }]}
                                >
                                    <DatePicker 
                                        style={{ width: '100%' }} 
                                        format="YYYY-MM-DD" 
                                        placeholder="ជ្រើសរើសថ្ងៃខែឆ្នាំកំណើត"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="លេខអត្តសញ្ញាណប័ណ្ណ"
                                    name="identity_number"
                                    rules={[{ required: true, message: 'សូមបញ្ចូលលេខអត្តសញ្ញាណប័ណ្ណ' }]}
                                >
                                    <Input placeholder="បញ្ចូលលេខអត្តសញ្ញាណប័ណ្ណ" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item
                            label="អាសយដ្ឋាន"
                            name="address"
                            rules={[{ required: true, message: 'សូមបញ្ចូលអាសយដ្ឋាន' }]}
                        >
                            <Input.TextArea rows={3} placeholder="បញ្ចូលអាសយដ្ឋាន" />
                        </Form.Item>
                        <Form.Item
                            label="លេខទូរស័ព្ទ"
                            name="phone_number"
                            rules={[{ required: true, message: 'សូមបញ្ចូលលេខទូរស័ព្ទ' }]}
                        >
                            <Input placeholder="បញ្ចូលលេខទូរស័ព្ទ" />
                        </Form.Item>
                    </Form>
                </Card>
            ),
        },
        {
            title: 'បញ្ជាក់',
            icon: <CheckCircleOutlined />,
            content: (
                <Card title="បញ្ជាក់ព័ត៌មាន" className="mb-6">
                    <div className="confirmation-content">
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Card title="ឯកសារ" size="small">
                                    {fileList.length > 0 ? (
                                        <ul className="document-list">
                                            {fileList.map((file, index) => (
                                                <li key={index}>
                                                    {file.name} {file.isDisplay && <span className="display-badge">(ឯកសារបង្ហាញ)</span>}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <Text type="secondary">គ្មានឯកសារ</Text>
                                    )}
                                </Card>
                            </Col>
                            <Col span={24}>
                                <Card title="ព័ត៌មានអ្នកទិញ" size="small">
                                    <Row gutter={[16, 8]}>
                                        <Col xs={24} md={12}>
                                            <Text strong>ឈ្មោះ:</Text> {formValues.name}
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Text strong>ភេទ:</Text> {formValues.sex === 'male' ? 'ប្រុស' : 'ស្រី'}
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Text strong>ថ្ងៃខែឆ្នាំកំណើត:</Text> {formValues.date_of_birth instanceof dayjs ? formValues.date_of_birth.format('YYYY-MM-DD') : formValues.date_of_birth}
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Text strong>លេខអត្តសញ្ញាណប័ណ្ណ:</Text> {formValues.identity_number}
                                        </Col>
                                        <Col xs={24}>
                                            <Text strong>អាសយដ្ឋាន:</Text> {formValues.address}
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Text strong>លេខទូរស័ព្ទ:</Text> {formValues.phone_number}
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Card>
            ),
        },
    ];

    const next = async () => {
        if (currentStep === 1) {
            try {
                await form.validateFields();
                setCurrentStep(currentStep + 1);
            } catch (error) {
                console.error('Validation failed:', error);
            }
        } else {
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
            await axios.put(`/api/buyers/${buyer.id}`, formData);
            
            message.success('អ្នកទិញត្រូវបានកែប្រែដោយជោគជ័យ');
            router.visit(route('data-entry.buyers.index'));
        } catch (error) {
            console.error('Error updating buyer:', error);
            message.error('មានបញ្ហាក្នុងការកែប្រែអ្នកទិញ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="កែប្រែអ្នកទិញ" />
            
            <div className="buyer-edit">
                <Breadcrumb
                    items={[
                        { title: <Link href={route('data-entry.index')}>ជ្រើសរើសប្រភេទទិន្នន័យ</Link> },
                        { title: <Link href={route('data-entry.buyers.index')}>បញ្ជីអ្នកទិញ</Link> },
                        { title: 'កែប្រែអ្នកទិញ' },
                    ]}
                    className="mb-6"
                />
                
                <Card>
                    <Title level={4} className="khmer-heading mb-6">កែប្រែអ្នកទិញ</Title>
                    
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
                                        onClick={() => router.visit(route('data-entry.buyers.index'))}
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

BuyerEdit.layout = page => <AdminLayout title="កែប្រែអ្នកទិញ" children={page} />
