import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Card,
    Form,
    Input,
    Button,
    Space,
    Row,
    Col,
    Typography,
    Divider,
    Checkbox,
    Collapse,
    message,
    Alert
} from 'antd';
import {
    SaveOutlined,
    ArrowLeftOutlined,
    SettingOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

export default function CreateRole({ permissions }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const formData = {
                ...values,
                permissions: selectedPermissions
            };

            router.post(route('roles.store'), formData, {
                onSuccess: () => {
                    message.success('Role created successfully');
                },
                onError: (errors) => {
                    message.error('Please check the form for errors');
                },
                onFinish: () => setLoading(false)
            });
        } catch (error) {
            message.error('Failed to create role');
            setLoading(false);
        }
    };

    const handlePermissionChange = (modulePermissions, checked) => {
        const permissionIds = modulePermissions.map(p => p.id);
        if (checked) {
            setSelectedPermissions(prev => [...new Set([...prev, ...permissionIds])]);
        } else {
            setSelectedPermissions(prev => prev.filter(id => !permissionIds.includes(id)));
        }
    };

    const handleSinglePermissionChange = (permissionId, checked) => {
        if (checked) {
            setSelectedPermissions(prev => [...prev, permissionId]);
        } else {
            setSelectedPermissions(prev => prev.filter(id => id !== permissionId));
        }
    };

    const isModuleFullySelected = (modulePermissions) => {
        return modulePermissions.every(p => selectedPermissions.includes(p.id));
    };

    const isModulePartiallySelected = (modulePermissions) => {
        return modulePermissions.some(p => selectedPermissions.includes(p.id)) && 
               !isModuleFullySelected(modulePermissions);
    };

    const getModuleDisplayName = (module) => {
        const moduleNames = {
            'dashboard': 'ផ្ទាំងគ្រប់គ្រង',
            'buyers': 'គ្រប់គ្រងអ្នកទិញ',
            'sellers': 'គ្រប់គ្រងអ្នកលក់', 
            'lands': 'គ្រប់គ្រងដី',
            'deposit_contracts': 'លិខិតកក់ប្រាក់',
            'sale_contracts': 'លិខិតទិញលក់',
            'reports': 'របាយការណ៍',
            'pre_purchase_commission': 'កុំស្យុងមុនទិញ',
            'post_purchase_commission': 'កុំស្យុងក្រោយទិញ',
            'users': 'គ្រប់គ្រងអ្នកប្រើប្រាស់',
            'roles': 'គ្រប់គ្រងតួនាទី',
            'permissions': 'គ្រប់គ្រងសិទ្ធិ'
        };
        return moduleNames[module] || module.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <AdminLayout title="Create New Role">
            <Head title="Create Role" />
            
            <Card>
                <div className="mb-6">
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Title level={4} className="m-0">បង្កើតតួនាទីថ្មី</Title>
                        </Col>
                        <Col>
                            <Button
                                icon={<ArrowLeftOutlined />}
                                onClick={() => router.visit(route('roles.index'))}
                            >
                                ត្រលប់ទៅតួនាទី
                            </Button>
                        </Col>
                    </Row>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    requiredMark={false}
                >
                    <Row gutter={24}>
                        <Col xs={24} lg={12}>
                            <Card title="ព័ត៌មានមូលដ្ឋាន" size="small">
                                <Form.Item
                                    label="ឈ្មោះតួនាទី"
                                    name="name"
                                    rules={[
                                        { required: true, message: 'សូមបញ្ចូលឈ្មោះតួនាទី' },
                                        { max: 255, message: 'ឈ្មោះតួនាទីត្រូវតែតិចជាង 255 តួអក្សរ' }
                                    ]}
                                >
                                    <Input placeholder="ឧ: manager, staff, viewer" />
                                </Form.Item>

                                <Form.Item
                                    label="ឈ្មោះបង្ហាញ"
                                    name="display_name"
                                    rules={[
                                        { required: true, message: 'សូមបញ្ចូលឈ្មោះបង្ហាញ' },
                                        { max: 255, message: 'ឈ្មោះបង្ហាញត្រូវតែតិចជាង 255 តួអក្សរ' }
                                    ]}
                                >
                                    <Input placeholder="ឧ: អ្នកគ្រប់គ្រង, បុគ្គលិក, អ្នកមើល" />
                                </Form.Item>

                                <Form.Item
                                    label="ការពិពណ៌នា"
                                    name="description"
                                >
                                    <TextArea 
                                        rows={4} 
                                        placeholder="ពិពណ៌នាអំពីតួនាទី និងការទទួលខុសត្រូវ..."
                                    />
                                </Form.Item>
                            </Card>
                        </Col>

                        <Col xs={24} lg={12}>
                            <Card 
                                title={
                                    <Space>
                                        <SettingOutlined />
                                        <span>សិទ្ធិ ({selectedPermissions.length} បានជ្រើសរើស)</span>
                                    </Space>
                                } 
                                size="small"
                            >
                                <Alert
                                    message="ជ្រើសរើសសិទ្ធិដែលតួនាទីនេះគួរមាន"
                                    description="អ្នកប្រើប្រាស់ដែលត្រូវបានកំណត់ឱ្យតួនាទីនេះនឹងទទួលបានសិទ្ធិទាំងនេះ។"
                                    type="info"
                                    showIcon
                                    className="mb-4"
                                />

                                <Collapse size="small" ghost>
                                    {Object.entries(permissions || {}).map(([module, modulePermissions]) => (
                                        <Panel
                                            header={
                                                <div className="flex items-center justify-between">
                                                    <Checkbox
                                                        checked={isModuleFullySelected(modulePermissions)}
                                                        indeterminate={isModulePartiallySelected(modulePermissions)}
                                                        onChange={(e) => handlePermissionChange(modulePermissions, e.target.checked)}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Text strong>{getModuleDisplayName(module)}</Text>
                                                    </Checkbox>
                                                    <Text type="secondary">
                                                        {modulePermissions.filter(p => selectedPermissions.includes(p.id)).length}/{modulePermissions.length}
                                                    </Text>
                                                </div>
                                            }
                                            key={module}
                                        >
                                            <div className="pl-6">
                                                <Row gutter={[16, 8]}>
                                                    {modulePermissions.map(permission => (
                                                        <Col xs={24} sm={12} key={permission.id}>
                                                            <Checkbox
                                                                checked={selectedPermissions.includes(permission.id)}
                                                                onChange={(e) => handleSinglePermissionChange(permission.id, e.target.checked)}
                                                            >
                                                                <div>
                                                                    <div className="font-medium">{permission.display_name}</div>
                                                                    {permission.description && (
                                                                        <div className="text-xs text-gray-500">{permission.description}</div>
                                                                    )}
                                                                </div>
                                                            </Checkbox>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </div>
                                        </Panel>
                                    ))}
                                </Collapse>
                            </Card>
                        </Col>
                    </Row>

                    <Divider />

                    <Row justify="end">
                        <Col>
                            <Space>
                                <Button 
                                    onClick={() => router.visit(route('roles.index'))}
                                >
                                    បោះបង់
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    icon={<SaveOutlined />}
                                >
                                    បង្កើតតួនាទី
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </AdminLayout>
    );
}
