import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { 
    Card, 
    Table, 
    Button, 
    Modal, 
    Form, 
    Input, 
    InputNumber, 
    Badge, 
    Space, 
    Typography, 
    message, 
    Popconfirm,
    Row,
    Col,
    Spin,
    Tooltip
} from 'antd';
import { 
    PlusOutlined, 
    EditOutlined, 
    DeleteOutlined, 
    CheckCircleOutlined,
    SearchOutlined 
} from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function PrePurchaseCommission() {
    const [commissions, setCommissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCommission, setEditingCommission] = useState(null);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
        total: 0,
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('km-KH', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount || 0);
    };

    const fetchCommissions = async (page = 1, search = '') => {
        setLoading(true);
        try {
            const response = await axios.get('/commissions/api/pre-purchase', {
                params: {
                    page,
                    search,
                }
            });

            if (response.data.commissions) {
                setCommissions(response.data.commissions);
                setPagination({
                    current: response.data.pagination.current_page,
                    pageSize: response.data.pagination.per_page,
                    total: response.data.pagination.total,
                });
            }
        } catch (error) {
            message.error('មានបញ្ហាក្នុងការទាញយកទិន្នន័យ');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCommissions();
    }, []);

    const handleSearch = (value) => {
        setSearchText(value);
        fetchCommissions(1, value);
    };

    const handleTableChange = (paginationInfo) => {
        fetchCommissions(paginationInfo.current, searchText);
    };

    const showModal = (commission = null) => {
        setEditingCommission(commission);
        setModalVisible(true);
        
        if (commission) {
            form.setFieldsValue({
                recipient_name: commission.recipient_name,
                total_amount: commission.total_amount,
                description: commission.description,
            });
        } else {
            form.resetFields();
        }
    };

    const handleModalCancel = () => {
        setModalVisible(false);
        setEditingCommission(null);
        form.resetFields();
    };

    const handleSubmit = async (values) => {
        try {
            const url = editingCommission 
                ? `/commissions/api/pre-purchase/${editingCommission.id}`
                : '/commissions/api/pre-purchase';
            
            const method = editingCommission ? 'put' : 'post';
            
            const response = await axios[method](url, values);
            
            if (response.data.success) {
                message.success(response.data.message);
                setModalVisible(false);
                setEditingCommission(null);
                form.resetFields();
                fetchCommissions(pagination.current, searchText);
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                Object.keys(errors).forEach(key => {
                    form.setFields([{
                        name: key,
                        errors: errors[key],
                    }]);
                });
            } else {
                message.error(error.response?.data?.message || 'មានបញ្ហាក្នុងការរក្សាទុក');
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`/commissions/api/pre-purchase/${id}`);
            
            if (response.data.success) {
                message.success(response.data.message);
                fetchCommissions(pagination.current, searchText);
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'មានបញ្ហាក្នុងការលុប');
        }
    };

    const handleMarkAsPaid = async (id) => {
        try {
            const response = await axios.patch(`/commissions/api/pre-purchase/${id}/mark-paid`);
            
            if (response.data.success) {
                message.success(response.data.message);
                fetchCommissions(pagination.current, searchText);
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'មានបញ្ហាក្នុងការបញ្ជាក់ការទូទាត់');
        }
    };

    const columns = [
        {
            title: 'ឈ្មោះអ្នកទទួល',
            dataIndex: 'recipient_name',
            key: 'recipient_name',
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'ចំនួនទឹកប្រាក់',
            dataIndex: 'total_amount',
            key: 'total_amount',
            align: 'right',
            render: (amount) => <Text strong>{formatCurrency(amount)}</Text>,
        },
        {
            title: 'ការពិពណ៌នា',
            dataIndex: 'description',
            key: 'description',
            render: (text) => text || '-',
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
            title: 'សកម្មភាព',
            key: 'actions',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Tooltip title="កែប្រែកម៉ីសិន">
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => showModal(record)}
                            size="small"
                        />
                    </Tooltip>
                    <Popconfirm
                        title="តើអ្នកពិតជាចង់លុបមែនទេ?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="យល់ព្រម"
                        cancelText="បោះបង់"
                    >
                        <Tooltip title="លុបកម៉ីសិន">
                            <Button
                                type="link"
                                danger
                                icon={<DeleteOutlined />}
                                size="small"
                            />
                        </Tooltip>
                    </Popconfirm>
                    {record.status === 'pending' && (
                        <Popconfirm
                            title="តើអ្នកពិតជាចង់បញ្ជាក់ការទូទាត់មែនទេ?"
                            onConfirm={() => handleMarkAsPaid(record.id)}
                            okText="យល់ព្រម"
                            cancelText="បោះបង់"
                        >
                            <Tooltip title="បញ្ជាក់ការទូទាត់">
                                <Button
                                    type="link"
                                    icon={<CheckCircleOutlined />}
                                    size="small"
                                    style={{ color: '#52c41a' }}
                                />
                            </Tooltip>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Head title="កម៉ីសិនមុនទិញ" />
            
            <div style={{ padding: '24px' }}>
                {/* Header */}
                <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                    <Title level={2} style={{ margin: 0 }}>
                        កម៉ីសិនមុនទិញ
                    </Title>
                </div>

                <Card>
                    {/* Header Actions */}
                    <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
                        <Col>
                            <Input.Search
                                placeholder="ស្វែងរកតាមឈ្មោះ..."
                                allowClear
                                onSearch={handleSearch}
                                style={{ width: 300 }}
                                prefix={<SearchOutlined />}
                            />
                        </Col>
                        <Col>
                            <Tooltip title="បន្ថែមកម៉ីសិនមុនទិញថ្មី">
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => showModal()}
                                >
                                    បន្ថែមថ្មី
                                </Button>
                            </Tooltip>
                        </Col>
                    </Row>

                    {/* Table */}
                    <Table
                        columns={columns}
                        dataSource={commissions}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            ...pagination,
                            showSizeChanger: false,
                            showQuickJumper: true,
                            showTotal: (total, range) => 
                                `${range[0]}-${range[1]} នៃ ${total} ធាតុ`,
                        }}
                        onChange={handleTableChange}
                        locale={{
                            emptyText: 'មិនមានទិន្នន័យ',
                        }}
                    />
                </Card>

                {/* Create/Edit Modal */}
                <Modal
                    title={editingCommission ? 'កែប្រែកម៉ីសិនមុនទិញ' : 'បន្ថែមកម៉ីសិនមុនទិញ'}
                    open={modalVisible}
                    onCancel={handleModalCancel}
                    footer={null}
                    width={600}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            name="recipient_name"
                            label="ឈ្មោះអ្នកទទួល"
                            rules={[
                                { required: true, message: 'សូមបញ្ចូលឈ្មោះអ្នកទទួល' },
                            ]}
                        >
                            <Input placeholder="បញ្ចូលឈ្មោះអ្នកទទួល" />
                        </Form.Item>

                        <Form.Item
                            name="total_amount"
                            label="ចំនួនទឹកប្រាក់"
                            rules={[
                                { required: true, message: 'សូមបញ្ចូលចំនួនទឹកប្រាក់' },
                                { type: 'number', min: 0.01, message: 'ចំនួនទឹកប្រាក់ត្រូវតែធំជាង 0' },
                            ]}
                        >
                            <InputNumber
                                placeholder="បញ្ចូលចំនួនទឹកប្រាក់"
                                style={{ width: '100%' }}
                                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                precision={2}
                            />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="ការពិពណ៌នា"
                        >
                            <TextArea 
                                placeholder="បញ្ចូលការពិពណ៌នា (ស្រេចចិត្ត)"
                                rows={4}
                            />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                            <Space>
                                <Button onClick={handleModalCancel}>
                                    បោះបង់
                                </Button>
                                <Button type="primary" htmlType="submit">
                                    រក្សាទុក
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </AdminLayout>
    );
}
