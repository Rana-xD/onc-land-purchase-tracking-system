import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Table, Button, Input, Space, Popconfirm, Tag, 
    Typography, Card, Row, Col, Breadcrumb, message, Tooltip
} from 'antd';
import { 
    SearchOutlined, PlusOutlined, EditOutlined, 
    DeleteOutlined, FileAddOutlined, EyeOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

export default function SellersList({ sellers, pagination }) {
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
        if (sellers) {
            setData(sellers);
        }
        
        if (pagination) {
            setPaginationInfo({
                current: pagination.current_page,
                pageSize: pagination.per_page,
                total: pagination.total
            });
        }
    }, [sellers, pagination]);

    const handleSearch = (value) => {
        setSearchText(value);
        fetchData(1, paginationInfo.pageSize, value);
    };

    const handleTableChange = (pagination) => {
        // Update the pagination info state to persist the page size
        setPaginationInfo(prev => ({
            ...prev,
            current: pagination.current,
            pageSize: pagination.pageSize
        }));
        
        // Fetch data with the new pagination parameters
        fetchData(pagination.current, pagination.pageSize, searchText);
    };

    // Removed filter handling functions as requested

    const fetchData = async (page, pageSize, search = '') => {
        setLoading(true);
        try {
            // Store the requested page size in a variable to ensure it's used consistently
            const requestedPageSize = pageSize || paginationInfo.pageSize || 10;
            
            const response = await axios.get('/api/sellers', {
                params: {
                    page,
                    per_page: requestedPageSize,
                    search
                }
            });
            
            // Set data safely
            if (response.data && response.data.data) {
                setData(response.data.data);
            } else {
                setData([]);
            }
            
            // Set pagination info safely, preserving the requested page size
            if (response.data && response.data.meta) {
                setPaginationInfo({
                    current: response.data.meta.current_page || 1,
                    pageSize: requestedPageSize, // Use the requested page size, not what comes back from API
                    total: response.data.meta.total || 0
                });
            } else {
                setPaginationInfo({
                    current: 1,
                    pageSize: requestedPageSize, // Use the requested page size as fallback
                    total: 0
                });
            }
        } catch (error) {
            console.error('Error fetching sellers:', error);
            message.error('មានបញ្ហាក្នុងការទាញយកទិន្នន័យអ្នកលក់');
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`/api/sellers/${id}`);
            message.success('បានលុបទិន្នន័យអ្នកលក់ដោយជោគជ័យ');
            fetchData(paginationInfo.current, paginationInfo.pageSize, searchText);
        } catch (error) {
            console.error('Error deleting seller:', error);
            message.error('មានបញ្ហាក្នុងការលុបទិន្នន័យអ្នកលក់');
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
                <Link href={route('data-entry.sellers.show', record.id)}>
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
                    <Tooltip title="កែប្រែព័ត៌មានអ្នកលក់">
                        <Button 
                            type="default" 
                            icon={<EditOutlined />} 
                            size="small"
                            onClick={() => router.visit(route('data-entry.sellers.edit', record.id))}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="តើអ្នកពិតជាចង់លុបទិន្នន័យនេះមែនទេ?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="យល់ព្រម"
                        cancelText="បោះបង់"
                    >
                        <Tooltip title="លុបព័ត៌មានអ្នកលក់">
                            <Button 
                                type="default" 
                                danger 
                                icon={<DeleteOutlined />} 
                                size="small"
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Head title="បញ្ជីអ្នកលក់" />
            
            <div className="sellers-list">
                <Breadcrumb
                    items={[
                        { title: <Link href={route('data-entry.index')}>ជ្រើសរើសប្រភេទទិន្នន័យ</Link> },
                        { title: 'បញ្ជីអ្នកលក់' },
                    ]}
                    className="mb-6"
                />
                
                <Card>
                    <Row justify="space-between" align="middle" className="mb-4">
                        <Col>
                            <Title level={4} className="khmer-heading m-0">បញ្ជីអ្នកលក់</Title>
                        </Col>
                        <Col>
                            <Space>
                                <Input.Search
                                    placeholder="ស្វែងរក..."
                                    allowClear
                                    enterButton={<SearchOutlined />}
                                    onSearch={handleSearch}
                                    style={{ width: 250 }}
                                />
                                <Tooltip title="បន្ថែមអ្នកលក់ថ្មី">
                                    <Button 
                                        type="primary" 
                                        icon={<PlusOutlined />}
                                        onClick={() => router.visit(route('data-entry.sellers.create'))}
                                    >
                                        បន្ថែមថ្មី
                                    </Button>
                                </Tooltip>
                            </Space>
                        </Col>
                    </Row>
                    
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
                            pageSizeOptions: ['10', '20', '50','100'],
                            showTotal: (total, range) => `${range[0]}-${range[1]} នៃ ${total} ធាតុ`,
                        }}
                        onChange={handleTableChange}
                    />
                </Card>
            </div>
        </>
    );
}

SellersList.layout = page => <AdminLayout title="បញ្ជីអ្នកលក់" children={page} />
