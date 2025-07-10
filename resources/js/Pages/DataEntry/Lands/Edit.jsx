import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Form, Input, Button, Steps, Card, Row, Col, 
    Typography, InputNumber, Select, message, Breadcrumb, 
    Space
} from 'antd';
import { 
    SaveOutlined, ArrowLeftOutlined, ArrowRightOutlined, 
    CheckCircleOutlined, FileAddOutlined, EnvironmentOutlined
} from '@ant-design/icons';
import FileUpload from '@/Components/FileUpload';
import axios from 'axios';

const { Title, Text } = Typography;
const { Step } = Steps;
const { Option } = Select;

export default function LandEdit({ land, documents }) {
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        title_deed_number: land.title_deed_number,
        location: land.location,
        province: land.province,
        district: land.district,
        commune: land.commune,
        village: land.village,
        size: land.size,
        size_unit: land.size_unit,
        price_per_unit: land.price_per_unit,
        total_price: land.total_price
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

    // Recalculate total price when size or price_per_unit changes
    useEffect(() => {
        if (formValues.size && formValues.price_per_unit) {
            const totalPrice = formValues.size * formValues.price_per_unit;
            setFormValues(prev => ({
                ...prev,
                total_price: totalPrice
            }));
            form.setFieldsValue({ total_price: totalPrice });
        }
    }, [formValues.size, formValues.price_per_unit]);

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
            title: 'ព័ត៌មានដី',
            icon: <EnvironmentOutlined />,
            content: (
                <Card title="បញ្ចូលព័ត៌មានដី" className="mb-6">
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={{
                            title_deed_number: land.title_deed_number,
                            location: land.location,
                            province: land.province,
                            district: land.district,
                            commune: land.commune,
                            village: land.village,
                            size: land.size,
                            size_unit: land.size_unit,
                            price_per_unit: land.price_per_unit,
                            total_price: land.total_price
                        }}
                        onValuesChange={(changedValues, allValues) => {
                            setFormValues({...formValues, ...changedValues});
                        }}
                    >
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="លេខប្លង់"
                                    name="title_deed_number"
                                    rules={[{ required: true, message: 'សូមបញ្ចូលលេខប្លង់' }]}
                                >
                                    <Input placeholder="បញ្ចូលលេខប្លង់" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="ទីតាំង"
                                    name="location"
                                    rules={[{ required: true, message: 'សូមបញ្ចូលទីតាំង' }]}
                                >
                                    <Input placeholder="បញ្ចូលទីតាំង" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="ខេត្ត/ក្រុង"
                                    name="province"
                                    rules={[{ required: true, message: 'សូមបញ្ចូលខេត្ត/ក្រុង' }]}
                                >
                                    <Input placeholder="បញ្ចូលខេត្ត/ក្រុង" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="ស្រុក/ខណ្ឌ"
                                    name="district"
                                    rules={[{ required: true, message: 'សូមបញ្ចូលស្រុក/ខណ្ឌ' }]}
                                >
                                    <Input placeholder="បញ្ចូលស្រុក/ខណ្ឌ" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="ឃុំ/សង្កាត់"
                                    name="commune"
                                    rules={[{ required: true, message: 'សូមបញ្ចូលឃុំ/សង្កាត់' }]}
                                >
                                    <Input placeholder="បញ្ចូលឃុំ/សង្កាត់" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="ភូមិ"
                                    name="village"
                                    rules={[{ required: true, message: 'សូមបញ្ចូលភូមិ' }]}
                                >
                                    <Input placeholder="បញ្ចូលភូមិ" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="ទំហំ"
                                    name="size"
                                    rules={[{ required: true, message: 'សូមបញ្ចូលទំហំ' }]}
                                >
                                    <InputNumber 
                                        style={{ width: '100%' }} 
                                        min={0} 
                                        placeholder="បញ្ចូលទំហំ" 
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={4}>
                                <Form.Item
                                    label="ឯកតា"
                                    name="size_unit"
                                    rules={[{ required: true, message: 'សូមជ្រើសរើសឯកតា' }]}
                                >
                                    <Select placeholder="ជ្រើសរើសឯកតា">
                                        <Option value="sqm">ម៉ែត្រការ៉េ</Option>
                                        <Option value="hectare">ហិកតា</Option>
                                        <Option value="acre">អាក្រ</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="តម្លៃក្នុងមួយឯកតា"
                                    name="price_per_unit"
                                    rules={[{ required: true, message: 'សូមបញ្ចូលតម្លៃក្នុងមួយឯកតា' }]}
                                >
                                    <InputNumber 
                                        style={{ width: '100%' }} 
                                        min={0} 
                                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                        placeholder="បញ្ចូលតម្លៃក្នុងមួយឯកតា" 
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item
                            label="តម្លៃសរុប"
                            name="total_price"
                        >
                            <InputNumber 
                                style={{ width: '100%' }} 
                                min={0} 
                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                placeholder="តម្លៃសរុប" 
                                disabled
                            />
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
                                <Card title="ព័ត៌មានដី" size="small">
                                    <Row gutter={[16, 8]}>
                                        <Col xs={24} md={12}>
                                            <Text strong>លេខប្លង់:</Text> {formValues.title_deed_number}
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Text strong>ទីតាំង:</Text> {formValues.location}
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Text strong>ខេត្ត/ក្រុង:</Text> {formValues.province}
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Text strong>ស្រុក/ខណ្ឌ:</Text> {formValues.district}
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Text strong>ឃុំ/សង្កាត់:</Text> {formValues.commune}
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Text strong>ភូមិ:</Text> {formValues.village}
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Text strong>ទំហំ:</Text> {formValues.size} {
                                                formValues.size_unit === 'sqm' ? 'ម៉ែត្រការ៉េ' : 
                                                formValues.size_unit === 'hectare' ? 'ហិកតា' : 
                                                formValues.size_unit === 'acre' ? 'អាក្រ' : ''
                                            }
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Text strong>តម្លៃក្នុងមួយឯកតា:</Text> ${formValues.price_per_unit?.toLocaleString()}
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Text strong>តម្លៃសរុប:</Text> ${formValues.total_price?.toLocaleString()}
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
                documents: fileList.map(file => ({
                    id: file.id,
                    isExisting: file.isExisting || false,
                    tempPath: file.tempPath,
                    fileName: file.name,
                    isDisplay: file.isDisplay || false
                }))
            };
            
            // Submit data
            await axios.put(`/api/lands/${land.id}`, formData);
            
            message.success('ដីត្រូវបានកែប្រែដោយជោគជ័យ');
            router.visit(route('data-entry.lands.index'));
        } catch (error) {
            console.error('Error updating land:', error);
            message.error('មានបញ្ហាក្នុងការកែប្រែដី');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="កែប្រែដី" />
            
            <div className="land-edit">
                <Breadcrumb
                    items={[
                        { title: <Link href={route('data-entry.index')}>ជ្រើសរើសប្រភេទទិន្នន័យ</Link> },
                        { title: <Link href={route('data-entry.lands.index')}>បញ្ជីដី</Link> },
                        { title: 'កែប្រែដី' },
                    ]}
                    className="mb-6"
                />
                
                <Card>
                    <Title level={4} className="khmer-heading mb-6">កែប្រែដី</Title>
                    
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
                                        onClick={() => router.visit(route('data-entry.lands.index'))}
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

LandEdit.layout = page => <AdminLayout title="កែប្រែដី" children={page} />
