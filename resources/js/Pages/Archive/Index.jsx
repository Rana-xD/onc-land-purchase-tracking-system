import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Table, Button, Tabs, Card, Statistic, Row, Col, 
    message, Spin, Tag, Space, Input, Typography, Popconfirm,
    Breadcrumb, Tooltip
} from 'antd';
import { 
    RollbackOutlined, SearchOutlined,
    UserOutlined, FileTextOutlined, DollarOutlined,
    TeamOutlined, AppstoreOutlined, HomeOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const { Search } = Input;

export default function Archive({ auth, statistics, archived }) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(archived || {});
    const [searchText, setSearchText] = useState('');
    const [activeTab, setActiveTab] = useState('5');

    const handleRestore = async (type, id) => {
        try {
            setLoading(true);
            const response = await axios.post('/archive/restore', { type, id });
            
            // Show success message from server or default
            const successMessage = response.data?.message || 'ទិន្នន័យត្រូវបានស្តារដោយជោគជ័យ';
            message.success(successMessage);
            
            // Wait a bit for the message to be visible before reloading
            setTimeout(() => {
                window.location.reload();
            }, 800);
        } catch (error) {
            console.error('Error restoring:', error);
            if (error.response?.status === 403) {
                message.error('អ្នកមិនមានសិទ្ធិស្តារទិន្នន័យនេះទេ');
            } else {
                const errorMessage = error.response?.data?.message || 'មានបញ្ហាក្នុងការស្តារទិន្នន័យ';
                message.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const getDataForTab = (tabKey) => {
        switch (tabKey) {
            case '1': // data_entry
                return [
                    ...(data.buyers || []).map(item => ({ ...item, type: 'buyers', typeName: 'អ្នកទិញ' })),
                    ...(data.sellers || []).map(item => ({ ...item, type: 'sellers', typeName: 'អ្នកលក់' })),
                    ...(data.lands || []).map(item => ({ ...item, type: 'lands', typeName: 'ដី' }))
                ];
            case '2': // contracts
                // Only show document_creations for contracts to avoid duplicates
                // Sale contracts are archived together with their document creation
                return [
                    ...(data.document_creations || []).map(item => ({ ...item, type: 'document_creations', typeName: 'កិច្ចសន្យា' }))
                ];
            case '3': // commissions
                return (data.commissions || []).map(item => ({ ...item, type: 'commissions', typeName: 'កម៉ីសិន' }));
            case '4': // users
                return [
                    ...(data.users || []).map(item => ({ ...item, type: 'users', typeName: 'អ្នកប្រើប្រាស់' })),
                    ...(data.roles || []).map(item => ({ ...item, type: 'roles', typeName: 'តួនាទី' }))
                ];
            case '5': // all
                return Object.entries(data).flatMap(([type, items]) => {
                    // Skip sale_contracts to avoid duplicates - they're represented by document_creations
                    if (type === 'sale_contracts') return [];
                    
                    const typeNameMap = {
                        buyers: 'អ្នកទិញ',
                        sellers: 'អ្នកលក់',
                        lands: 'ដី',
                        document_creations: 'កិច្ចសន្យា',
                        commissions: 'កម៉ីសិន',
                        users: 'អ្នកប្រើប្រាស់',
                        roles: 'តួនាទី'
                    };
                    return items.map(item => ({ 
                        ...item, 
                        type,
                        typeName: typeNameMap[type] || type 
                    }));
                });
            default:
                return [];
        }
    };

    const formatDate = (date) => {
        if (!date) return 'គ្មាន';
        const d = new Date(date);
        const day = d.getDate();
        const month = d.getMonth() + 1;
        const year = d.getFullYear();
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        
        const khmerMonths = [
            'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
            'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
        ];
        
        return `ថ្ងៃទី ${day} ខែ${khmerMonths[month - 1]} ឆ្នាំ ${year} ម៉ោង ${hours}:${minutes}`;
    };

    const getItemDisplayName = (item) => {
        // For different types, return appropriate display name
        if (item.document_code) return item.document_code;
        if (item.name) return item.name;
        if (item.title) return item.title;
        if (item.land_title_number) return `ដីលេខ: ${item.land_title_number}`;
        if (item.contract_number) return `កិច្ចសន្យាលេខ: ${item.contract_number}`;
        if (item.commission_type) return `កម៉ីសិន ${item.commission_type}`;
        return `#${item.id}`;
    };

    const filteredData = (tabData) => {
        if (!searchText) return tabData;
        return tabData.filter(item => {
            const displayName = getItemDisplayName(item).toLowerCase();
            const deletedByName = (item.deleted_by?.name || '').toLowerCase();
            const searchLower = searchText.toLowerCase();
            return displayName.includes(searchLower) || deletedByName.includes(searchLower);
        });
    };

    const columns = [
        {
            title: 'ប្រភេទ',
            dataIndex: 'typeName',
            key: 'typeName',
            render: (text) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: 'ឈ្មោះ/លេខសម្គាល់',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => getItemDisplayName(record),
        },
        {
            title: 'កាលបរិច្ឆេទលុប',
            dataIndex: 'deleted_at',
            key: 'deleted_at',
            render: (date) => formatDate(date),
        },
        {
            title: 'លុបដោយ',
            dataIndex: 'deleted_by',
            key: 'deleted_by',
            render: (deletedBy) => deletedBy?.name || 'មិនស្គាល់',
        },
        {
            title: 'សកម្មភាព',
            key: 'action',
            render: (_, record) => (
                <Popconfirm
                    title="បញ្ជាក់ការស្តារ"
                    description="តើអ្នកពិតជាចង់ស្តារទិន្នន័យនេះមែនទេ?"
                    onConfirm={() => handleRestore(record.type, record.id)}
                    okText="យល់ព្រម"
                    cancelText="បោះបង់"
                >
                    <Button 
                        type="primary" 
                        icon={<RollbackOutlined />}
                        size="small"
                        loading={loading}
                    >
                        ស្តារឡើងវិញ
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <AdminLayout user={auth.user}>
            <Head title="ទិន្នន័យ" />
            
            <div style={{ padding: '24px' }}>
                <Card>
                    <Breadcrumb style={{ marginBottom: 16 }}>
                        <Breadcrumb.Item>
                            <Link href="/">
                                <HomeOutlined /> ទំព័រដើម
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>ទិន្នន័យ</Breadcrumb.Item>
                    </Breadcrumb>

                    <div style={{ marginBottom: 24 }}>
                        <Title level={3}>ទិន្នន័យ</Title>
                        <Search
                            placeholder="ស្វែងរក..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            size="large"
                            onSearch={(value) => setSearchText(value)}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ maxWidth: 400 }}
                        />
                    </div>

                    {/* Statistics Cards */}
                    <Row gutter={16} style={{ marginBottom: 24 }}>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic
                                    title="ទិន្នន័យបញ្ចូល"
                                    value={(statistics?.data_entry?.buyers || 0) + 
                                           (statistics?.data_entry?.sellers || 0) + 
                                           (statistics?.data_entry?.lands || 0)}
                                    prefix={<FileTextOutlined />}
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic
                                    title="កិច្ចសន្យា"
                                    value={(statistics?.contracts?.document_creations || 0) + 
                                           (statistics?.contracts?.sale_contracts || 0)}
                                    prefix={<FileTextOutlined />}
                                    valueStyle={{ color: '#52c41a' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic
                                    title="កម៉ីសិន"
                                    value={statistics?.commissions?.total || 0}
                                    prefix={<DollarOutlined />}
                                    valueStyle={{ color: '#faad14' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic
                                    title="អ្នកប្រើប្រាស់"
                                    value={(statistics?.users?.users || 0) + 
                                           (statistics?.users?.roles || 0)}
                                    prefix={<TeamOutlined />}
                                    valueStyle={{ color: '#722ed1' }}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Tabbed Content */}
                    <Tabs 
                        activeKey={activeTab} 
                        onChange={setActiveTab}
                        items={[
                            {
                                key: '1',
                                label: (
                                    <span>
                                        <FileTextOutlined style={{ marginRight: 8 }} />
                                        ទិន្នន័យបញ្ចូល
                                    </span>
                                ),
                                children: (
                                    <Spin spinning={loading}>
                                        <Table
                                            columns={columns}
                                            dataSource={filteredData(getDataForTab('1'))}
                                            rowKey={(record) => `${record.type}-${record.id}`}
                                            pagination={{
                                                pageSize: 10,
                                                showSizeChanger: true,
                                                showTotal: (total) => `សរុប ${total} ទិន្នន័យ`,
                                            }}
                                            locale={{
                                                emptyText: 'មិនមានទិន្នន័យក្នុងទិន្នន័យ'
                                            }}
                                        />
                                    </Spin>
                                ),
                            },
                            {
                                key: '2',
                                label: (
                                    <span>
                                        <FileTextOutlined style={{ marginRight: 8 }} />
                                        កិច្ចសន្យា
                                    </span>
                                ),
                                children: (
                                    <Spin spinning={loading}>
                                        <Table
                                            columns={columns}
                                            dataSource={filteredData(getDataForTab('2'))}
                                            rowKey={(record) => `${record.type}-${record.id}`}
                                            pagination={{
                                                pageSize: 10,
                                                showSizeChanger: true,
                                                showTotal: (total) => `សរុប ${total} ទិន្នន័យ`,
                                            }}
                                            locale={{
                                                emptyText: 'មិនមានទិន្នន័យក្នុងទិន្នន័យ'
                                            }}
                                        />
                                    </Spin>
                                ),
                            },
                            {
                                key: '3',
                                label: (
                                    <span>
                                        <DollarOutlined style={{ marginRight: 8 }} />
                                        កម៉ីសិន
                                    </span>
                                ),
                                children: (
                                    <Spin spinning={loading}>
                                        <Table
                                            columns={columns}
                                            dataSource={filteredData(getDataForTab('3'))}
                                            rowKey={(record) => `${record.type}-${record.id}`}
                                            pagination={{
                                                pageSize: 10,
                                                showSizeChanger: true,
                                                showTotal: (total) => `សរុប ${total} ទិន្នន័យ`,
                                            }}
                                            locale={{
                                                emptyText: 'មិនមានទិន្នន័យក្នុងទិន្នន័យ'
                                            }}
                                        />
                                    </Spin>
                                ),
                            },
                            {
                                key: '4',
                                label: (
                                    <span>
                                        <TeamOutlined style={{ marginRight: 8 }} />
                                        អ្នកប្រើប្រាស់
                                    </span>
                                ),
                                children: (
                                    <Spin spinning={loading}>
                                        <Table
                                            columns={columns}
                                            dataSource={filteredData(getDataForTab('4'))}
                                            rowKey={(record) => `${record.type}-${record.id}`}
                                            pagination={{
                                                pageSize: 10,
                                                showSizeChanger: true,
                                                showTotal: (total) => `សរុប ${total} ទិន្នន័យ`,
                                            }}
                                            locale={{
                                                emptyText: 'មិនមានទិន្នន័យក្នុងទិន្នន័យ'
                                            }}
                                        />
                                    </Spin>
                                ),
                            },
                            {
                                key: '5',
                                label: (
                                    <span>
                                        <AppstoreOutlined style={{ marginRight: 8 }} />
                                        ទាំងអស់
                                    </span>
                                ),
                                children: (
                                    <Spin spinning={loading}>
                                        <Table
                                            columns={columns}
                                            dataSource={filteredData(getDataForTab('5'))}
                                            rowKey={(record) => `${record.type}-${record.id}`}
                                            pagination={{
                                                pageSize: 10,
                                                showSizeChanger: true,
                                                showTotal: (total) => `សរុប ${total} ទិន្នន័យ`,
                                            }}
                                            locale={{
                                                emptyText: 'មិនមានទិន្នន័យក្នុងទិន្នន័យ'
                                            }}
                                        />
                                    </Spin>
                                ),
                            },
                        ]}
                    />
                </Card>
            </div>
        </AdminLayout>
    );
}
