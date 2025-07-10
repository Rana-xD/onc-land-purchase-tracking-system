import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Table, Button, Input, Space, Popconfirm, Tag, 
    Typography, Card, Row, Col, Breadcrumb, message
} from 'antd';
import { 
    SearchOutlined, PlusOutlined, EditOutlined, 
    DeleteOutlined, FileAddOutlined, EyeOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

export default function BuyersList({ buyers, pagination }) {
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [data, setData] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    // Removed advanced filters as requested

    useEffect(() => {
        if (buyers) {
            setData(buyers);
        }
        
        if (pagination) {
            setPaginationInfo({
                current: pagination.current_page,
                pageSize: pagination.per_page,
                total: pagination.total
            });
        }
    }, [buyers, pagination]);

    const handleSearch = (value) => {
        setSearchText(value);
        fetchData(1, paginationInfo.pageSize, value);
    };

    const handleTableChange = (pagination) => {
        fetchData(pagination.current, pagination.pageSize, searchText);
    };

    const fetchData = async (page, pageSize, search = '') => {
        setLoading(true);
        try {
            const response = await axios.get('/api/buyers', {
                params: {
                    page,
                    per_page: pageSize,
                    search
                }
            });
            
            // Safely set data with fallback to empty array if data is undefined
            setData(response.data?.data || []);
            
            // Safely set pagination info with fallbacks
            setPaginationInfo({
                current: response.data?.meta?.current_page || page,
                pageSize: response.data?.meta?.per_page || pageSize,
                total: response.data?.meta?.total || 0
            });
        } catch (error) {
            console.error('Error fetching buyers:', error);
            message.error('មានបញ្ហាក្នុងការទាញយកទិន្នន័យអ្នកទិញ');
            // Set empty data and default pagination on error
            setData([]);
            setPaginationInfo({
                current: page,
                pageSize: pageSize,
                total: 0
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`/api/buyers/${id}`);
            message.success('បានលុបទិន្នន័យអ្នកទិញដោយជោគជ័យ');
            fetchData(paginationInfo.current, paginationInfo.pageSize, searchText);
        } catch (error) {
            console.error('Error deleting buyer:', error);
            message.error('មានបញ្ហាក្នុងការលុបទិន្នន័យអ្នកទិញ');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'ឈ្មោះ',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Link href={route('data-entry.buyers.show', record.id)}>
                    {text}
                </Link>
            ),
        },
        {
            title: 'ភេទ',
            dataIndex: 'sex',
            key: 'sex',
            render: (sex) => (
                <Tag color={sex === 'male' ? 'blue' : 'pink'}>
                    {sex === 'male' ? 'ប្រុស' : 'ស្រី'}
                </Tag>
            ),
        },
        {
            title: 'ថ្ងៃខែឆ្នាំកំណើត',
            dataIndex: 'date_of_birth',
            key: 'date_of_birth',
            render: (dateString) => {
                if (!dateString) return '';
                // Format date as YYYY-MM-DD
                const date = new Date(dateString);
                return date.toISOString().split('T')[0];
            },
        },
        {
            title: 'លេខអត្តសញ្ញាណប័ណ្ណ',
            dataIndex: 'identity_number',
            key: 'identity_number',
        },
        {
            title: 'លេខទូរស័ព្ទ',
            dataIndex: 'phone_number',
            key: 'phone_number',
        },
        {
            title: 'សកម្មភាព',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button 
                        type="default" 
                        icon={<EditOutlined />} 
                        size="small"
                        onClick={() => router.visit(route('data-entry.buyers.edit', record.id))}
                    />
                    <Popconfirm
                        title="តើអ្នកពិតជាចង់លុបទិន្នន័យនេះមែនទេ?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="យល់ព្រម"
                        cancelText="បោះបង់"
                    >
                        <Button 
                            type="default" 
                            danger 
                            icon={<DeleteOutlined />} 
                            size="small"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Head title="បញ្ជីអ្នកទិញ" />
            
            <div className="buyers-list">
                <Breadcrumb
                    items={[
                        { title: <Link href={route('data-entry.index')}>ជ្រើសរើសប្រភេទទិន្នន័យ</Link> },
                        { title: 'បញ្ជីអ្នកទិញ' },
                    ]}
                    className="mb-6"
                />
                
                <Card>
                    <Row justify="space-between" align="middle" className="mb-4">
                        <Col>
                            <Title level={4} className="khmer-heading m-0">បញ្ជីអ្នកទិញ</Title>
                        </Col>
                        <Col>
                            <Space size="middle" align="end">
                                <Input.Search
                                    placeholder="ស្វែងរកតាមឈ្មោះ ឬលេខទូរស័ព្ទ"
                                    onSearch={handleSearch}
                                    style={{ width: 250 }}
                                    allowClear
                                />
                                <Link href={route('data-entry.buyers.create')}>
                                    <Button type="primary" icon={<PlusOutlined />}>
                                        បន្ថែមថ្មី
                                    </Button>
                                </Link>
                            </Space>
                        </Col>
                    </Row>
                    
                    {/* Advanced filter section removed as requested */}
                    
                    <Table
                        columns={columns}
                        dataSource={data}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            current: paginationInfo.current,
                            pageSize: paginationInfo.pageSize,
                            total: paginationInfo.total,
                            showSizeChanger: true,
                            showTotal: (total, range) => `${range[0]}-${range[1]} នៃ ${total} ធាតុ`,
                        }}
                        onChange={handleTableChange}
                    />
                </Card>
            </div>
        </>
    );
}

BuyersList.layout = page => <AdminLayout title="បញ្ជីអ្នកទិញ" children={page} />
