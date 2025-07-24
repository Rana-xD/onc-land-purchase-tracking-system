import React, { useState, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
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
    Select
} from 'antd';
import { 
    SearchOutlined, 
    EditOutlined, 
    DeleteOutlined, 
    UserAddOutlined,
    EyeOutlined
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

export default function UsersIndex({ users, auth }) {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editingUserId, setEditingUserId] = useState(null);

    const handleSearch = (
        selectedKeys,
        confirm,
        dataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`ស្វែងរក ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        ស្វែងរក
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        សម្អាត
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        បិទ
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const showModal = (user) => {
        setIsModalOpen(true);
        if (user) {
            setEditingUserId(user.id);
            form.setFieldsValue({
                name: user.name,
                email: user.email,
                role_id: user.role_id
            });
        } else {
            setEditingUserId(null);
            form.resetFields();
        }
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            if (editingUserId) {
                router.put(route('users.update', editingUserId), values, {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        message.success('អ្នកប្រើប្រាស់ត្រូវបានកែប្រែដោយជោគជ័យ');
                    }
                });
            } else {
                router.post(route('users.store'), values, {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        message.success('អ្នកប្រើប្រាស់ត្រូវបានបង្កើតដោយជោគជ័យ');
                    }
                });
            }
        });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        router.delete(route('users.destroy', id), {
            onSuccess: () => {
                message.success('អ្នកប្រើប្រាស់ត្រូវបានលុបដោយជោគជ័យ');
            }
        });
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'administrator':
                return 'red';
            case 'manager':
                return 'blue';
            default:
                return 'green';
        }
    };

    const getRoleName = (role) => {
        switch (role) {
            case 'administrator':
                return 'អេតមីន';
            case 'manager':
                return 'អ្នកគ្រប់គ្រង';
            default:
                return 'បុគ្គលិក';
        }
    };

    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            width: 50,
            render: (_, __, index) => index + 1,
        },
        {
            title: 'ឈ្មោះ',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'អ៊ីមែល',
            dataIndex: 'email',
            key: 'email',
            width: 250,
            ...getColumnSearchProps('email'),
        },
        {
            title: 'តួនាទី',
            dataIndex: 'role',
            key: 'role',
            width: 150,
            render: (role) => (
                <Tag color={getRoleColor(role)}>
                    {getRoleName(role)}
                </Tag>
            ),
            filters: [
                { text: 'អេតមីន', value: 'administrator' },
                { text: 'អ្នកគ្រប់គ្រង', value: 'manager' },
                { text: 'បុគ្គលិក', value: 'staff' },
            ],
            onFilter: (value, record) => record.role === value,
        },
        {
            title: 'សកម្មភាព',
            key: 'action',
            width: 200,
            render: (_, record) => (
                <Space size="small">
                    <Link href={route('users.show', record.id)}>
                        <Button type="primary" icon={<EyeOutlined />} size="small">
                            មើល
                        </Button>
                    </Link>
                    {(auth.user.assigned_role?.name === 'administrator' || (auth.user.assigned_role?.name === 'manager' && record.assigned_role?.name === 'staff')) && (
                        <Button 
                            type="default" 
                            icon={<EditOutlined />} 
                            size="small"
                            onClick={() => showModal(record)}
                        >
                            កែប្រែ
                        </Button>
                    )}
                    {(auth.user.assigned_role?.name === 'administrator' || (auth.user.assigned_role?.name === 'manager' && record.assigned_role?.name === 'staff')) && (
                        <Popconfirm
                            title="តើអ្នកពិតជាចង់លុបអ្នកប្រើប្រាស់នេះមែនទេ?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="បាទ/ចាស"
                            cancelText="ទេ"
                        >
                            <Button danger icon={<DeleteOutlined />} size="small">
                                លុប
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout title="គ្រប់គ្រងអ្នកប្រើប្រាស់">
            <Head title="គ្រប់គ្រងអ្នកប្រើប្រាស់" />

            <div className="mb-4 flex justify-end">
                <Button 
                    type="primary" 
                    icon={<UserAddOutlined />}
                    onClick={() => showModal()}
                >
                    បង្កើតអ្នកប្រើប្រាស់ថ្មី
                </Button>
            </div>

            <Table 
                columns={columns} 
                dataSource={users} 
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 'max-content' }}
            />

            <Modal
                title={editingUserId ? "កែប្រែអ្នកប្រើប្រាស់" : "បង្កើតអ្នកប្រើប្រាស់ថ្មី"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={editingUserId ? "កែប្រែ" : "បង្កើត"}
                cancelText="បោះបង់"
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
                        name="email"
                        label="អ៊ីមែល"
                        rules={[
                            { required: true, message: 'សូមបញ្ចូលអ៊ីមែល!' },
                            { type: 'email', message: 'អ៊ីមែលមិនត្រឹមត្រូវ!' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    {!editingUserId && (
                        <Form.Item
                            name="password"
                            label="ពាក្យសម្ងាត់"
                            rules={[{ required: true, message: 'សូមបញ្ចូលពាក្យសម្ងាត់!' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                    )}
                    <Form.Item
                        name="role"
                        label="តួនាទី"
                        rules={[{ required: true, message: 'សូមជ្រើសរើសតួនាទី!' }]}
                    >
                        <Select>
                            <Select.Option value="administrator">អ្នកគ្រប់គ្រងប្រព័ន្ធ</Select.Option>
                            <Select.Option value="manager">អ្នកគ្រប់គ្រង</Select.Option>
                            <Select.Option value="staff">បុគ្គលិក</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </AdminLayout>
    );
}
