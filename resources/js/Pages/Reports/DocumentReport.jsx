import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Input, Button, Card, Table, Space, 
    Typography, Tag, message, Spin, Breadcrumb
} from 'antd';
import { 
    SearchOutlined, EyeOutlined, FileTextOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

export default function DocumentReport({ auth }) {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
        total: 0
    });
    
    // Load contracts on component mount
    useEffect(() => {
        fetchContracts(1);
    }, []);

    // Fetch contracts with pagination
    const fetchContracts = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/reports/document', {
                params: {
                    page: page,
                    per_page: 15
                }
            });
            
            setContracts(response.data.data);
            setPagination({
                current: response.data.current_page,
                pageSize: response.data.per_page,
                total: response.data.total
            });
        } catch (error) {
            console.error('Error fetching contracts:', error);
            message.error('មានបញ្ហាក្នុងការទាញយកកិច្ចសន្យា');
        } finally {
            setLoading(false);
        }
    };
    
    // Handle search functionality
    const handleSearch = () => {
        const filteredContracts = contracts.filter(contract => 
            contract.contract_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contract.seller_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contract.land_plot_number.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return filteredContracts;
    };

    // Handle viewing contract details
    const handleViewContract = (contractId) => {
        // Navigate to the contract detail page using Inertia
        router.visit(`/documents/${contractId}`);
    };

    // Handle pagination change
    const handleTableChange = (paginationConfig) => {
        fetchContracts(paginationConfig.current);
    };

    // Get status tag for contract status
    const getStatusTag = (status) => {
        switch (status) {
            case 'active':
                return <Tag color="green">សកម្ម</Tag>;
            case 'completed':
                return <Tag color="blue">បានបញ្ចប់</Tag>;
            case 'cancelled':
                return <Tag color="red">បានលុបចោល</Tag>;
            default:
                return <Tag color="default">{status}</Tag>;
        }
    };

    // Contract list table columns
    const columns = [
        {
            title: 'លេខកិច្ចសន្យា',
            dataIndex: 'contract_id',
            key: 'contract_id',
            render: (contractId, record) => (
                <Button 
                    type="link" 
                    onClick={() => handleViewContract(contractId)}
                    style={{ padding: 0, fontWeight: 'bold', color: '#1890ff' }}
                >
                    {contractId}
                </Button>
            ),
        },
        {
            title: 'ឈ្មោះអ្នកលក់',
            dataIndex: 'seller_name',
            key: 'seller_name',
        },
        {
            title: 'លេខក្បែងដី',
            dataIndex: 'land_plot_number',
            key: 'land_plot_number',
        },
        {
            title: 'ចំនួនទឹកប្រាក់សរុប',
            dataIndex: 'total_amount',
            key: 'total_amount',
            render: (amount) => `$${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        },
        {
            title: 'កាលបរិច្ឆេទកិច្ចសន្យា',
            dataIndex: 'contract_date',
            key: 'contract_date',
        },
        {
            title: 'ស្ថានភាព',
            dataIndex: 'status',
            key: 'status',
            render: (status) => getStatusTag(status),
        },
    ];

    // Get filtered contracts based on search term
    const filteredContracts = searchTerm ? handleSearch() : contracts;

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">របាយការណ៍កិច្ចសន្យា</h2>}
        >
            <Head title="របាយការណ៍កិច្ចសន្យា" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Breadcrumb className="mb-6">
                        <Breadcrumb.Item>របាយការណ៍</Breadcrumb.Item>
                        <Breadcrumb.Item>បញ្ជីកិច្ចសន្យា</Breadcrumb.Item>
                    </Breadcrumb>

                    <Card 
                        title={
                            <div className="flex items-center justify-between">
                                <Title level={4} className="m-0">
                                    <FileTextOutlined className="mr-2" />
                                    បញ្ជីកិច្ចសន្យាលក់ដី
                                </Title>
                                <Text type="secondary">
                                    សរុប: {pagination.total} កិច្ចសន្យា
                                </Text>
                            </div>
                        }
                        className="mb-6"
                    >
                        <div className="mb-4">
                            <Input
                                placeholder="ស្វែងរកតាមលេខកិច្ចសន្យា, ឈ្មោះអ្នកលក់, ឬលេខក្បែងដី..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: '400px' }}
                                prefix={<SearchOutlined />}
                                allowClear
                            />
                        </div>

                        <Table 
                            columns={columns}
                            dataSource={filteredContracts}
                            rowKey="id"
                            loading={loading}
                            pagination={{
                                ...pagination,
                                showSizeChanger: false,
                                showQuickJumper: true,
                                showTotal: (total, range) => 
                                    `បង្ហាញ ${range[0]}-${range[1]} នៃ ${total} កិច្ចសន្យា`,
                            }}
                            onChange={handleTableChange}
                            size="middle"
                            scroll={{ x: 800 }}
                        />
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
