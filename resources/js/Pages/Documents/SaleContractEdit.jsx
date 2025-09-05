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
  Divider,
  DatePicker,
  Table
} from 'antd';
import { SaveOutlined, ArrowLeftOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout';
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function SaleContractEdit({ document, buyers, sellers, lands }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [paymentSteps, setPaymentSteps] = useState([]);

  useEffect(() => {
    // Set initial form values
    const initialPaymentSteps = document.payment_steps?.map((step, index) => ({
      key: index,
      amount: step.amount,
      due_date: moment(step.due_date),
      description: step.description || '',
    })) || [];

    setPaymentSteps(initialPaymentSteps);

    form.setFieldsValue({
      total_land_price: document.total_land_price,
      buyers: document.buyers?.map(b => b.buyer_id) || [],
      sellers: document.sellers?.map(s => s.seller_id) || [],
      lands: document.lands?.map(l => l.land_id) || [],
    });
  }, [document, form]);

  const handleSubmit = async (values) => {
    if (paymentSteps.length === 0) {
      message.error('សូមបន្ថែមដំណាក់កាលបង់ប្រាក់យ៉ាងហោចណាស់មួយ');
      return;
    }

    setLoading(true);
    try {
      const formattedPaymentSteps = paymentSteps.map(step => ({
        amount: step.amount,
        due_date: step.due_date.format('YYYY-MM-DD'),
        description: step.description,
      }));

      const submitData = {
        ...values,
        payment_steps: formattedPaymentSteps,
      };

      router.put(route('sale-contracts.update', { id: document.id }), submitData, {
        onSuccess: () => {
          message.success('លិខិតទិញលក់ត្រូវបានកែសម្រួលដោយជោគជ័យ');
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
      console.error('Error updating sale contract:', error);
      message.error('មានបញ្ហាក្នុងការកែសម្រួល');
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.visit(route('sale-contracts.index'));
  };

  const addPaymentStep = () => {
    const newStep = {
      key: Date.now(),
      amount: 0,
      due_date: moment(),
      description: '',
    };
    setPaymentSteps([...paymentSteps, newStep]);
  };

  const removePaymentStep = (key) => {
    setPaymentSteps(paymentSteps.filter(step => step.key !== key));
  };

  const updatePaymentStep = (key, field, value) => {
    setPaymentSteps(paymentSteps.map(step => 
      step.key === key ? { ...step, [field]: value } : step
    ));
  };

  const paymentStepColumns = [
    {
      title: 'ចំនួនទឹកប្រាក់ ($)',
      dataIndex: 'amount',
      key: 'amount',
      render: (value, record) => (
        <InputNumber
          value={value}
          onChange={(val) => updatePaymentStep(record.key, 'amount', val)}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          style={{ width: '100%' }}
          min={0}
        />
      ),
    },
    {
      title: 'កាលបរិច្ឆេទកំណត់',
      dataIndex: 'due_date',
      key: 'due_date',
      render: (value, record) => (
        <DatePicker
          value={value}
          onChange={(date) => updatePaymentStep(record.key, 'due_date', date)}
          style={{ width: '100%' }}
          format="DD/MM/YYYY"
        />
      ),
    },
    {
      title: 'ការពិពណ៌នា',
      dataIndex: 'description',
      key: 'description',
      render: (value, record) => (
        <Input
          value={value}
          onChange={(e) => updatePaymentStep(record.key, 'description', e.target.value)}
          placeholder="ការពិពណ៌នាដំណាក់កាល"
        />
      ),
    },
    {
      title: 'សកម្មភាព',
      key: 'action',
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removePaymentStep(record.key)}
        />
      ),
    },
  ];

  return (
    <AdminLayout>
      <Head title="កែសម្រួលលិខិតទិញលក់" />
      
      <div className="container mx-auto py-6">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <Title level={3}>កែសម្រួលលិខិតទិញលក់ #{document.id}</Title>
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
                    { type: 'number', min: 0, message: 'តម្លៃត្រូវតែធំជាង 0' }
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

            <Divider />

            <div className="mb-4">
              <div className="flex justify-between items-center mb-4">
                <Title level={4}>ដំណាក់កាលបង់ប្រាក់</Title>
                <Button 
                  type="dashed" 
                  icon={<PlusOutlined />}
                  onClick={addPaymentStep}
                >
                  បន្ថែមដំណាក់កាល
                </Button>
              </div>

              <Table
                columns={paymentStepColumns}
                dataSource={paymentSteps}
                pagination={false}
                locale={{ emptyText: 'មិនមានដំណាក់កាលបង់ប្រាក់' }}
              />
            </div>

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
