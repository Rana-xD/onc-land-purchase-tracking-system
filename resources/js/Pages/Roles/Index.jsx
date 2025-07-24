import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Table,
    Button,
    Space,
    Input,
    Select,
    Card,
    Tag,
    Popconfirm,
    message,
    Tooltip,
    Badge,
    Row,
    Col,
    Typography
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    SearchOutlined,
    ReloadOutlined,
    SettingOutlined,
    UserOutlined,
    CheckCircleOutlined,
    StopOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

export default function RolesIndex({ roles: initialRoles }) {
    const [roles, setRoles] = useState(initialRoles || []);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState(null);

    const fetchRoles = async (params = {}) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/roles', {
                params: {
                    search: searchText,
                    status: statusFilter,
                    ...params
                }
            });
            setRoles(response.data.data || response.data);
        } catch (error) {
            message.error('Failed to fetch roles');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (roleId) => {
        try {
            await axios.delete(`/api/roles/${roleId}`);
            message.success('Role deleted successfully');
            fetchRoles();
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to delete role');
        }
    };

    const handleToggleStatus = async (roleId) => {
        try {
            await axios.post(`/api/roles/${roleId}/toggle-status`);
            message.success('Role status updated successfully');
            fetchRoles();
        } catch (error) {
            message.error('Failed to update role status');
        }
    };

    const handleSearch = () => {
        fetchRoles();
    };

    const handleReset = () => {
        setSearchText('');
        setStatusFilter(null);
        fetchRoles();
    };

    const columns = [
        {
            title: 'ឈ្មោះតួនាទី',
            dataIndex: 'display_name',
            key: 'display_name',
            render: (text, record) => (
                <div>
                    <div className="font-medium">{text}</div>
                    <div className="text-gray-500 text-sm">({record.name})</div>
                </div>
            ),
        },
        {
            title: 'ការពិពណ៌នា',
            dataIndex: 'description',
            key: 'description',
            render: (text) => text || '-',
        },
        {
            title: 'អ្នកប្រើប្រាស់',
            dataIndex: 'users_count',
            key: 'users_count',
            render: (count) => (
                <Badge count={count || 0} showZero>
                    <UserOutlined style={{ fontSize: '16px' }} />
                </Badge>
            ),
        },
        {
            title: 'ស្ថានភាព',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (isActive) => (
                <Tag
                    icon={isActive ? <CheckCircleOutlined /> : <StopOutlined />}
                    color={isActive ? 'success' : 'error'}
                >
                    {isActive ? 'សកម្ម' : 'អសកម្ម'}
                </Tag>
            ),
        },
        {
            title: 'សកម្មភាព',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="View Details">
                        <Link href={route('roles.show', record.id)}>
                            <Button
                                type="text"
                                icon={<EyeOutlined />}
                                size="small"
                            />
                        </Link>
                    </Tooltip>
                    <Tooltip title="Edit Role">
                        <Link href={route('roles.edit', record.id)}>
                            <Button
                                type="text"
                                icon={<EditOutlined />}
                                size="small"
                            />
                        </Link>
                    </Tooltip>
                    <Tooltip title={record.is_active ? 'Deactivate' : 'Activate'}>
                        <Popconfirm
                            title={`Are you sure you want to ${record.is_active ? 'deactivate' : 'activate'} this role?`}
                            onConfirm={() => handleToggleStatus(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="text"
                                icon={record.is_active ? <StopOutlined /> : <CheckCircleOutlined />}
                                size="small"
                                danger={record.is_active}
                            />
                        </Popconfirm>
                    </Tooltip>
                    <Tooltip title="Delete Role">
                        <Popconfirm
                            title="Are you sure you want to delete this role?"
                            description="This action cannot be undone."
                            onConfirm={() => handleDelete(record.id)}
                            okText="Yes"
                            cancelText="No"
                            okType="danger"
                        >
                            <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                size="small"
                                danger
                                disabled={record.users_count > 0}
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout title="Role & Permission Management">
            <Head title="Roles & Permissions" />
            
            <Card>
                <div className="mb-6">
                    <Row justify="space-between" align="middle" className="mb-4">
                        <Col>
                            <Title level={4} className="m-0">តួនាទី និង សិទ្ធិ</Title>
                        </Col>
                        <Col>
                            <Link href={route('roles.create')}>
                                <Button type="primary" icon={<PlusOutlined />}>
                                    បង្កើតតួនាទីថ្មី
                                </Button>
                            </Link>
                        </Col>
                    </Row>

                    <Row gutter={16} className="mb-4">
                        <Col xs={24} sm={12} md={8}>
                            <Input
                                placeholder="ស្វែងរកតួនាទី..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onPressEnter={handleSearch}
                                prefix={<SearchOutlined />}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Select
                                placeholder="ត្រងតាមស្ថានភាព"
                                value={statusFilter}
                                onChange={setStatusFilter}
                                allowClear
                                style={{ width: '100%' }}
                            >
                                <Option value={true}>សកម្ម</Option>
                                <Option value={false}>អសកម្ម</Option>
                            </Select>
                        </Col>
                        <Col xs={24} sm={24} md={10}>
                            <Space>
                                <Button
                                    type="primary"
                                    icon={<SearchOutlined />}
                                    onClick={handleSearch}
                                >
                                    ស្វែងរក
                                </Button>
                                <Button
                                    icon={<ReloadOutlined />}
                                    onClick={handleReset}
                                >
                                    កំណត់ឡើងវិញ
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </div>

                <Table
                    columns={columns}
                    dataSource={roles}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} នៃ ${total} តួនាទី`,
                    }}
                    scroll={{ x: 800 }}
                />
            </Card>
        </AdminLayout>
    );
}
