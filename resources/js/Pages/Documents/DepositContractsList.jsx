import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Card, Table, Button, Typography, Space, Input, Popconfirm, message } from 'antd';
import { PlusOutlined, SearchOutlined, FilePdfOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';

const { Title } = Typography;

export default function DepositContractsList({ initialDocuments }) {
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
      const response = await axios.get('/api/documents?type=deposit_contract');
      setDocuments(response.data);
    } catch (error) {
      console.error('បញ្ហាក្នុងការទាញកិច្ចសន្យាប័ត្រប្រាក់កក់:', error);
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
  
  // Handle document deletion
  const handleDelete = (id) => {
    router.delete(route('deposit-contracts.destroy', { id }), {
      onSuccess: () => {
        message.success('លិខិតកក់ប្រាក់ត្រូវបានលុបដោយជោគជ័យ');
        // Update the local state to remove the deleted document
        setDocuments(documents.filter(doc => doc.id !== id));
      },
      onError: () => {
        message.error('មានបញ្ហាក្នុងការលុបឯកសារ');
      }
    });
  };

  // Filter documents based on search text
  const filteredDocuments = documents.filter(doc => {
    if (!searchText) return true;
    
    const searchLower = searchText.toLowerCase();
    
    // Search in document properties
    if (doc.document_code && doc.document_code.toLowerCase().includes(searchLower)) return true;
    if (doc.id.toString().includes(searchLower)) return true;
    if (doc.created_at && formatDate(doc.created_at).toLowerCase().includes(searchLower)) return true;
    
    // Search in related entities (buyers, sellers, lands)
    if (doc.buyers && doc.buyers.some(buyer => 
      buyer.buyer && buyer.buyer.name && buyer.buyer.name.toLowerCase().includes(searchLower)
    )) return true;
    
    if (doc.sellers && doc.sellers.some(seller => 
      seller.seller && seller.seller.name && seller.seller.name.toLowerCase().includes(searchLower)
    )) return true;
    
    if (doc.lands && doc.lands.some(land => 
      (land.land && land.land.plot_number && land.land.plot_number.toLowerCase().includes(searchLower)) || 
      (land.land && land.land.location && land.land.location.toLowerCase().includes(searchLower))
    )) return true;
    
    return false;
  });
  
  const columns = [
    {
      title: 'លេខសម្គាល់',
      dataIndex: 'document_code',
      key: 'document_code',
      render: (code, record) => code || `#${record.id}`,
      sorter: (a, b) => {
        // If both have document_code, sort by that
        if (a.document_code && b.document_code) {
          return a.document_code.localeCompare(b.document_code);
        }
        // Fall back to ID sorting
        return a.id - b.id;
      },
    },
    {
      title: 'អ្នកទិញ',
      key: 'buyers',
      render: (_, record) => (
        <span>
          {record.buyers && record.buyers.length > 0
            ? record.buyers.map(buyer => buyer.buyer?.name).filter(Boolean).join(', ')
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
            ? record.sellers.map(seller => seller.seller?.name).filter(Boolean).join(', ')
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
          <Link href={route('deposit-contracts.success', { id: record.id })}>
            <Button type="text" icon={<EyeOutlined />} title="មើល" />
          </Link>
          <Link href={route('deposit-contracts.download', { id: record.id })} target="_blank">
            <Button type="text" icon={<FilePdfOutlined />} title="ទាញយក PDF" />
          </Link>
          <Popconfirm
            title="តើអ្នកប្រាកដជាចង់លុបឯកសារនេះមែនទេ?"
            description="ការលុបនេះមិនអាចត្រឡប់ក្រោយវិញបានទេ"
            onConfirm={() => handleDelete(record.id)}
            okText="បាទ/ចាស"
            cancelText="ទេ"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              title="លុប"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Head title="លិខិតកក់ប្រាក់" />
      
      <div className="container mx-auto py-6">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <Title level={3}>បញ្ជីលិខិតកក់ប្រាក់</Title>
            <Space>
              <Input
                placeholder="ស្វែងរក..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 200 }}
              />
              <Link href={route('deposit-contracts.create')}>
                <Button type="primary" icon={<PlusOutlined />}>
                  បង្កើតលិខិតកក់ប្រាក់ថ្មី
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
