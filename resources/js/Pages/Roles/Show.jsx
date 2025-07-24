import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Card,
    Button,
    Space,
    Row,
    Col,
    Typography,
    Divider,
    Tag,
    Badge,
    Table,
    Descriptions,
    Alert,
    List,
    Avatar,
    Collapse
} from 'antd';
import {
    ArrowLeftOutlined,
    EditOutlined,
    UserOutlined,
    SettingOutlined,
    CheckCircleOutlined,
    StopOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function ShowRole({ role }) {
    const getModuleDisplayName = (module) => {
        const moduleNames = {
            'dashboard': 'ផ្ទាំងគ្រប់គ្រង',
            'buyers': 'គ្រប់គ្រងអ្នកទិញ',
            'sellers': 'គ្រប់គ្រងអ្នកលក់', 
            'lands': 'គ្រប់គ្រងដី',
            'deposit_contracts': 'លិខិតកក់ប្រាក់',
            'sale_contracts': 'លិខិតទិញលក់',
            'reports': 'របាយការណ៍',
            'pre_purchase_commission': 'កម៉ីសិនមុនទិញ',
            'post_purchase_commission': 'កម៉ីសិនក្រោយទិញ',
            'users': 'គ្រប់គ្រងអ្នកប្រើប្រាស់',
            'roles': 'គ្រប់គ្រងតួនាទី',
            'permissions': 'គ្រប់គ្រងសិទ្ធិ'
        };
        return moduleNames[module] || module.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const getActionColor = (action) => {
        const colors = {
            'view': 'blue',
            'create': 'green',
            'edit': 'orange',
            'delete': 'red',
            'mark_paid': 'purple',
            'export': 'cyan',
            'manage': 'magenta',
            'toggle_status': 'gold',
            'download': 'lime',
            'document': 'geekblue',
            'monthly': 'volcano',
            'yearly': 'purple',
            'payment_status': 'pink'
        };
        return colors[action] || 'default';
    };

    // Group permissions by module
    const permissionsByModule = role.permissions?.reduce((acc, permission) => {
        if (!acc[permission.module]) {
            acc[permission.module] = [];
        }
        acc[permission.module].push(permission);
        return acc;
    }, {}) || {};

    const userColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (isActive) => (
                <Tag
                    icon={isActive ? <CheckCircleOutlined /> : <StopOutlined />}
                    color={isActive ? 'success' : 'error'}
                >
                    {isActive ? 'Active' : 'Inactive'}
                </Tag>
            ),
        },
    ];

    return (
        <AdminLayout title={`Role Details - ${role.display_name}`}>
            
            <Card>
                <div className="mb-6">
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Title level={4} className="m-0">ព័ត៌មានលម្អិតតួនាទី: {role.display_name}</Title>
                        </Col>
                        <Col>
                            <Space>
                                <Button
                                    type="primary"
                                    icon={<EditOutlined />}
                                    onClick={() => router.visit(route('roles.edit', role.id))}
                                >
                                    កែប្រែតួនាទី
                                </Button>
                                <Button
                                    icon={<ArrowLeftOutlined />}
                                    onClick={() => router.visit(route('roles.index'))}
                                >
                                    ត្រលប់ទៅតួនាទី
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </div>

                <Row gutter={24}>
                    <Col xs={24} lg={12}>
                        <Card title="ព័ត៌មានទូទៅ" size="small">
                            <Descriptions column={1} size="small">
                                <Descriptions.Item label="ឈ្មោះ">{role.name}</Descriptions.Item>
                                <Descriptions.Item label="ឈ្មោះបង្ហាញ">{role.display_name}</Descriptions.Item>
                                <Descriptions.Item label="ការពិពណ៌នា">
                                    {role.description || 'មិនមានការពិពណ៌នា'}
                                </Descriptions.Item>
                                <Descriptions.Item label="ស្ថានភាព">
                                    <Tag color={role.is_active ? 'green' : 'red'}>
                                        {role.is_active ? 'សកម្ម' : 'អសកម្ម'}
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="ចំនួនអ្នកប្រើប្រាស់">
                                    <Badge count={role.users_count} showZero color="blue" />
                                </Descriptions.Item>
                                <Descriptions.Item label="បានបង្កើត">
                                    {new Date(role.created_at).toLocaleDateString()}
                                </Descriptions.Item>
                                <Descriptions.Item label="កែប្រែចុងក្រោយ">
                                    {new Date(role.updated_at).toLocaleDateString()}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        {role.users && role.users.length > 0 && (
                            <Card title="អ្នកប្រើប្រាស់ដែលបានកំណត់" size="small">
                                {role.users && role.users.length > 0 ? (
                                    <List
                                        dataSource={role.users}
                                        renderItem={user => (
                                            <List.Item>
                                                <List.Item.Meta
                                                    avatar={<Avatar icon={<UserOutlined />} />}
                                                    title={user.name}
                                                    description={user.username}
                                                />
                                                <Tag color={user.is_active ? 'green' : 'red'}>
                                                    {user.is_active ? 'សកម្ម' : 'អសកម្ម'}
                                                </Tag>
                                            </List.Item>
                                        )}
                                    />
                                ) : (
                                    <Empty description="មិនមានអ្នកប្រើប្រាស់ត្រូវបានកំណត់ឱ្យតួនាទីនេះ" />
                                )}
                            </Card>
                        )}
                    </Col>

                    <Col xs={24} lg={12}>
                        <Card title="សិទ្ធិតួនាទី" size="small">
                            {Object.keys(permissionsByModule).length === 0 ? (
                                <Alert
                                    message="មិនមានសិទ្ធិត្រូវបានកំណត់ឱ្យតួនាទីនេះ"
                                    description="តួនាទីនេះមិនមានសិទ្ធិណាមួយទេ"
                                    type="warning"
                                    showIcon
                                />
                            ) : (
                                <Collapse size="small">
                                    {Object.entries(permissionsByModule).map(([module, permissions]) => (
                                        <Collapse.Panel 
                                            header={
                                                <Space>
                                                    <Text strong>{getModuleDisplayName(module)}</Text>
                                                    <Badge count={permissions.length} color="blue" />
                                                </Space>
                                            } 
                                            key={module}
                                        >
                                            <Row gutter={[8, 8]}>
                                                {permissions.map(permission => (
                                                    <Col key={permission.id}>
                                                        <Tag color="blue">
                                                            {permission.display_name}
                                                        </Tag>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Collapse.Panel>
                                    ))}
                                </Collapse>
                            )}
                        </Card>
                    </Col>
                </Row>
            </Card>
        </AdminLayout>
    );
}
