import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, Table, Typography, Space, Input, Tag } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';

const { Title } = Typography;

export default function ContractReportList({ initialContracts }) {
  const [contracts, setContracts] = useState(initialContracts || []);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  // Fetch contracts if not provided initially
  useEffect(() => {
    if (!initialContracts) {
      fetchContracts();
    }
  }, [initialContracts]);
  
  const fetchContracts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/contracts/report-list');
      setContracts(response.data);
    } catch (error) {
      console.error('បញ្ហាក្នុងការទាញកិច្ចសន្យា:', error);
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

  // Filter contracts based on search text
  const filteredContracts = contracts.filter(contract => {
    if (!searchText) return true;
    
    const searchLower = searchText.toLowerCase();
    
    // Search in contract properties
    if (contract.document_code && contract.document_code.toLowerCase().includes(searchLower)) return true;
    if (contract.id.toString().includes(searchLower)) return true;
    if (contract.document_type && contract.document_type.toLowerCase().includes(searchLower)) return true;
    
    // Search in related entities (sellers, lands)
    if (contract.sellers && contract.sellers.some(seller => 
      seller.seller && seller.seller.name && seller.seller.name.toLowerCase().includes(searchLower)
    )) return true;
    
    if (contract.lands && contract.lands.some(land => 
      (land.land && land.land.plot_number && land.land.plot_number.toLowerCase().includes(searchLower)) || 
      (land.land && land.land.location && land.land.location.toLowerCase().includes(searchLower))
    )) return true;
    
    return false;
  });
  
  const columns = [
    {
      title: 'លេខកិច្ចសន្យា',
      dataIndex: 'document_code',
      key: 'document_code',
      render: (code, record) => (
        <Link href={getContractDetailRoute(record)}>
          <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
            {code || `#${record.id}`}
          </span>
        </Link>
      ),
      sorter: (a, b) => {
        if (a.document_code && b.document_code) {
          return a.document_code.localeCompare(b.document_code);
        }
        return a.id - b.id;
      },
    },
    {
      title: 'ប្រភេទកិច្ចសន្យា',
      dataIndex: 'document_type',
      key: 'document_type',
      render: (type) => (
        <Tag color={type === 'deposit_contract' ? 'blue' : 'green'}>
          {type === 'deposit_contract' ? 'កិច្ចសន្យាកក់ប្រាក់' : 'កិច្ចសន្យាលក់ដី'}
        </Tag>
      ),
    },
    {
      title: 'ឈ្មោះអ្នកលក់',
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
      title: 'លេខដីកម្មសិទ្ធិ',
      key: 'lands',
      render: (_, record) => (
        <span>
          {record.lands && record.lands.length > 0
            ? record.lands.map(land => land.land?.plot_number).filter(Boolean).join(', ')
            : 'N/A'}
        </span>
      ),
    },
    {
      title: 'តម្លៃសរុប',
      dataIndex: 'total_land_price',
      key: 'total_land_price',
      render: (price) => `$${parseFloat(price || 0).toLocaleString()}`,
      sorter: (a, b) => (a.total_land_price || 0) - (b.total_land_price || 0),
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
          <Link href={getContractDetailRoute(record)}>
            <EyeOutlined className="text-blue-600 hover:text-blue-800 cursor-pointer" />
          </Link>
        </Space>
      ),
    },
  ];

  // Helper function to get the correct route based on contract type
  const getContractDetailRoute = (contract) => {
    if (contract.document_type === 'deposit_contract') {
      return route('deposit-contracts.success', { id: contract.id });
    } else {
      return route('sale-contracts.success', { id: contract.id });
    }
  };

  return (
    <AdminLayout>
      <Head title="របាយការណ៍កិច្ចសន្យា" />
      
      <div className="container mx-auto py-6">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <Title level={3}>របាយការណ៍កិច្ចសន្យា</Title>
            <Space>
              <Input
                placeholder="ស្វែងរកកិច្ចសន្យា..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 250 }}
              />
            </Space>
          </div>
          
          <Table 
            rowKey="id"
            columns={columns} 
            dataSource={filteredContracts} 
            loading={loading}
            pagination={{ 
              pageSize: 15,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} នៃ ${total} កិច្ចសន្យា`
            }}
          />
        </Card>
      </div>
    </AdminLayout>
  );
}
