import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, Descriptions, Table, Tag, Divider } from 'antd';
import dayjs from 'dayjs';

export default function UserShow({ user, activities, auth }) {
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

    const activityColumns = [
        {
            title: 'សកម្មភាព',
            dataIndex: 'action',
            key: 'action',
        },
        {
            title: 'ពិពណ៌នា',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'អាស័យដ្ឋាន IP',
            dataIndex: 'ip_address',
            key: 'ip_address',
        },
        {
            title: 'កាលបរិច្ឆេទ',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm:ss'),
        },
    ];

    return (
        <AdminLayout title={`ព័ត៌មានអ្នកប្រើប្រាស់: ${user.name}`}>
            <Head title={`ព័ត៌មានអ្នកប្រើប្រាស់: ${user.name}`} />

            <Card className="mb-6">
                <Descriptions title="ព័ត៌មានលម្អិត" bordered layout="vertical">
                    <Descriptions.Item label="ឈ្មោះ">{user.name}</Descriptions.Item>
                    <Descriptions.Item label="អ៊ីមែល">{user.email}</Descriptions.Item>
                    <Descriptions.Item label="តួនាទី">
                        <Tag color="blue">
                            {user.assigned_role ? user.assigned_role.display_name : 'មិនបានកំណត់'}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="បង្កើតនៅ">
                        {dayjs(user.created_at).format('DD/MM/YYYY HH:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="កែប្រែចុងក្រោយនៅ">
                        {dayjs(user.updated_at).format('DD/MM/YYYY HH:mm:ss')}
                    </Descriptions.Item>
                </Descriptions>

                <div className="mt-4 flex justify-end">
                    <Link href={route('users.index')} className="mr-2">
                        <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                            ត្រឡប់ក្រោយ
                        </button>
                    </Link>
                    {(auth.user.assigned_role?.name === 'administrator' || (auth.user.assigned_role?.name === 'manager' && user.assigned_role?.name === 'staff')) && (
                        <Link href={route('users.edit', user.id)}>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                កែប្រែ
                            </button>
                        </Link>
                    )}
                </div>
            </Card>

            <Divider orientation="left">សកម្មភាពថ្មីៗ</Divider>
            
            <Table 
                columns={activityColumns} 
                dataSource={activities} 
                rowKey="id"
                pagination={false}
                scroll={{ x: 'max-content' }}
            />
        </AdminLayout>
    );
}
