import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { 
    Table, 
    Button, 
    Space, 
    Popconfirm, 
    Tag, 
    Input, 
    message,
    Modal,
    Form,
    Select,
    Badge,
    Tooltip,
    Spin,
    Row,
    Col,
    Card
} from 'antd';
import { 
    SearchOutlined, 
    EditOutlined, 
    DeleteOutlined, 
    UserAddOutlined,
    EyeOutlined,
    CheckCircleOutlined,
    StopOutlined,
    ReloadOutlined,
    FilterOutlined
} from '@ant-design/icons';
import axios from 'axios';

export default function UserManagement({ auth }) {
    // Check if user has admin role using new role system
    const hasAdminAccess = auth?.user?.assigned_role?.name === 'admin' || 
                          auth?.user?.assigned_role?.name === 'manager';
    
    if (!hasAdminAccess) {
        return (
            <AdminLayout>
                <Head title="មិនមានសិទ្ធិ" />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <h1 className="text-2xl font-bold mb-4 text-red-600">មិនមានសិទ្ធិ</h1>
                                <p>អ្នកមិនមានសិទ្ធិចូលប្រើប្រាស់ទំព័រនេះទេ។</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }
    // Add Head component for proper page title
    const pageTitle = 'គ្រប់គ្រងអ្នកប្រើប្រាស់'; // User Management
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editingUser, setEditingUser] = useState(null);
    const [statusUser, setStatusUser] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        role: 'all',
        status: 'all'
    });
    const [availableRoles, setAvailableRoles] = useState([]);

    // Fetch users with filters and pagination
    const fetchUsers = async (params = {}) => {
        setLoading(true);
        try {
            const { page = 1, search = filters.search, role = filters.role, status = filters.status } = params;
            
            const response = await axios.get('/api/users', {
                params: {
                    page,
                    search,
                    role,
                    status
                }
            });
            
            setUsers(response.data.data);
            setPagination({
                current: response.data.current_page,
                pageSize: response.data.per_page,
                total: response.data.total
            });
            
            setFilters({
                search,
                role,
                status
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            message.error('មានបញ្ហាក្នុងការទាញយកទិន្នន័យអ្នកប្រើប្រាស់');
        } finally {
            setLoading(false);
        }
    };

    // Fetch available roles
    const fetchRoles = async () => {
        try {
            const response = await axios.get('/api/roles/for-select');
            setAvailableRoles(response.data.data || []);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    // Initial data load
    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    // Handle table change (pagination, filters, sorter)
    const handleTableChange = (pagination) => {
        fetchUsers({
            page: pagination.current,
            ...filters
        });
    };

    // Handle search input
    const handleSearch = (value) => {
        fetchUsers({
            search: value,
            page: 1 // Reset to first page on new search
        });
    };

    // Handle role filter change
    const handleRoleFilterChange = (value) => {
        fetchUsers({
            role: value,
            page: 1 // Reset to first page on filter change
        });
    };

    // Handle status filter change
    const handleStatusFilterChange = (value) => {
        fetchUsers({
            status: value,
            page: 1 // Reset to first page on filter change
        });
    };

    // Reset all filters
    const resetFilters = () => {
        fetchUsers({
            search: '',
            role: 'all',
            status: 'all',
            page: 1
        });
    };

    // Show modal for creating/editing user
    const showModal = (user = null) => {
        setEditingUser(user);
        setIsModalOpen(true);
        if (user) {
            form.setFieldsValue({
                name: user.name,
                username: user.username,
                role_id: user.role_id,
                is_active: user.is_active
            });
        } else {
            form.resetFields();
        }
    };

    // Show status toggle confirmation modal
    const showStatusModal = (user) => {
        setStatusUser(user);
        setIsStatusModalOpen(true);
    };

    // Handle form submission
    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            
            if (editingUser) {
                // Update existing user
                await axios.put(`/api/users/${editingUser.id}`, values);
                message.success('អ្នកប្រើប្រាស់ត្រូវបានកែប្រែដោយជោគជ័យ');
            } else {
                // Create new user
                await axios.post('/api/users', values);
                message.success('អ្នកប្រើប្រាស់ត្រូវបានបង្កើតដោយជោគជ័យ');
            }
            
            setIsModalOpen(false);
            fetchUsers(filters); // Refresh the user list
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                message.error(error.response.data.message);
            } else if (error.response && error.response.data && error.response.data.errors) {
                // Display validation errors
                const errors = error.response.data.errors;
                const errorMessages = Object.values(errors).flat();
                errorMessages.forEach(err => message.error(err));
            } else {
                message.error('មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ');
            }
        }
    };

    // Handle modal cancel
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // Handle status modal cancel
    const handleStatusCancel = () => {
        setIsStatusModalOpen(false);
        setStatusUser(null);
    };

    // Handle status toggle
    const handleStatusToggle = async () => {
        try {
            await axios.post(`/api/users/${statusUser.id}/toggle-status`);
            message.success('ស្ថានភាពអ្នកប្រើប្រាស់ត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ');
            setIsStatusModalOpen(false);
            fetchUsers(filters); // Refresh the user list
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                message.error(error.response.data.message);
            } else {
                message.error('មានបញ្ហាក្នុងការផ្លាស់ប្តូរស្ថានភាព');
            }
        }
    };

    // Handle user deletion
    const handleDelete = async (userId) => {
        try {
            await axios.delete(`/api/users/${userId}`);
            message.success('អ្នកប្រើប្រាស់ត្រូវបានលុបដោយជោគជ័យ');
            fetchUsers(filters); // Refresh the user list
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                message.error(error.response.data.message);
            } else {
                message.error('មានបញ្ហាក្នុងការលុបអ្នកប្រើប្រាស់');
            }
        }
    };

    // Helper function to get role color
    const getRoleColor = (role) => {
        switch (role) {
            case 'administrator':
                return 'red';
            case 'manager':
                return 'blue';
            case 'staff':
                return 'green';
            default:
                return 'default';
        }
    };

    // Helper function to get role name in Khmer
    const getRoleName = (role) => {
        switch (role) {
            case 'administrator':
                return 'អេតមីន';
            case 'manager':
                return 'អ្នកគ្រប់គ្រង';
            case 'staff':
                return 'បុគ្គលិក';
            default:
                return role;
        }
    };

    // Table columns definition
    const columns = [
        {
            title: 'ល.រ',
            key: 'index',
            width: 60,
            render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {
            title: 'ឈ្មោះ',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'ឈ្មោះគណនី',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'តួនាទី',
            dataIndex: 'role',
            key: 'role',
            render: (role, record) => {
                // Check if user has new role system (role_id) or old system (role)
                const displayRole = record.assigned_role ? record.assigned_role.display_name : getRoleName(role);
                const roleColor = record.assigned_role ? 'blue' : getRoleColor(role);
                
                return (
                    <Tag color={roleColor}>
                        {displayRole}
                    </Tag>
                );
            },
        },
        {
            title: 'ស្ថានភាព',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (isActive) => (
                isActive ? 
                <Badge status="success" text="សកម្ម" /> : 
                <Badge status="error" text="អសកម្ម" />
            ),
        },
        {
            title: 'សកម្មភាព',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="កែប្រែ">
                        <Button 
                            type="primary" 
                            icon={<EditOutlined />} 
                            size="small"
                            onClick={() => showModal(record)}
                            disabled={auth.user.id === record.id && !auth.user.assigned_role?.name === 'administrator'}
                        />
                    </Tooltip>
                    
                    <Tooltip title={record.is_active ? "បិទគណនី" : "បើកគណនី"}>
                        <Button
                            type={record.is_active ? "default" : "primary"}
                            icon={record.is_active ? <StopOutlined /> : <CheckCircleOutlined />}
                            size="small"
                            onClick={() => showStatusModal(record)}
                            danger={record.is_active}
                            disabled={auth.user.id === record.id}
                        />
                    </Tooltip>
                    
                    {auth.user.id !== record.id && (
                        <Tooltip title="លុប">
                            <Popconfirm
                                title="តើអ្នកពិតជាចង់លុបអ្នកប្រើប្រាស់នេះមែនទេ?"
                                description="សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ"
                                onConfirm={() => handleDelete(record.id)}
                                okText="បាទ/ចាស"
                                cancelText="ទេ"
                            >
                                <Button danger icon={<DeleteOutlined />} size="small" />
                            </Popconfirm>
                        </Tooltip>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout title="គ្រប់គ្រងអ្នកប្រើប្រាស់">
            <Head title="គ្រប់គ្រងអ្នកប្រើប្រាស់" />

            <Card className="mb-4">
                <Row gutter={16} align="middle">
                    <Col xs={24} sm={8} md={6} lg={6} xl={5}>
                        <Input.Search
                            placeholder="ស្វែងរកតាមឈ្មោះ ឬឈ្មោះគណនី"
                            allowClear
                            enterButton
                            value={filters.search}
                            onChange={(e) => setFilters({...filters, search: e.target.value})}
                            onSearch={handleSearch}
                        />
                    </Col>
                    <Col xs={24} sm={8} md={5} lg={4} xl={3}>
                        <Select
                            placeholder="តួនាទី"
                            style={{ width: '100%' }}
                            value={filters.role}
                            onChange={handleRoleFilterChange}
                            options={[
                                { value: 'all', label: 'តួនាទីទាំងអស់' },
                                { value: 'administrator', label: 'អ្នកគ្រប់គ្រងប្រព័ន្ធ' },
                                { value: 'manager', label: 'អ្នកគ្រប់គ្រង' },
                                { value: 'staff', label: 'បុគ្គលិក' },
                            ]}
                        />
                    </Col>
                    <Col xs={24} sm={8} md={5} lg={4} xl={3}>
                        <Select
                            placeholder="ស្ថានភាព"
                            style={{ width: '100%' }}
                            value={filters.status}
                            onChange={handleStatusFilterChange}
                            options={[
                                { value: 'all', label: 'ស្ថានភាពទាំងអស់' },
                                { value: 'active', label: 'សកម្ម' },
                                { value: 'inactive', label: 'អសកម្ម' },
                            ]}
                        />
                    </Col>
                    <Col xs={24} sm={8} md={4} lg={3} xl={3}>
                        <Button 
                            icon={<ReloadOutlined />} 
                            onClick={resetFilters}
                        >
                            កំណត់ឡើងវិញ
                        </Button>
                    </Col>
                    <Col xs={24} sm={16} md={4} lg={7} xl={10} className="text-right">
                        <Button 
                            type="primary" 
                            icon={<UserAddOutlined />}
                            onClick={() => showModal()}
                        >
                            បង្កើតអ្នកប្រើប្រាស់ថ្មី
                        </Button>
                    </Col>
                </Row>
            </Card>

            <Card>
                <Spin spinning={loading}>
                    <Table 
                        columns={columns} 
                        dataSource={users} 
                        rowKey="id"
                        pagination={pagination}
                        onChange={handleTableChange}
                        scroll={{ x: 'max-content' }}
                    />
                </Spin>
            </Card>

            {/* Create/Edit User Modal */}
            <Modal
                title={editingUser ? "កែប្រែអ្នកប្រើប្រាស់" : "បង្កើតអ្នកប្រើប្រាស់ថ្មី"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={editingUser ? "កែប្រែ" : "បង្កើត"}
                cancelText="បោះបង់"
                maskClosable={false}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="userForm"
                >
                    <Form.Item
                        name="name"
                        label="ឈ្មោះ"
                        rules={[{ required: true, message: 'សូមបញ្ចូលឈ្មោះ!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="username"
                        label="ឈ្មោះគណនី"
                        rules={[
                            { required: true, message: 'សូមបញ្ចូលឈ្មោះគណនី!' },
                            { min: 3, message: 'ឈ្មោះគណនីត្រូវមានយ៉ាងតិច ៣ តួអក្សរ!' },
                            { 
                                pattern: /^[a-zA-Z0-9_-]+$/, 
                                message: 'ឈ្មោះគណនីអាចមានតែអក្សរ លេខ និងសញ្ញា _ ឬ - ប៉ុណ្ណោះ!' 
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    {!editingUser && (
                        <>
                            <Form.Item
                                name="password"
                                label="ពាក្យសម្ងាត់"
                                rules={[{ required: true, message: 'សូមបញ្ចូលពាក្យសម្ងាត់!' }]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                name="password_confirmation"
                                label="បញ្ជាក់ពាក្យសម្ងាត់"
                                dependencies={['password']}
                                rules={[
                                    { required: true, message: 'សូមបញ្ជាក់ពាក្យសម្ងាត់!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('ពាក្យសម្ងាត់ទាំងពីរមិនត្រូវគ្នា!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                        </>
                    )}
                    {editingUser && (
                        <>
                            <Form.Item
                                name="password"
                                label="ពាក្យសម្ងាត់ថ្មី (ទុកទទេបើមិនចង់ផ្លាស់ប្តូរ)"
                                rules={[
                                    { 
                                        min: 6, 
                                        message: 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ!',
                                        validateTrigger: 'onChange'
                                    }
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                name="password_confirmation"
                                label="បញ្ជាក់ពាក្យសម្ងាត់ថ្មី"
                                dependencies={['password']}
                                rules={[
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!getFieldValue('password') || !value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('ពាក្យសម្ងាត់ទាំងពីរមិនត្រូវគ្នា!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                        </>
                    )}
                    <Form.Item
                        name="role_id"
                        label="តួនាទី"
                        rules={[{ required: true, message: 'សូមជ្រើសរើសតួនាទី!' }]}
                    >
                        <Select
                            placeholder="ជ្រើសរើសតួនាទី"
                            disabled={editingUser && auth.user.id === editingUser.id}
                            showSearch
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {availableRoles.map(role => (
                                <Select.Option key={role.id} value={role.id}>
                                    {role.display_name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    {editingUser && (
                        <Form.Item
                            name="is_active"
                            label="ស្ថានភាព"
                            valuePropName="checked"
                            initialValue={true}
                        >
                            <Select
                                disabled={auth.user.id === editingUser.id}
                            >
                                <Select.Option value={true}>សកម្ម</Select.Option>
                                <Select.Option value={false}>អសកម្ម</Select.Option>
                            </Select>
                        </Form.Item>
                    )}
                </Form>
            </Modal>

            {/* Status Toggle Confirmation Modal */}
            <Modal
                title="បញ្ជាក់ការផ្លាស់ប្តូរស្ថានភាព"
                open={isStatusModalOpen}
                onOk={handleStatusToggle}
                onCancel={handleStatusCancel}
                okText="បញ្ជាក់"
                cancelText="បោះបង់"
            >
                {statusUser && (
                    <p>
                        តើអ្នកពិតជាចង់{statusUser.is_active ? 'បិទ' : 'បើក'}គណនីរបស់ 
                        <strong> {statusUser.name}</strong> ({statusUser.username}) មែនទេ?
                    </p>
                )}
            </Modal>
        </AdminLayout>
    );
}
