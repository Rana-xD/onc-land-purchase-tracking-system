import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { 
    Card, 
    Form, 
    Input, 
    InputNumber, 
    Button, 
    Space, 
    Typography, 
    message, 
    Row,
    Col,
    DatePicker,
    Divider
} from 'antd';
import { 
    PlusOutlined, 
    MinusCircleOutlined,
    ArrowLeftOutlined,
    SaveOutlined
} from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function CreatePostPurchaseCommission() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            // Validate that payment steps sum equals total amount
            const totalAmount = parseFloat(values.total_amount);
            const paymentStepsSum = values.payment_steps.reduce((sum, step) => sum + parseFloat(step.amount || 0), 0);
            
            if (Math.abs(totalAmount - paymentStepsSum) > 0.01) {
                message.error(`ចំនួនសរុបនៃជំហានទូទាត់ ($${paymentStepsSum.toFixed(2)}) មិនត្រូវនឹងចំនួនសរុប ($${totalAmount.toFixed(2)}) ទេ។ សូមពិនិត្យម្តងទៀត។`);
                setLoading(false);
                return;
            }

            // Format payment steps
            const formattedPaymentSteps = values.payment_steps.map(step => ({
                amount: step.amount,
                due_date: step.due_date.format('YYYY-MM-DD'),
            }));

            const payload = {
                ...values,
                payment_steps: formattedPaymentSteps,
            };

            const response = await axios.post('/commissions/api/post-purchase', payload);
            
            if (response.data.success) {
                message.success(response.data.message);
                router.visit('/commissions/post-purchase');
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                Object.keys(errors).forEach(key => {
                    if (key === 'payment_steps' && Array.isArray(errors[key])) {
                        // Handle payment steps validation errors
                        errors[key].forEach(errorMsg => {
                            message.error(errorMsg);
                        });
                    } else {
                        form.setFields([{
                            name: key,
                            errors: errors[key],
                        }]);
                    }
                });
            } else {
                message.error(error.response?.data?.message || 'មានបញ្ហាក្នុងការរក្សាទុក');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        router.visit('/commissions/post-purchase');
    };

    return (
        <AdminLayout>
            <Head title="បន្ថែមកុំស្យុងក្រោយទិញ" />
            
            <div style={{ padding: '24px' }}>
                {/* Header */}
                <div style={{ marginBottom: '24px' }}>
                    <Space align="center">
                        <Button 
                            icon={<ArrowLeftOutlined />} 
                            onClick={handleBack}
                            type="text"
                        />
                        <Title level={2} style={{ margin: 0, textAlign: 'center' }}>
                            បន្ថែមកុំស្យុងក្រោយទិញ
                        </Title>
                    </Space>
                </div>

                <Card>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{
                            payment_steps: [{ amount: null, due_date: null }],
                        }}
                    >
                        <Row gutter={24}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="recipient_name"
                                    label="ឈ្មោះអ្នកទទួល"
                                    rules={[
                                        { required: true, message: 'សូមបញ្ចូលឈ្មោះអ្នកទទួល' },
                                    ]}
                                >
                                    <Input placeholder="បញ្ចូលឈ្មោះអ្នកទទួល" size="large" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="total_amount"
                                    label="ចំនួនសរុប"
                                    rules={[
                                        { required: true, message: 'សូមបញ្ចូលចំនួនសរុប' },
                                        { type: 'number', min: 0.01, message: 'ចំនួនទឹកប្រាក់ត្រូវតែធំជាង 0' },
                                    ]}
                                >
                                    <InputNumber
                                        placeholder="បញ្ចូលចំនួនសរុប"
                                        style={{ width: '100%' }}
                                        size="large"
                                        formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                        precision={2}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="description"
                            label="ការពិពណ៌នា"
                        >
                            <TextArea 
                                placeholder="បញ្ចូលការពិពណ៌នា (ស្រេចចិត្ត)"
                                rows={4}
                                size="large"
                            />
                        </Form.Item>

                        <Divider>ជំហានទូទាត់</Divider>

                        <Form.List name="payment_steps">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Card 
                                            key={key} 
                                            size="small" 
                                            style={{ marginBottom: '16px', backgroundColor: '#fafafa' }}
                                            title={`ជំហានទី ${name + 1}`}
                                            extra={
                                                fields.length > 1 && (
                                                    <Button
                                                        type="link"
                                                        danger
                                                        icon={<MinusCircleOutlined />}
                                                        onClick={() => remove(name)}
                                                        size="small"
                                                    >
                                                        លុប
                                                    </Button>
                                                )
                                            }
                                        >
                                            <Row gutter={16}>
                                                <Col xs={24} md={12}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'amount']}
                                                        label="ចំនួនទឹកប្រាក់"
                                                        rules={[
                                                            { required: true, message: 'សូមបញ្ចូលចំនួនទឹកប្រាក់' },
                                                            { type: 'number', min: 0.01, message: 'ចំនួនទឹកប្រាក់ត្រូវតែធំជាង 0' },
                                                        ]}
                                                    >
                                                        <InputNumber
                                                            placeholder="ចំនួនទឹកប្រាក់"
                                                            style={{ width: '100%' }}
                                                            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                                            precision={2}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col xs={24} md={12}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'due_date']}
                                                        label="កាលបរិច្ឆេទ"
                                                        rules={[
                                                            { required: true, message: 'សូមជ្រើសរើសកាលបរិច្ឆេទ' },
                                                        ]}
                                                    >
                                                        <DatePicker
                                                            placeholder="កាលបរិច្ឆេទ"
                                                            style={{ width: '100%' }}
                                                            format="DD/MM/YYYY"
                                                            disabledDate={(current) => current && current < dayjs().endOf('day')}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Card>
                                    ))}
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        block
                                        icon={<PlusOutlined />}
                                        size="large"
                                        style={{ marginBottom: '24px' }}
                                    >
                                        បន្ថែមជំហាន
                                    </Button>
                                </>
                            )}
                        </Form.List>

                        <div style={{ textAlign: 'right', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
                            <Space size="middle">
                                <Button size="large" onClick={handleBack}>
                                    បោះបង់
                                </Button>
                                <Button 
                                    type="primary" 
                                    htmlType="submit" 
                                    loading={loading}
                                    icon={<SaveOutlined />}
                                    size="large"
                                >
                                    រក្សាទុក
                                </Button>
                            </Space>
                        </div>
                    </Form>
                </Card>
            </div>
        </AdminLayout>
    );
}
