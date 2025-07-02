import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Table, Card, Tag, Typography } from 'antd';
import { UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/km';

const { Title } = Typography;

export default function MyActivities({ auth, activities }) {
  const columns = [
    {
      title: 'សកម្មភាព',
      dataIndex: 'action',
      key: 'action',
      render: (action) => (
        <Tag color="blue">{action}</Tag>
      ),
    },
    {
      title: 'ការពិពណ៌នា',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'អាសយដ្ឋាន IP',
      dataIndex: 'ip_address',
      key: 'ip_address',
    },
    {
      title: 'កាលបរិច្ឆេទ',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => dayjs(date).locale('km').format('DD MMMM YYYY HH:mm:ss'),
    },
  ];

  return (
    <AdminLayout>
      <Head title="សកម្មភាពរបស់ខ្ញុំ" />

      <Card>
        <Title level={4}>សកម្មភាពរបស់ខ្ញុំ</Title>
        <Table
          columns={columns}
          dataSource={activities.data}
          rowKey="id"
          pagination={{
            current: activities.meta.current_page,
            pageSize: activities.meta.per_page,
            total: activities.meta.total,
            showSizeChanger: false,
            showTotal: (total) => `សរុប ${total} កំណត់ត្រា`,
          }}
          onChange={(pagination) => {
            window.location.href = `${activities.meta.path}?page=${pagination.current}`;
          }}
        />
      </Card>
    </AdminLayout>
  );
}
