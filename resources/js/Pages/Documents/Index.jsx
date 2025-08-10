import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, Row, Col, Typography, Space } from 'antd';
import { FileProtectOutlined, FileTextOutlined } from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout';

const { Title, Text } = Typography;

export default function DocumentTypeSelection() {
  return (
    <AdminLayout>
      <Head title="បង្កើតកិច្ចសន្យាថ្មី" />
      
      <div className="container mx-auto py-6">
        <Title level={2} className="mb-6">បង្កើតកិច្ចសន្យាថ្មី</Title>
        
        <Row gutter={[24, 24]} className="mt-8">
          <Col xs={24} md={12}>
            <Link href={route('documents.create', { type: 'deposit_contract' })} className="no-underline">
              <Card 
                hoverable 
                className="text-center h-full flex flex-col justify-between"
                bodyStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
              >
                <Space direction="vertical" size="large" align="center">
                  <FileProtectOutlined style={{ fontSize: 64, color: '#1890ff' }} />
                  <div>
                    <Title level={3}>លិខិតកក់ប្រាក់</Title>
                    <Text>បង្កើតលិខិតកក់ប្រាក់សម្រាប់ការទិញដី</Text>
                  </div>
                </Space>
              </Card>
            </Link>
          </Col>
          
          <Col xs={24} md={12}>
            <Link href={route('documents.create', { type: 'sale_contract' })} className="no-underline">
              <Card 
                hoverable 
                className="text-center h-full flex flex-col justify-between"
                bodyStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
              >
                <Space direction="vertical" size="large" align="center">
                  <FileTextOutlined style={{ fontSize: 64, color: '#52c41a' }} />
                  <div>
                    <Title level={3}>លិខិតទិញ លក់</Title>
                    <Text>បង្កើតកិច្ចសន្យាលក់ទិញដីពេញលេញ</Text>
                  </div>
                </Space>
              </Card>
            </Link>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
}
