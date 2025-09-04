import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Card, Button, Typography, Steps, InputNumber, Select, message, Divider } from 'antd';
import { UserOutlined, TeamOutlined, EnvironmentOutlined, DollarOutlined, FileOutlined } from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

export default function DepositConfig({ document }) {
  const [loading, setLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState(document.deposit_amount || 0);
  const [depositMonths, setDepositMonths] = useState(document.deposit_months || 3);
  
  const handleGenerate = async () => {
    if (!depositAmount) {
      message.error('សូមបញ្ចូលចំនួនប្រាក់កក់');
      return;
    }

    if (!depositMonths) {
      message.error('សូមជ្រើសរើសរយៈពេលកក់ប្រាក់');
      return;
    }

    setLoading(true);
    
    try {
      // Use the new API route structure
      const apiPrefix = 'deposit-contracts'; // This component is only for deposit contracts
      
      // First save deposit config
      await axios.post(`/api/${apiPrefix}/${document.id}/deposit-config`, {
        deposit_amount: depositAmount,
        deposit_months: depositMonths
      });
      
      // Redirect to success page
      window.location.href = route('deposit-contracts.success', { id: document.id });
    } catch (error) {
      console.error('Error generating document:', error);
      
      if (error.response && error.response.data && error.response.data.error) {
        message.error(error.response.data.error);
      } else {
        message.error('មានបញ្ហាក្នុងការបង្កើតកិច្ចសន្យា');
      }
    } finally {
      setLoading(false);
    }
  };

  // Determine current step
  const currentStep = 3; // Fourth step (0-indexed)
  
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
    },
    {
      title: 'កំណត់ការកក់ប្រាក់',
      icon: <DollarOutlined />,
    },
    {
      title: 'បង្កើតកិច្ចសន្យា',
      icon: <FileOutlined />,
    }
  ];

  return (
    <AdminLayout>
      <Head title="កំណត់ការកក់ប្រាក់" />
      
      <div className="container mx-auto py-6">
        <Card className="mb-6">
          <Steps 
            current={currentStep} 
            items={steps} 
            responsive={true} 
            className="site-navigation-steps" 
            size="small"
          />
        </Card>
        
        <Card>
          <Title level={3} className="mb-6">កំណត់ការកក់ប្រាក់</Title>
          
          <div className="mb-6">
            <Text strong>តម្លៃដីសរុប: ${parseFloat(document.total_land_price).toLocaleString()}</Text>
          </div>
          
          <Divider />
          
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <div className="mb-2">
                <Text strong>ចំនួនប្រាក់កក់ (Deposit Amount) <span style={{ color: 'red' }}>*</span></Text>
              </div>
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                max={document.total_land_price}
                precision={2}
                prefix="$"
                value={depositAmount}
                onChange={setDepositAmount}
                placeholder="បញ្ចូលចំនួនប្រាក់កក់"
              />
            </div>
            
            <div className="mb-6">
              <div className="mb-2">
                <Text strong>រយៈពេលកក់ប្រាក់ (Deposit Period) <span style={{ color: 'red' }}>*</span></Text>
              </div>
              <Select
                style={{ width: '100%' }}
                value={depositMonths}
                onChange={setDepositMonths}
                placeholder="ជ្រើសរើសរយៈពេល"
              >
                <Option value={1}>1 ខែ (1 month)</Option>
                <Option value={2}>2 ខែ (2 months)</Option>
                <Option value={3}>3 ខែ (3 months)</Option>
                <Option value={4}>4 ខែ (4 months)</Option>
                <Option value={5}>5 ខែ (5 months)</Option>
                <Option value={6}>6 ខែ (6 months)</Option>
              </Select>
            </div>
          </div>
          
          <Divider />
          
          <div className="flex justify-between mt-6">
            <Button href={route('deposit-contracts.select-lands', { id: document.id })}>
              ត្រឡប់
            </Button>
            <Button 
              type="primary" 
              onClick={handleGenerate}
              loading={loading}
              disabled={!depositAmount || !depositMonths}
            >
              បង្កើតកិច្ចសន្យា
            </Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
