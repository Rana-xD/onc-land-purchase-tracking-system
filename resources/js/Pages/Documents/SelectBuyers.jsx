import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, Table, Button, Typography, Steps, Badge, message, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { normalizeForSearch } from '@/utils/numberUtils';
import { UserOutlined, TeamOutlined, EnvironmentOutlined, DollarOutlined, FileOutlined } from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';

const { Title, Text } = Typography;

export default function SelectBuyers({ buyers, selectedBuyers, documentType }) {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(selectedBuyers || []);
  const [searchText, setSearchText] = useState('');
  
  // Filter buyers based on search text with support for both Khmer and English digits
  const filteredBuyers = buyers.filter(buyer => {
    if (!searchText) return true;
    
    // Normalize search text and buyer data for comparison
    const normalizedSearch = normalizeForSearch(searchText);
    const normalizedName = normalizeForSearch(buyer.name);
    const normalizedIdentity = normalizeForSearch(buyer.identity_number);
    const normalizedPhone = normalizeForSearch(buyer.phone_number);
    
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
      // First create the document record
      const apiPrefix = documentType === 'deposit_contract' ? 'deposit-contracts' : 'sale-contracts';
      const createEndpoint = `/api/${apiPrefix}/create`;
      
      // Create the document first
      const createResponse = await axios.post(createEndpoint, {
        document_type: documentType
      });
      
      const documentId = createResponse.data.id;
      
      // Then add the selected buyers
      await axios.post(`/api/${apiPrefix}/${documentId}/select-buyers`, {
        buyer_ids: selected
      });
      
      // Redirect to the next step based on document type
      if (documentType === 'deposit_contract') {
        window.location.href = route('deposit-contracts.select-sellers', { id: documentId });
      } else {
        window.location.href = route('sale-contracts.select-sellers', { id: documentId });
      }
    } catch (error) {
      console.error('Error creating document or selecting buyers:', error);
      message.error('មានបញ្ហាក្នុងការជ្រើសរើសអ្នកទិញ');
    } finally {
      setLoading(false);
    }
  };

  // Determine current step based on document type
  const currentStep = 0; // First step (0-indexed)
  const totalSteps = documentType === 'deposit_contract' ? 4 : 5;
  
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
  if (documentType === 'deposit_contract') {
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
    title: 'បង្កើតឯកសារ',
    icon: <FileOutlined />,
  });

  return (
    <AdminLayout>
      <Head title="ជ្រើសរើសអ្នកទិញ" />
      
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
            <Title level={3}>ជ្រើសរើសអ្នកទិញ</Title>
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
            dataSource={filteredBuyers} 
            pagination={{ pageSize: 10 }}
            rowClassName={(record) => selected.includes(record.id) ? 'bg-blue-50' : ''}
          />
          
          <div className="flex justify-between mt-6">
            <Button href={documentType === 'deposit_contract' ? route('deposit-contracts.index') : route('sale-contracts.index')}>
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
