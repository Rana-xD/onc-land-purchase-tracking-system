import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Table, Card, Input, DatePicker, Select, Button, Tag, Space, Typography } from 'antd';
import { SearchOutlined, ReloadOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/km';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function Index({ auth, activities, users, filters }) {
  const [searchFilters, setSearchFilters] = useState(filters);

  const handleSearch = () => {
    window.location.href = route('activities.index', searchFilters);
  };

  const handleReset = () => {
    setSearchFilters({});
    window.location.href = route('activities.index');
  };

  const columns = [
    {
      title: 'អ្នកប្រើប្រាស់',
      dataIndex: 'user',
      key: 'user',
      render: (user) => user?.name || 'មិនមានអ្នកប្រើប្រាស់',
    },
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
      <Head title="កំណត់ត្រាសកម្មភាព" />

      <Card className="mb-6">
        <Title level={4}>កំណត់ត្រាសកម្មភាពអ្នកប្រើប្រាស់</Title>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Text strong>អ្នកប្រើប្រាស់</Text>
            <Select
              placeholder="ជ្រើសរើសអ្នកប្រើប្រាស់"
              className="w-full"
              allowClear
              value={searchFilters.user_id}
              onChange={(value) => setSearchFilters({ ...searchFilters, user_id: value })}
            >
              {users.map((user) => (
                <Select.Option key={user.id} value={user.id.toString()}>
                  {user.name}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div>
            <Text strong>សកម្មភាព</Text>
            <Input 
              placeholder="ស្វែងរកសកម្មភាព" 
              value={searchFilters.action}
              onChange={(e) => setSearchFilters({ ...searchFilters, action: e.target.value })}
              prefix={<SearchOutlined />}
            />
          </div>
          <div className="md:col-span-2">
            <Text strong>កាលបរិច្ឆេទ</Text>
            <RangePicker 
              className="w-full"
              locale={{ locale: 'km' }}
              value={[
                searchFilters.date_from ? dayjs(searchFilters.date_from) : null,
                searchFilters.date_to ? dayjs(searchFilters.date_to) : null
              ]}
              onChange={(dates) => {
                setSearchFilters({
                  ...searchFilters,
                  date_from: dates?.[0]?.format('YYYY-MM-DD') || undefined,
                  date_to: dates?.[1]?.format('YYYY-MM-DD') || undefined,
                });
              }}
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              កំណត់ឡើងវិញ
            </Button>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              ស្វែងរក
            </Button>
          </Space>
        </div>
      </Card>

      <Card>
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
            window.location.href = `${activities.meta.path}?page=${pagination.current}${
              searchFilters.user_id ? `&user_id=${searchFilters.user_id}` : ''
            }${searchFilters.action ? `&action=${searchFilters.action}` : ''}${
              searchFilters.date_from ? `&date_from=${searchFilters.date_from}` : ''
            }${searchFilters.date_to ? `&date_to=${searchFilters.date_to}` : ''}`;
          }}
        />
      </Card>
    </AdminLayout>
  );
}
