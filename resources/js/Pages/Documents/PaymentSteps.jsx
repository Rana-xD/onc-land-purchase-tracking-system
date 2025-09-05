import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Card, Button, Typography, Steps, InputNumber, DatePicker, message, Divider, Form, Space, Input } from 'antd';
import { UserOutlined, TeamOutlined, EnvironmentOutlined, DollarOutlined, FileOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';
import dayjs from 'dayjs';
import { formatKhmerDate } from '../../Utils/khmerDate';

const { Title, Text } = Typography;

export default function PaymentSteps({ document, paymentSteps, editMode }) {
  const { csrf_token } = usePage().props;
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [steps, setSteps] = useState(paymentSteps || [
    { step_number: 1, amount: '', due_date: null, payment_time_description: '', percentage: '' }
  ]);
  const [totalPayment, setTotalPayment] = useState(0);
  const [hasEmptyFields, setHasEmptyFields] = useState(true);
  
  // Calculate total payment and check for empty fields whenever steps change
  useEffect(() => {
    let total = 0;
    let hasEmpty = false;
    
    steps.forEach(step => {
      if (step.amount) {
        total += parseFloat(step.amount);
      }
      
      // Check if any required fields are empty
      if (!step.amount || !step.due_date || !step.payment_time_description) {
        hasEmpty = true;
      }
    });
    
    setTotalPayment(total);
    setHasEmptyFields(hasEmpty);
  }, [steps]);
  
  const addStep = () => {
    const newStepNumber = steps.length + 1;
    setSteps([...steps, { step_number: newStepNumber, amount: '', due_date: null, payment_time_description: '', percentage: '' }]);
  };
  
  const removeStep = (index) => {
    if (steps.length <= 1) {
      message.error('យ៉ាងហោចណាស់ត្រូវមានដំណាក់កាលបង់ប្រាក់មួយ');
      return;
    }
    
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    
    // Renumber steps
    newSteps.forEach((step, idx) => {
      step.step_number = idx + 1;
    });
    
    setSteps(newSteps);
  };
  
  const updateStepAmount = (index, value) => {
    const newSteps = [...steps];
    newSteps[index].amount = value;
    // Clear percentage when amount is manually entered
    newSteps[index].percentage = '';
    setSteps(newSteps);
  };

  const updateStepPercentage = (index, value) => {
    const newSteps = [...steps];
    newSteps[index].percentage = value;
    
    // Calculate amount based on percentage of total land price
    if (value && document.total_land_price) {
      const calculatedAmount = (parseFloat(value) / 100) * parseFloat(document.total_land_price);
      newSteps[index].amount = calculatedAmount.toFixed(2);
    } else {
      newSteps[index].amount = '';
    }
    
    setSteps(newSteps);
  };
  
  const updateStepDate = (index, date) => {
    const newSteps = [...steps];
    newSteps[index].due_date = date ? date.format('YYYY-MM-DD') : null;
    setSteps(newSteps);
  };
  
  const updateStepDescription = (index, value) => {
    const newSteps = [...steps];
    newSteps[index].payment_time_description = value;
    setSteps(newSteps);
  };
  
  const handleGenerate = async () => {
    // Validate all steps have amount, due date, and payment time description
    const missingData = steps.some(step => !step.amount || !step.due_date || !step.payment_time_description);
    if (missingData) {
      message.error('សូមបញ្ចូលចំនួនទឹកប្រាក់, កាលបរិច្ឆេទ និងពេលវេលាបង់ប្រាក់សម្រាប់ដំណាក់កាលទាំងអស់');
      return;
    }
    
    // Validate total payment matches total land price
    const totalLandPrice = parseFloat(document.total_land_price);
    if (Math.abs(totalPayment - totalLandPrice) > 0.01) {
      message.error(`ចំនួនទឹកប្រាក់សរុបត្រូវតែស្មើនឹងតម្លៃដីសរុប ($${totalLandPrice.toLocaleString()})`);
      return;
    }

    setLoading(true);
    
    try {
      // Use the new API route structure
      const apiPrefix = 'sale-contracts'; // This component is only for sale contracts
      
      // Save payment steps
      await axios.post(`/api/${apiPrefix}/${document.id}/payment-steps`, {
        payment_steps: steps,
        _token: csrf_token
      });
      
      // Generate the document
      await axios.post(`/api/${apiPrefix}/${document.id}/generate`, {
        _token: csrf_token
      });
      
      // Redirect to success page
      window.location.href = route('sale-contracts.success', { id: document.id });
    } catch (error) {
      console.error('បញ្ហាក្នុងការបង្កើតកិច្ចសន្យា:', error);
      
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
  
  const stepItems = [
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
      title: 'ដំណាក់កាលបង់ប្រាក់',
      icon: <DollarOutlined />,
    },
    {
      title: 'បង្កើតកិច្ចសន្យា',
      icon: <FileOutlined />,
    }
  ];

  return (
    <AdminLayout>
      <Head title="ដំណាក់កាលបង់ប្រាក់" />
      
      <div className="container mx-auto py-6">
        <Card className="mb-6">
          <Steps 
            current={currentStep} 
            items={stepItems} 
            responsive={true} 
            className="site-navigation-steps" 
            size="small"
          />
        </Card>
        
        <Card>
          <Title level={3} className="mb-6">{editMode ? 'កែសម្រួលដំណាក់កាលបង់ប្រាក់' : 'ដំណាក់កាលបង់ប្រាក់'}</Title>
          
          <div className="mb-6">
            <Text strong>តម្លៃដីសរុប: ${parseFloat(document.total_land_price).toLocaleString()}</Text>
          </div>
          
          <Divider />
          
          <Form form={form} layout="vertical">
            {steps.map((step, index) => (
              <div key={index} className="mb-8 p-4 border rounded-md bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <Title level={5}>ដំណាក់កាលទី {step.step_number}</Title>
                  <Button 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={() => removeStep(index)}
                    disabled={steps.length <= 1}
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <Form.Item
                    label="ពេលវេលាបង់ប្រាក់ (Payment Time Description)"
                    required
                  >
                    <Input
                      value={step.payment_time_description}
                      onChange={(e) => updateStepDescription(index, e.target.value)}
                      placeholder="បញ្ចូលពេលវេលាបង់ប្រាក់"
                    />
                  </Form.Item>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Form.Item
                      label="ភាគរយ (Percentage %)"
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        max={100}
                        precision={2}
                        suffix="%"
                        value={step.percentage}
                        onChange={(value) => updateStepPercentage(index, value)}
                        placeholder="បញ្ចូលភាគរយ"
                      />
                    </Form.Item>
                    
                    <Form.Item
                      label="ចំនួនទឹកប្រាក់ (Amount)"
                      required
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        precision={2}
                        prefix="$"
                        value={step.amount}
                        onChange={(value) => updateStepAmount(index, value)}
                        placeholder="បញ្ចូលចំនួនទឹកប្រាក់"
                      />
                    </Form.Item>
                    
                    <Form.Item
                      label="កាលបរិច្ឆេទត្រូវបង់ (Due Date)"
                      required
                    >
                      <DatePicker
                        style={{ width: '100%' }}
                        value={step.due_date ? dayjs(step.due_date) : null}
                        onChange={(date) => updateStepDate(index, date)}
                        placeholder="ជ្រើសរើសកាលបរិច្ឆេទ"
                        format={(value) => formatKhmerDate(value)}
                      />
                    </Form.Item>
                  </div>
                  
                  {step.percentage && (
                    <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                      គណនា: {step.percentage}% × ${parseFloat(document.total_land_price).toLocaleString()} = ${parseFloat(step.amount || 0).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <div className="text-center mb-6">
              <Button 
                type="dashed" 
                icon={<PlusOutlined />} 
                onClick={addStep}
              >
                បន្ថែមដំណាក់កាលបង់ប្រាក់
              </Button>
            </div>
          </Form>
          
          <Divider />
          
          <div className="flex justify-between items-center mb-6">
            <Text strong>ចំនួនទឹកប្រាក់សរុប:</Text>
            <Text 
              strong 
              style={{ 
                fontSize: '1.2rem', 
                color: Math.abs(totalPayment - parseFloat(document.total_land_price)) > 0.01 ? 'red' : 'green' 
              }}
            >
              ${totalPayment.toLocaleString()}
            </Text>
          </div>
          
          {Math.abs(totalPayment - parseFloat(document.total_land_price)) > 0.01 && (
            <div className="mb-6 p-2 bg-red-50 border border-red-200 rounded text-center">
              <Text type="danger">
                ចំនួនទឹកប្រាក់សរុបត្រូវតែស្មើនឹងតម្លៃដីសរុប (${parseFloat(document.total_land_price).toLocaleString()})
              </Text>
            </div>
          )}
          
          <div className="flex justify-between mt-6">
            <Button href={route('sale-contracts.select-lands', { id: document.id })}>
              ត្រឡប់
            </Button>
            <Button 
              type="primary" 
              onClick={handleGenerate}
              loading={loading}
              disabled={Math.abs(totalPayment - parseFloat(document.total_land_price)) > 0.01 || hasEmptyFields}
            >
              បង្កើតកិច្ចសន្យា
            </Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
