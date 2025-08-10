import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, Table, Button, Typography, Steps, Badge, message, InputNumber, Select, Form, Input, Row, Col, Divider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { normalizeForSearch } from '@/utils/numberUtils';
import { UserOutlined, TeamOutlined, EnvironmentOutlined, DollarOutlined, FileOutlined } from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';

const { Title, Text } = Typography;

export default function SelectLands({ document, lands, selectedLands }) {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [landPrices, setLandPrices] = useState({});
  const [grandTotal, setGrandTotal] = useState(0);
  const [searchText, setSearchText] = useState('');
  
  // Initialize selected lands and prices from props
  useEffect(() => {
    if (selectedLands) {
      const selectedIds = Object.keys(selectedLands).map(id => parseInt(id));
      setSelected(selectedIds);
      
      const prices = {};
      let total = 0;
      
      selectedIds.forEach(id => {
        const landData = selectedLands[id];
        prices[id] = {
          price_per_m2: landData.price_per_m2,
          total_price: landData.total_price
        };
        total += parseFloat(landData.total_price);
      });
      
      setLandPrices(prices);
      setGrandTotal(total);
    }
  }, [selectedLands]);
  
  // Calculate grand total whenever land prices change
  useEffect(() => {
    let total = 0;
    Object.values(landPrices).forEach(price => {
      if (price.total_price) {
        total += parseFloat(price.total_price);
      }
    });
    setGrandTotal(total);
  }, [landPrices]);
  
  const handlePricePerM2Change = (landId, value) => {
    const land = lands.find(l => l.id === landId);
    if (!land) return;
    
    const totalPrice = value * parseFloat(land.size);
    
    setLandPrices({
      ...landPrices,
      [landId]: {
        price_per_m2: value,
        total_price: totalPrice
      }
    });
  };
  
  const handleTotalPriceChange = (landId, value) => {
    setLandPrices({
      ...landPrices,
      [landId]: {
        price_per_m2: null,
        total_price: value
      }
    });
  };
  
  // Filter lands based on search text with support for both Khmer and English digits
  const filteredLands = lands.filter(land => {
    if (!searchText) return true;
    
    // Normalize search text and land data for comparison
    const normalizedSearch = normalizeForSearch(searchText);
    const normalizedPlotNumber = normalizeForSearch(land.plot_number);
    const normalizedLocation = normalizeForSearch(land.location);
    const normalizedSize = normalizeForSearch(land.size);
    
    return (
      normalizedPlotNumber.includes(normalizedSearch) ||
      normalizedLocation.includes(normalizedSearch) ||
      normalizedSize.includes(normalizedSearch)
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
              
              // Initialize price if not already set
              if (!landPrices[id]) {
                setLandPrices({
                  ...landPrices,
                  [id]: { price_per_m2: null, total_price: 0 }
                });
              }
            } else {
              setSelected(selected.filter(item => item !== id));
              
              // Remove price data for unselected land
              const newPrices = { ...landPrices };
              delete newPrices[id];
              setLandPrices(newPrices);
            }
          }}
        />
      ),
    },
    {
      title: 'លេខដី',
      dataIndex: 'plot_number',
      key: 'plot_number',
    },
    {
      title: 'ទំហំ',
      dataIndex: 'size',
      key: 'size',
      render: (size) => `${size} m²`,
    },
    {
      title: 'ទីតាំង',
      dataIndex: 'location',
      key: 'location',
    },
  ];
  
  const handleContinue = async () => {
    if (selected.length === 0) {
      message.error('សូមជ្រើសរើសយ៉ាងហោចណាស់មួយ');
      return;
    }
    
    // Check if all selected lands have prices
    const missingPrices = selected.some(id => {
      return !landPrices[id] || !landPrices[id].total_price;
    });
    
    if (missingPrices) {
      message.error('សូមបញ្ចូលតម្លៃសម្រាប់ដីទាំងអស់');
      return;
    }

    setLoading(true);
    
    try {
      // Format data for API
      const landsData = selected.map(id => ({
        land_id: id,
        price_per_m2: landPrices[id].price_per_m2,
        total_price: landPrices[id].total_price
      }));
      
      // Use the new API route structure based on document type
      const apiPrefix = document.document_type === 'deposit_contract' ? 'deposit-contracts' : 'sale-contracts';
      await axios.post(`/api/${apiPrefix}/${document.id}/select-lands`, {
        lands: landsData
      });
      
      // Redirect to the appropriate next step based on document type
      if (document.document_type === 'deposit_contract') {
        window.location.href = route('deposit-contracts.deposit-config', { id: document.id });
      } else {
        window.location.href = route('sale-contracts.payment-steps', { id: document.id });
      }
    } catch (error) {
      console.error('Error selecting lands:', error);
      message.error('មានបញ្ហាក្នុងការជ្រើសរើសដី');
    } finally {
      setLoading(false);
    }
  };

  // Determine current step based on document type
  const currentStep = 2; // Third step (0-indexed)
  
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
      <Head title="ជ្រើសរើសដី និងកំណត់តម្លៃ" />
      
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
            <Title level={3}>ជ្រើសរើសដី និងកំណត់តម្លៃ</Title>
            <div className="flex items-center">
              <Text className="mr-2">បានជ្រើសរើស</Text>
              <Badge count={selected.length} showZero style={{ marginTop: '0' }} />
            </div>
          </div>
          
          <div className="mb-4">
            <Input
              placeholder="ស្វែងរកតាមលេខដី ទំហំ ឬទីតាំង"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          
          <Table 
            rowKey="id"
            columns={columns} 
            dataSource={filteredLands} 
            pagination={{ pageSize: 10 }}
            rowClassName={(record) => selected.includes(record.id) ? 'bg-blue-50' : ''}
            expandable={{
              expandedRowRender: (record) => {
                if (!selected.includes(record.id)) return null;
                
                // Create a wrapper div with position relative to contain everything
                return (
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="mb-2">តម្លៃក្នុង 1m² (Price per m²):</div>
                        <div>
                          <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            precision={2}
                            prefix="$"
                            value={landPrices[record.id]?.price_per_m2}
                            onChange={(value) => handlePricePerM2Change(record.id, value)}
                            placeholder="បញ្ចូលតម្លៃក្នុង 1m²"
                            formatter={(value) => value ? `${value}` : ''}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="mb-2">ឬ តម្លៃសរុប (Total Price):</div>
                        <div>
                          <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            precision={2}
                            prefix="$"
                            value={landPrices[record.id]?.total_price}
                            onChange={(value) => handleTotalPriceChange(record.id, value)}
                            placeholder="បញ្ចូលតម្លៃសរុប"
                            formatter={(value) => value ? `${value}` : ''}
                          />
                        </div>
                      </div>
                    </div>
                    {landPrices[record.id]?.total_price > 0 && (
                      <div className="mt-4 text-right">
                        <Text strong>តម្លៃសរុប: ${parseFloat(landPrices[record.id]?.total_price).toLocaleString()}</Text>
                      </div>
                    )}
                  </div>
                );
              },
              expandedRowKeys: selected,
            }}
          />
          
          <Divider />
          
          <div className="text-right mb-6">
            <Title level={4}>តម្លៃដីសរុប: ${grandTotal.toLocaleString()}</Title>
          </div>
          
          <div className="flex justify-between mt-6">
            <Button href={route(document.document_type === 'deposit_contract' ? 'deposit-contracts.select-sellers' : 'sale-contracts.select-sellers', { id: document.id })}>
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
