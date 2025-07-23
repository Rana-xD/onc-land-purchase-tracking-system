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

export default function LandsList({ lands, pagination }) {
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
        if (lands) {
            setData(lands);
        }
        
        if (pagination) {
            setPaginationInfo({
                current: pagination.current_page,
                pageSize: pagination.per_page,
                total: pagination.total
            });
        }
    }, [lands, pagination]);

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
            
            const response = await axios.get('/api/lands', {
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
            console.error('Error fetching lands:', error);
            message.error('មានបញ្ហាក្នុងការទាញយកទិន្នន័យដី');
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`/api/lands/${id}`);
            message.success('បានលុបទិន្នន័យដីដោយជោគជ័យ');
            fetchData(paginationInfo.current, paginationInfo.pageSize, searchText);
        } catch (error) {
            console.error('Error deleting land:', error);
            message.error('មានបញ្ហាក្នុងការលុបទិន្នន័យដី');
        } finally {
            setLoading(false);
        }
    };

    const formatSize = (size) => {
        return `${Number(size).toLocaleString('en-US', { maximumFractionDigits: 2 })} ម²`;
    };

    const columns = [
        {
            title: 'លេខក្បាលដី',
            dataIndex: 'plot_number',
            key: 'plot_number',
            render: (text, record) => (
                <Link href={route('data-entry.lands.show', record.id)}>
                    {text}
                </Link>
            ),
        },
        {
            title: 'ទំហំ',
            dataIndex: 'size',
            key: 'size',
            render: (size) => formatSize(size),
        },
        {
            title: 'ទីតាំង',
            dataIndex: 'location',
            key: 'location',
            ellipsis: true,
        },
        {
            title: 'កាលបរិច្ឆេទចុះបញ្ជី',
            dataIndex: 'date_of_registration',
            key: 'date_of_registration',
            render: (dateString) => {
                if (!dateString) return '';
                // Format date as YYYY-MM-DD
                const date = new Date(dateString);
                return date.toISOString().split('T')[0];
            },
        },
        {
            title: 'សកម្មភាព',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="កែប្រែព័ត៌មានដី">
                        <Button 
                            type="default" 
                            icon={<EditOutlined />} 
                            size="small"
                            onClick={() => router.visit(route('data-entry.lands.edit', record.id))}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="តើអ្នកពិតជាចង់លុបទិន្នន័យនេះមែនទេ?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="យល់ព្រម"
                        cancelText="បោះបង់"
                    >
                        <Tooltip title="លុបព័ត៌មានដី">
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
            <Head title="បញ្ជីដី" />
            
            <div className="lands-list">
                <Breadcrumb
                    items={[
                        { title: <Link href={route('data-entry.index')}>ជ្រើសរើសប្រភេទទិន្នន័យ</Link> },
                        { title: 'បញ្ជីដី' },
                    ]}
                    className="mb-6"
                />
                
                <Card>
                    <Row justify="space-between" align="middle" className="mb-4">
                        <Col>
                            <Title level={4} className="khmer-heading m-0">បញ្ជីដី</Title>
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
                                <Tooltip title="បន្ថែមដីថ្មី">
                                    <Button 
                                        type="primary" 
                                        icon={<PlusOutlined />}
                                        onClick={() => router.visit(route('data-entry.lands.create'))}
                                    >
                                        បន្ថែមថ្មី
                                    </Button>
                                </Tooltip>
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

LandsList.layout = page => <AdminLayout title="បញ្ជីដី" children={page} />
