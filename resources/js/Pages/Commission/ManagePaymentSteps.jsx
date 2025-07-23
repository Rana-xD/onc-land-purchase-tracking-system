import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { 
    Card, 
    Table, 
    Button, 
    Modal, 
    Form, 
    Badge, 
    Space, 
    Typography, 
    message, 
    Row,
    Col,
    Input,
    Descriptions,
    Tooltip
} from 'antd';
import { 
    ArrowLeftOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function ManagePaymentSteps({ commission }) {
    const [markPaidModalVisible, setMarkPaidModalVisible] = useState(false);
    const [selectedPaymentStep, setSelectedPaymentStep] = useState(null);
    const [markPaidForm] = Form.useForm();
    const [paymentSteps, setPaymentSteps] = useState(commission.payment_steps || []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('km-KH', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount || 0);
    };

    const handleBack = () => {
        router.visit('/commissions/post-purchase');
    };

    const showMarkPaidModal = (paymentStep) => {
        setSelectedPaymentStep(paymentStep);
        setMarkPaidModalVisible(true);
        markPaidForm.resetFields();
    };

    const handleMarkPaidModalCancel = () => {
        setMarkPaidModalVisible(false);
        setSelectedPaymentStep(null);
        markPaidForm.resetFields();
    };

    const handleMarkStepAsPaid = async (values) => {
        try {
            const response = await axios.patch(
                `/commissions/api/payment-steps/${selectedPaymentStep.id}/mark-paid`,
                values
            );
            
            if (response.data.success) {
                message.success(response.data.message);
                setMarkPaidModalVisible(false);
                setSelectedPaymentStep(null);
                markPaidForm.resetFields();
                
                // Update the payment steps in the local state
                setPaymentSteps(prevSteps => 
                    prevSteps.map(step => 
                        step.id === selectedPaymentStep.id 
                            ? { ...step, status: 'paid', paid_date: dayjs().format('YYYY-MM-DD'), notes: values.notes }
                            : step
                    )
                );
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'មានបញ្ហាក្នុងការបញ្ជាក់ការទូទាត់');
        }
    };

    const columns = [
        {
            title: 'ជំហាន',
            dataIndex: 'step_number',
            key: 'step_number',
            render: (stepNumber) => <Text strong>ជំហានទី {stepNumber}</Text>,
        },
        {
            title: 'ចំនួនទឹកប្រាក់',
            dataIndex: 'amount',
            key: 'amount',
            align: 'right',
            render: (amount) => <Text strong>{formatCurrency(amount)}</Text>,
        },
        {
            title: 'កាលបរិច្ឆេទ',
            dataIndex: 'due_date',
            key: 'due_date',
            render: (date) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: 'ស្ថានភាព',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status) => (
                <Badge 
                    status={status === 'paid' ? 'success' : 'warning'}
                    text={status === 'paid' ? 'បានបង់ហើយ' : 'មិនទាន់បង់'}
                />
            ),
        },
        {
            title: 'កាលបរិច្ឆេទបង់',
            dataIndex: 'paid_date',
            key: 'paid_date',
            render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '-',
        },
        {
            title: 'កំណត់ចំណាំ',
            dataIndex: 'notes',
            key: 'notes',
            render: (notes) => notes || '-',
        },
        {
            title: 'សកម្មភាព',
            key: 'actions',
            align: 'center',
            render: (_, record) => (
                record.status === 'pending' && (
                    <Tooltip title="បញ្ជាក់ថាជំហាននេះត្រូវបានបង់រួចហើយ">
                        <Button
                            type="primary"
                            icon={<CheckCircleOutlined />}
                            onClick={() => showMarkPaidModal(record)}
                            size="small"
                        >
                            បញ្ជាក់ការទូទាត់
                        </Button>
                    </Tooltip>
                )
            ),
        },
    ];

    // Calculate summary statistics
    const totalAmount = paymentSteps.reduce((sum, step) => sum + parseFloat(step.amount), 0);
    const paidAmount = paymentSteps.filter(step => step.status === 'paid').reduce((sum, step) => sum + parseFloat(step.amount), 0);
    const pendingAmount = totalAmount - paidAmount;
    const totalSteps = paymentSteps.length;
    const paidSteps = paymentSteps.filter(step => step.status === 'paid').length;

    return (
        <AdminLayout>
            <Head title={`ជំហានទូទាត់កម៉ីសិន - ${commission.recipient_name}`} />
            
            <div style={{ padding: '24px' }}>
                {/* Header */}
                <div style={{ marginBottom: '24px' }}>
                    <Space align="center">
                        <Button 
                            icon={<ArrowLeftOutlined />} 
                            onClick={handleBack}
                            type="text"
                        />
                        <Title level={2} style={{ margin: 0 }}>
                            ជំហានទូទាត់កម៉ីសិន - {commission.recipient_name}
                        </Title>
                    </Space>
                </div>

                {/* Commission Details */}
                <Card style={{ marginBottom: '24px' }}>
                    <Descriptions title="ព័ត៌មានកម៉ីសិន" bordered column={2}>
                        <Descriptions.Item label="ឈ្មោះអ្នកទទួល">
                            <Text strong>{commission.recipient_name}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="ចំនួនសរុប">
                            <Text strong>{formatCurrency(commission.total_amount)}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="ការពិពណ៌នា" span={2}>
                            {commission.description || '-'}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Summary Statistics */}
                <Row gutter={16} style={{ marginBottom: '24px' }}>
                    <Col xs={24} sm={6}>
                        <Card>
                            <div style={{ textAlign: 'center' }}>
                                <Text type="secondary">ជំហានសរុប</Text>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                                    {totalSteps}
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={6}>
                        <Card>
                            <div style={{ textAlign: 'center' }}>
                                <Text type="secondary">ជំហានបានបង់</Text>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                                    {paidSteps}
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={6}>
                        <Card>
                            <div style={{ textAlign: 'center' }}>
                                <Text type="secondary">ចំនួនបានបង់</Text>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#52c41a' }}>
                                    {formatCurrency(paidAmount)}
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={6}>
                        <Card>
                            <div style={{ textAlign: 'center' }}>
                                <Text type="secondary">ចំនួននៅសល់</Text>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#faad14' }}>
                                    {formatCurrency(pendingAmount)}
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* Payment Steps Table */}
                <Card title="ជំហានទូទាត់">
                    <Table
                        columns={columns}
                        dataSource={paymentSteps}
                        rowKey="id"
                        pagination={false}
                        locale={{
                            emptyText: 'មិនមានជំហានទូទាត់',
                        }}
                    />
                </Card>

                {/* Mark as Paid Modal */}
                <Modal
                    title="បញ្ជាក់ការទូទាត់"
                    open={markPaidModalVisible}
                    onCancel={handleMarkPaidModalCancel}
                    footer={null}
                    width={500}
                >
                    {selectedPaymentStep && (
                        <>
                            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
                                <Text strong>ជំហានទី {selectedPaymentStep.step_number}</Text>
                                <br />
                                <Text>ចំនួនទឹកប្រាក់: {formatCurrency(selectedPaymentStep.amount)}</Text>
                                <br />
                                <Text>កាលបរិច្ឆេទ: {dayjs(selectedPaymentStep.due_date).format('DD/MM/YYYY')}</Text>
                            </div>
                            
                            <Form
                                form={markPaidForm}
                                layout="vertical"
                                onFinish={handleMarkStepAsPaid}
                            >
                                <Form.Item
                                    name="notes"
                                    label="កំណត់ចំណាំ"
                                >
                                    <TextArea 
                                        placeholder="បញ្ចូលកំណត់ចំណាំ (ស្រេចចិត្ត)"
                                        rows={4}
                                    />
                                </Form.Item>

                                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                                    <Space>
                                        <Button onClick={handleMarkPaidModalCancel}>
                                            បោះបង់
                                        </Button>
                                        <Button type="primary" htmlType="submit">
                                            បញ្ជាក់
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </Form>
                        </>
                    )}
                </Modal>
            </div>
        </AdminLayout>
    );
}
