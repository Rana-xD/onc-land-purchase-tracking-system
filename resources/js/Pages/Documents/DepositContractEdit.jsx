import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { 
  Card, 
  Form, 
  Input, 
  InputNumber, 
  Button, 
  Typography, 
  Space, 
  Select, 
  message,
  Row,
  Col,
  Divider
} from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout';

const { Title } = Typography;
const { Option } = Select;

export default function DepositContractEdit({ document, buyers, sellers, lands }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set initial form values
    form.setFieldsValue({
      total_land_price: parseFloat(document.total_land_price) || undefined,
      deposit_amount: parseFloat(document.deposit_amount) || undefined,
      deposit_months: document.deposit_months,
      buyers: document.buyers?.map(b => b.buyer_id) || [],
      sellers: document.sellers?.map(s => s.seller_id) || [],
      lands: document.lands?.map(l => l.land_id) || [],
    });
  }, [document, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      router.put(route('deposit-contracts.update', { id: document.id }), values, {
        onSuccess: () => {
          message.success('លិខិតកក់ប្រាក់ត្រូវបានកែសម្រួលដោយជោគជ័យ');
        },
        onError: (errors) => {
          console.error('Validation errors:', errors);
          message.error('មានបញ្ហាក្នុងការកែសម្រួល');
        },
        onFinish: () => {
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Error updating deposit contract:', error);
      message.error('មានបញ្ហាក្នុងការកែសម្រួល');
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.visit(route('deposit-contracts.index'));
  };

  return (
    <AdminLayout>
      <Head title="កែសម្រួលលិខិតកក់ប្រាក់" />
      
      <div className="container mx-auto py-6">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <Title level={3}>កែសម្រួលលិខិតកក់ប្រាក់ #{document.id}</Title>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={handleBack}
            >
              ត្រឡប់ក្រោយ
            </Button>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            size="large"
          >
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="តម្លៃដីសរុប ($)"
                  name="total_land_price"
                  rules={[
                    { required: true, message: 'សូមបញ្ចូលតម្លៃដីសរុប' },
                    { type: 'number', min: 0.01, message: 'តម្លៃត្រូវតែធំជាង 0' }
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    placeholder="បញ្ចូលតម្លៃដីសរុប"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="ចំនួនប្រាក់កក់ ($)"
                  name="deposit_amount"
                  rules={[
                    { required: true, message: 'សូមបញ្ចូលចំនួនប្រាក់កក់' },
                    { type: 'number', min: 0.01, message: 'ចំនួនប្រាក់កក់ត្រូវតែធំជាង 0' }
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    placeholder="បញ្ចូលចំនួនប្រាក់កក់"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="រយៈពេលកក់ប្រាក់"
                  name="deposit_months"
                  rules={[{ required: true, message: 'សូមបញ្ចូលរយៈពេលកក់ប្រាក់' }]}
                >
                  <Input placeholder="ឧ. 3 ខែ, 2 សប្តាហ៍, 10 ថ្ងៃ" />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <Row gutter={24}>
              <Col xs={24} md={8}>
                <Form.Item
                  label="អ្នកទិញ"
                  name="buyers"
                  rules={[{ required: true, message: 'សូមជ្រើសរើសអ្នកទិញ' }]}
                >
                  <Select
                    mode="multiple"
                    placeholder="ជ្រើសរើសអ្នកទិញ"
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {buyers.map(buyer => (
                      <Option key={buyer.id} value={buyer.id}>
                        {buyer.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  label="អ្នកលក់"
                  name="sellers"
                  rules={[{ required: true, message: 'សូមជ្រើសរើសអ្នកលក់' }]}
                >
                  <Select
                    mode="multiple"
                    placeholder="ជ្រើសរើសអ្នកលក់"
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {sellers.map(seller => (
                      <Option key={seller.id} value={seller.id}>
                        {seller.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  label="ដីធ្លី"
                  name="lands"
                  rules={[{ required: true, message: 'សូមជ្រើសរើសដីធ្លី' }]}
                >
                  <Select
                    mode="multiple"
                    placeholder="ជ្រើសរើសដីធ្លី"
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {lands.map(land => (
                      <Option key={land.id} value={land.id}>
                        {land.plot_number} - {land.location}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <div className="flex justify-end mt-6">
              <Space>
                <Button onClick={handleBack}>
                  បោះបង់
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<SaveOutlined />}
                >
                  រក្សាទុកការកែប្រែ
                </Button>
              </Space>
            </div>
          </Form>
        </Card>
      </div>
    </AdminLayout>
  );
}
