import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, Table, Button, Typography, Tag, Space, Input } from 'antd';
import { PlusOutlined, SearchOutlined, FilePdfOutlined, EyeOutlined } from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';

const { Title } = Typography;

export default function DocumentsList({ initialDocuments }) {
  const [documents, setDocuments] = useState(initialDocuments || []);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  // Fetch documents if not provided initially
  useEffect(() => {
    if (!initialDocuments) {
      fetchDocuments();
    }
  }, [initialDocuments]);
  
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/documents');
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('km-KH', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  // Get document type display name and color
  const getDocumentTypeDisplay = (type) => {
    return {
      label: type === 'deposit_contract' ? 'លិខិតកក់ប្រាក់' : 'លិខិតទិញ លក់',
      color: type === 'deposit_contract' ? 'blue' : 'green'
    };
  };
  
  // Filter documents based on search text
  const filteredDocuments = documents.filter(doc => {
    if (!searchText) return true;
    
    const searchLower = searchText.toLowerCase();
    
    // Search in document properties
    if (doc.id.toString().includes(searchLower)) return true;
    if (getDocumentTypeDisplay(doc.document_type).label.toLowerCase().includes(searchLower)) return true;
    if (doc.created_at && formatDate(doc.created_at).toLowerCase().includes(searchLower)) return true;
    
    // Search in related entities (buyers, sellers, lands)
    if (doc.buyers && doc.buyers.some(buyer => buyer.name.toLowerCase().includes(searchLower))) return true;
    if (doc.sellers && doc.sellers.some(seller => seller.name.toLowerCase().includes(searchLower))) return true;
    if (doc.lands && doc.lands.some(land => 
      land.plot_number.toLowerCase().includes(searchLower) || 
      land.location.toLowerCase().includes(searchLower)
    )) return true;
    
    return false;
  });
  
  const columns = [
    {
      title: 'លេខសម្គាល់',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'ប្រភេទកិច្ចសន្យា',
      dataIndex: 'document_type',
      key: 'document_type',
      render: (type) => {
        const { label, color } = getDocumentTypeDisplay(type);
        return <Tag color={color}>{label}</Tag>;
      },
      filters: [
        { text: 'លិខិតកក់ប្រាក់', value: 'deposit_contract' },
        { text: 'លិខិតទិញ លក់', value: 'sale_contract' },
      ],
      onFilter: (value, record) => record.document_type === value,
    },
    {
      title: 'អ្នកទិញ',
      key: 'buyers',
      render: (_, record) => (
        <span>
          {record.buyers && record.buyers.length > 0
            ? record.buyers.map(buyer => buyer.name).join(', ')
            : 'N/A'}
        </span>
      ),
    },
    {
      title: 'អ្នកលក់',
      key: 'sellers',
      render: (_, record) => (
        <span>
          {record.sellers && record.sellers.length > 0
            ? record.sellers.map(seller => seller.name).join(', ')
            : 'N/A'}
        </span>
      ),
    },
    {
      title: 'តម្លៃដីសរុប',
      dataIndex: 'total_land_price',
      key: 'total_land_price',
      render: (price) => `$${parseFloat(price).toLocaleString()}`,
      sorter: (a, b) => a.total_land_price - b.total_land_price,
    },
    {
      title: 'កាលបរិច្ឆេទបង្កើត',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: 'សកម្មភាព',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Link href={route('documents.success', { id: record.id })}>
            <Button type="text" icon={<EyeOutlined />} />
          </Link>
          <Link href={`/documents/${record.id}/download`} target="_blank">
            <Button type="text" icon={<FilePdfOutlined />} />
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Head title="បញ្ជីកិច្ចសន្យា" />
      
      <div className="container mx-auto py-6">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <Title level={3}>បញ្ជីកិច្ចសន្យា</Title>
            <Space>
              <Input
                placeholder="ស្វែងរក..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 200 }}
              />
              <Link href={route('documents.index')}>
                <Button type="primary" icon={<PlusOutlined />}>
                  បង្កើតកិច្ចសន្យាថ្មី
                </Button>
              </Link>
            </Space>
          </div>
          
          <Table 
            rowKey="id"
            columns={columns} 
            dataSource={filteredDocuments} 
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>
    </AdminLayout>
  );
}
