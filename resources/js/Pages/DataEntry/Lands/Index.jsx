import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Table, Button, Input, Space, Popconfirm, 
    Typography, Card, Row, Col, Breadcrumb, message,
    Tag, Select, Form, Divider, InputNumber, DatePicker
} from 'antd';
import { 
    SearchOutlined, PlusOutlined, EditOutlined, 
    DeleteOutlined, FileAddOutlined, EyeOutlined,
    FilterOutlined, ClearOutlined
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
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        province: '',
        district: '',
        commune: '',
        village: '',
        size_min: null,
        size_max: null,
        price_min: null,
        price_max: null,
        date_from: null,
        date_to: null
    });
    const [form] = Form.useForm();

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
        fetchData(1, paginationInfo.pageSize, value, filters);
    };

    const handleTableChange = (pagination) => {
        fetchData(pagination.current, pagination.pageSize, searchText, filters);
    };

    const handleFilterChange = (changedValues, allValues) => {
        const newFilters = {
            province: allValues.province || '',
            district: allValues.district || '',
            commune: allValues.commune || '',
            village: allValues.village || '',
            size_min: allValues.size_min,
            size_max: allValues.size_max,
            price_min: allValues.price_min,
            price_max: allValues.price_max,
            date_from: allValues.date_from ? allValues.date_from.format('YYYY-MM-DD') : null,
            date_to: allValues.date_to ? allValues.date_to.format('YYYY-MM-DD') : null
        };
        
        setFilters(newFilters);
        fetchData(1, paginationInfo.pageSize, searchText, newFilters);
    };

    const resetFilters = () => {
        form.resetFields();
        const emptyFilters = {
            province: '',
            district: '',
            commune: '',
            village: '',
            size_min: null,
            size_max: null,
            price_min: null,
            price_max: null,
            date_from: null,
            date_to: null
        };
        setFilters(emptyFilters);
        fetchData(1, paginationInfo.pageSize, searchText, emptyFilters);
    };

    const fetchData = async (page, pageSize, search = '', filters = {}) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/lands', {
                params: {
                    page,
                    per_page: pageSize,
                    search,
                    ...filters
                }
            });
            
            setData(response.data.data);
            setPaginationInfo({
                current: response.data.meta.current_page,
                pageSize: response.data.meta.per_page,
                total: response.data.meta.total
            });
        } catch (error) {
            console.error('Error fetching lands:', error);
            message.error('មានបញ្ហាក្នុងការទាញយកទិន្នន័យដី');
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
        },
        {
            title: 'សកម្មភាព',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button 
                        type="primary" 
                        icon={<EyeOutlined />} 
                        size="small"
                        onClick={() => router.visit(route('data-entry.lands.show', record.id))}
                    />
                    <Button 
                        type="default" 
                        icon={<EditOutlined />} 
                        size="small"
                        onClick={() => router.visit(route('data-entry.lands.edit', record.id))}
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
                                <Button 
                                    type={showFilters ? "primary" : "default"}
                                    icon={<FilterOutlined />}
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    តម្រង
                                </Button>
                                <Button 
                                    type="primary" 
                                    icon={<PlusOutlined />}
                                    onClick={() => router.visit(route('data-entry.lands.create'))}
                                >
                                    បន្ថែមថ្មី
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                    
                    {showFilters && (
                        <div className="filter-section mb-4">
                            <Divider orientation="left">តម្រងទិន្នន័យ</Divider>
                            <Form
                                form={form}
                                layout="vertical"
                                onValuesChange={handleFilterChange}
                                initialValues={filters}
                            >
                                <Row gutter={16}>
                                    <Col xs={24} sm={12} md={6}>
                                        <Form.Item name="province" label="ខេត្ត/ក្រុង">
                                            <Input placeholder="ខេត្ត/ក្រុង" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12} md={6}>
                                        <Form.Item name="district" label="ស្រុក/ខណ្ឌ">
                                            <Input placeholder="ស្រុក/ខណ្ឌ" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12} md={6}>
                                        <Form.Item name="commune" label="ឃុំ/សង្កាត់">
                                            <Input placeholder="ឃុំ/សង្កាត់" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12} md={6}>
                                        <Form.Item name="village" label="ភូមិ">
                                            <Input placeholder="ភូមិ" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col xs={24} sm={12} md={6}>
                                        <Form.Item name="size_min" label="ទំហំអប្បបរមា">
                                            <InputNumber 
                                                style={{ width: '100%' }} 
                                                placeholder="ទំហំអប្បបរមា" 
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12} md={6}>
                                        <Form.Item name="size_max" label="ទំហំអតិបរមា">
                                            <InputNumber 
                                                style={{ width: '100%' }} 
                                                placeholder="ទំហំអតិបរមា" 
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12} md={6}>
                                        <Form.Item name="price_min" label="តម្លៃអប្បបរមា">
                                            <InputNumber 
                                                style={{ width: '100%' }} 
                                                placeholder="តម្លៃអប្បបរមា" 
                                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12} md={6}>
                                        <Form.Item name="price_max" label="តម្លៃអតិបរមា">
                                            <InputNumber 
                                                style={{ width: '100%' }} 
                                                placeholder="តម្លៃអតិបរមា" 
                                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col xs={24} sm={12} md={6}>
                                        <Form.Item name="date_from" label="ចាប់ពីកាលបរិច្ឆេទ">
                                            <DatePicker 
                                                style={{ width: '100%' }} 
                                                format="DD/MM/YYYY" 
                                                placeholder="ចាប់ពីកាលបរិច្ឆេទ"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12} md={6}>
                                        <Form.Item name="date_to" label="ដល់កាលបរិច្ឆេទ">
                                            <DatePicker 
                                                style={{ width: '100%' }} 
                                                format="DD/MM/YYYY" 
                                                placeholder="ដល់កាលបរិច្ឆេទ"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12} md={12} className="text-right">
                                        <Form.Item>
                                            <Button 
                                                type="default" 
                                                icon={<ClearOutlined />} 
                                                onClick={resetFilters}
                                            >
                                                សម្អាតតម្រង
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    )}
                    
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

LandsList.layout = page => <AdminLayout title="បញ្ជីដី" children={page} />
