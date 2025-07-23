import React, { useState, useEffect } from 'react';
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

export default function EditPostPurchaseCommission({ commission }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (commission) {
            form.setFieldsValue({
                recipient_name: commission.recipient_name,
                total_amount: commission.total_amount,
                description: commission.description,
                payment_steps: commission.payment_steps?.map(step => ({
                    amount: step.amount,
                    due_date: dayjs(step.due_date),
                })) || [{ amount: null, due_date: null }],
            });
        }
    }, [commission, form]);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            // Format payment steps
            const formattedPaymentSteps = values.payment_steps.map(step => ({
                amount: step.amount,
                due_date: step.due_date.format('YYYY-MM-DD'),
            }));

            const payload = {
                ...values,
                payment_steps: formattedPaymentSteps,
            };

            const response = await axios.put(`/commissions/api/post-purchase/${commission.id}`, payload);
            
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
            <Head title="កែប្រែកម៉ីសិនក្រោយទិញ" />
            
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
                            កែប្រែកម៉ីសិនក្រោយទិញ
                        </Title>
                    </Space>
                </div>

                <Card>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
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
