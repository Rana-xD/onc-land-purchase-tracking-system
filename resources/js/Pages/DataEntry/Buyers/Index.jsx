import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Table, Button, Input, Space, Popconfirm, Tag, 
    Typography, Card, Row, Col, Breadcrumb, message,
    Select, Form, Divider, DatePicker, Radio
} from 'antd';
import { 
    SearchOutlined, PlusOutlined, EditOutlined, 
    DeleteOutlined, FileAddOutlined, EyeOutlined,
    FilterOutlined, ClearOutlined
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
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        sex: '',
        date_of_birth_from: null,
        date_of_birth_to: null,
        identity_type: '',
        phone_number: ''
    });
    const [form] = Form.useForm();

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
        fetchData(1, paginationInfo.pageSize, value, filters);
    };

    const handleTableChange = (pagination) => {
        fetchData(pagination.current, pagination.pageSize, searchText, filters);
    };

    const handleFilterChange = (changedValues, allValues) => {
        const newFilters = {
            sex: allValues.sex || '',
            date_of_birth_from: allValues.date_of_birth_from ? allValues.date_of_birth_from.format('YYYY-MM-DD') : null,
            date_of_birth_to: allValues.date_of_birth_to ? allValues.date_of_birth_to.format('YYYY-MM-DD') : null,
            identity_type: allValues.identity_type || '',
            phone_number: allValues.phone_number || ''
        };
        
        setFilters(newFilters);
        fetchData(1, paginationInfo.pageSize, searchText, newFilters);
    };

    const resetFilters = () => {
        form.resetFields();
        const emptyFilters = {
            sex: '',
            date_of_birth_from: null,
            date_of_birth_to: null,
            identity_type: '',
            phone_number: ''
        };
        setFilters(emptyFilters);
        fetchData(1, paginationInfo.pageSize, searchText, emptyFilters);
    };

    const fetchData = async (page, pageSize, search = '', filters = {}) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/buyers', {
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
            console.error('Error fetching buyers:', error);
            message.error('មានបញ្ហាក្នុងការទាញយកទិន្នន័យអ្នកទិញ');
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
                        type="primary" 
                        icon={<EyeOutlined />} 
                        size="small"
                        onClick={() => router.visit(route('data-entry.buyers.show', record.id))}
                    />
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
                                    onClick={() => router.visit(route('data-entry.buyers.create'))}
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
                                        <Form.Item name="sex" label="ភេទ">
                                            <Radio.Group>
                                                <Radio value="">ទាំងអស់</Radio>
                                                <Radio value="male">ប្រុស</Radio>
                                                <Radio value="female">ស្រី</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12} md={6}>
                                        <Form.Item name="identity_type" label="ប្រភេទអត្តសញ្ញាណ">
                                            <Select placeholder="ជ្រើសរើសប្រភេទ">
                                                <Select.Option value="">ទាំងអស់</Select.Option>
                                                <Select.Option value="national_id">អត្តសញ្ញាណប័ណ្ណ</Select.Option>
                                                <Select.Option value="passport">លិខិតឆ្លងដែន</Select.Option>
                                                <Select.Option value="other">ផ្សេងៗ</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12} md={6}>
                                        <Form.Item name="phone_number" label="លេខទូរស័ព្ទ">
                                            <Input placeholder="លេខទូរស័ព្ទ" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col xs={24} sm={12} md={6}>
                                        <Form.Item name="date_of_birth_from" label="កំណើតចាប់ពី">
                                            <DatePicker 
                                                style={{ width: '100%' }} 
                                                format="DD/MM/YYYY" 
                                                placeholder="កំណើតចាប់ពី"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12} md={6}>
                                        <Form.Item name="date_of_birth_to" label="កំណើតដល់">
                                            <DatePicker 
                                                style={{ width: '100%' }} 
                                                format="DD/MM/YYYY" 
                                                placeholder="កំណើតដល់"
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

BuyersList.layout = page => <AdminLayout title="បញ្ជីអ្នកទិញ" children={page} />
