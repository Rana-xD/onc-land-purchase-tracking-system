import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, Table, Button, Typography, Steps, Badge, message, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { normalizeForSearch } from '@/utils/numberUtils';
import { UserOutlined, TeamOutlined, EnvironmentOutlined, DollarOutlined, FileOutlined } from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';

const { Title, Text } = Typography;

export default function SelectSellers({ document, sellers, selectedSellers, editMode }) {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(selectedSellers || []);
  const [searchText, setSearchText] = useState('');
  
  // Filter sellers based on search text with support for both Khmer and English digits
  const filteredSellers = sellers.filter(seller => {
    if (!searchText) return true;
    
    // Normalize search text and seller data for comparison
    const normalizedSearch = normalizeForSearch(searchText);
    const normalizedName = normalizeForSearch(seller.name);
    const normalizedIdentity = normalizeForSearch(seller.identity_number);
    const normalizedPhone = normalizeForSearch(seller.phone_number);
    
    return (
      normalizedName.includes(normalizedSearch) ||
      normalizedIdentity.includes(normalizedSearch) ||
      normalizedPhone.includes(normalizedSearch)
    );
  });
  
  const columns = [
    {
      title: 'ជ្រើសរើស',
      dataIndex: 'id',
      key: 'selection',
      render: (id) => (
        <input 
          type="checkbox" 
          checked={selected.includes(id)} 
          onChange={(e) => {
            if (e.target.checked) {
              setSelected([...selected, id]);
            } else {
              setSelected(selected.filter(item => item !== id));
            }
          }}
        />
      ),
    },
    {
      title: 'ឈ្មោះ',
      dataIndex: 'name',
      key: 'name',
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
  ];

  const handleContinue = async () => {
    if (selected.length === 0) {
      message.error('សូមជ្រើសរើសយ៉ាងហោចណាស់មួយ');
      return;
    }

    setLoading(true);
    
    try {
      // Use the new API route structure based on document type
      const apiPrefix = document.document_type === 'deposit_contract' ? 'deposit-contracts' : 'sale-contracts';
      await axios.post(`/api/${apiPrefix}/${document.id}/select-sellers`, {
        seller_ids: selected
      });
      
      // Redirect to the next step based on document type
      if (document.document_type === 'deposit_contract') {
        window.location.href = route('deposit-contracts.select-lands', { id: document.id });
      } else {
        window.location.href = route('sale-contracts.select-lands', { id: document.id });
      }
    } catch (error) {
      console.error('Error selecting sellers:', error);
      message.error('មានបញ្ហាក្នុងការជ្រើសរើសអ្នកលក់');
    } finally {
      setLoading(false);
    }
  };

  // Determine current step based on document type
  const currentStep = 1; // Second step (0-indexed)
  const totalSteps = document.document_type === 'deposit_contract' ? 4 : 5;
  
  const steps = [
    {
      title: 'ជ្រើសរើសអ្នកទិញ',
      icon: <UserOutlined />,
    },
    {
      title: 'ជ្រើសរើសអ្នកលក់',
      icon: <TeamOutlined />,
    },
    {
      title: 'ជ្រើសរើសដី និងកំណត់តម្លៃ',
      icon: <EnvironmentOutlined />,
    }
  ];
  
  // Add document-type specific steps
  if (document.document_type === 'deposit_contract') {
    steps.push({
      title: 'កំណត់ការកក់ប្រាក់',
      icon: <DollarOutlined />,
    });
  } else {
    steps.push({
      title: 'ដំណាក់កាលបង់ប្រាក់',
      icon: <DollarOutlined />,
    });
  }
  
  steps.push({
    title: 'បង្កើតកិច្ចសន្យា',
    icon: <FileOutlined />,
  });

  return (
    <AdminLayout>
      <Head title="ជ្រើសរើសអ្នកលក់" />
      
      <div className="container mx-auto py-6">
        <Card className="mb-6">
          <div className="overflow-x-auto">
            <Steps 
              current={currentStep} 
              items={steps} 
              responsive={true} 
              className="site-navigation-steps" 
              size="small"
            />
          </div>
        </Card>
        
        <Card>
          <div className="flex justify-between items-center mb-6">
            <Title level={3}>{editMode ? 'កែសម្រួលអ្នកលក់' : 'ជ្រើសរើសអ្នកលក់'}</Title>
            <div className="flex items-center">
              <Text className="mr-2">បានជ្រើសរើស</Text>
              <Badge count={selected.length} showZero style={{ marginTop: '0' }} />
            </div>
          </div>
          
          <div className="mb-4">
            <Input
              placeholder="ស្វែងរកតាមឈ្មោះ លេខអត្តសញ្ញាណប័ណ្ណ ឬលេខទូរស័ព្ទ"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          
          <Table 
            rowKey="id"
            columns={columns} 
            dataSource={filteredSellers} 
            pagination={{ pageSize: 10 }}
            rowClassName={(record) => selected.includes(record.id) ? 'bg-blue-50' : ''}
          />
          
          <div className="flex justify-between mt-6">
            <Button href={route(document.document_type === 'deposit_contract' ? 'deposit-contracts.select-buyers' : 'sale-contracts.select-buyers', { id: document.id })}>
              ត្រឡប់
            </Button>
            <Button 
              type="primary" 
              onClick={handleContinue}
              loading={loading}
              disabled={selected.length === 0}
            >
              បន្ត
            </Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
