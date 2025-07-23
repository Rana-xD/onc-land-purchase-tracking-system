import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { 
    Card, 
    Table, 
    Button, 
    Input, 
    Badge, 
    Space, 
    Typography, 
    message, 
    Popconfirm,
    Row,
    Col
} from 'antd';
import { 
    PlusOutlined, 
    EditOutlined, 
    DeleteOutlined, 
    EyeOutlined,
    SearchOutlined
} from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';

const { Title, Text } = Typography;

export default function PostPurchaseCommission() {
    const [commissions, setCommissions] = useState([]);
    const [loading, setLoading] = useState(false);
    // Remove modal-related state variables since we're using dedicated pages
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
            const response = await axios.get('/commissions/api/post-purchase', {
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

    const handleCreate = () => {
        router.visit('/commissions/post-purchase/create');
    };

    const handleEdit = (commission) => {
        router.visit(`/commissions/post-purchase/${commission.id}/edit`);
    };

    const handleViewSteps = (commission) => {
        router.visit(`/commissions/post-purchase/${commission.id}/steps`);
    };



    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`/commissions/api/post-purchase/${id}`);
            
            if (response.data.success) {
                message.success(response.data.message);
                fetchCommissions(pagination.current, searchText);
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'មានបញ្ហាក្នុងការលុប');
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
            title: 'ចំនួនសរុប',
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
            render: (status) => {
                const statusConfig = {
                    pending: { status: 'warning', text: 'មិនទាន់បង់' },
                    partial: { status: 'processing', text: 'បង់ខ្លះ' },
                    paid: { status: 'success', text: 'បានបង់ហើយ' },
                };
                const config = statusConfig[status] || statusConfig.pending;
                return <Badge status={config.status} text={config.text} />;
            },
        },
        {
            title: 'សកម្មភាព',
            key: 'actions',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewSteps(record)}
                        size="small"
                        title="មើលជំហាន"
                    />
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        size="small"
                    />
                    <Popconfirm
                        title="តើអ្នកពិតជាចង់លុបមែនទេ?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="យល់ព្រម"
                        cancelText="បោះបង់"
                    >
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];



    return (
        <AdminLayout>
            <Head title="កម៉ីសិនក្រោយទិញ" />
            
            <div style={{ padding: '24px' }}>
                {/* Header */}
                <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                    <Title level={2} style={{ margin: 0 }}>
                        កម៉ីសិនក្រោយទិញ
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
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleCreate}
                            >
                                បន្ថែមថ្មី
                            </Button>
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
            </div>
        </AdminLayout>
    );
}
