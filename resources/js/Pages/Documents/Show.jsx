import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, Button, Typography, Descriptions, Tag, Divider, Space } from 'antd';
import { ArrowLeftOutlined, FilePdfOutlined, EditOutlined } from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout';

const { Title, Text } = Typography;

export default function ShowDocument({ document }) {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('km-KH', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Get document type display name
  const getDocumentTypeDisplay = (type) => {
    return type === 'deposit_contract' ? 'លិខិតកក់ប្រាក់' : 'លិខិតទិញ លក់';
  };

  return (
    <AdminLayout>
      <Head title={`កិច្ចសន្យាលេខ ${document.id}`} />
      
      <div className="container mx-auto py-6">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <Space>
              <Link href={route('documents.list')}>
                <Button icon={<ArrowLeftOutlined />}>
                  ត្រឡប់ក្រោយ
                </Button>
              </Link>
              <Title level={3} className="m-0">ព័ត៌មានលម្អិតនៃកិច្ចសន្យា</Title>
            </Space>
            
            <Space>
              <Link href={`/documents/${document.id}/download`} target="_blank">
                <Button icon={<FilePdfOutlined />}>
                  ទាញយកកិច្ចសន្យា PDF
                </Button>
              </Link>
            </Space>
          </div>
          
          <Divider />
          
          <div className="max-w-3xl mx-auto">
            <Descriptions bordered column={{ xs: 1, sm: 2 }}>
              <Descriptions.Item label="លេខសម្គាល់">
                {document.id}
              </Descriptions.Item>
              <Descriptions.Item label="ប្រភេទកិច្ចសន្យា">
                <Tag color={document.document_type === 'deposit_contract' ? 'blue' : 'green'}>
                  {getDocumentTypeDisplay(document.document_type)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="កាលបរិច្ឆេទបង្កើត">
                {formatDate(document.created_at)}
              </Descriptions.Item>
              <Descriptions.Item label="បង្កើតដោយ">
                {document.creator ? document.creator.name : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="តម្លៃដីសរុប" span={2}>
                ${parseFloat(document.total_land_price).toLocaleString()}
              </Descriptions.Item>
              
              {document.document_type === 'deposit_contract' && (
                <>
                  <Descriptions.Item label="ចំនួនប្រាក់កក់">
                    ${parseFloat(document.deposit_amount).toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="រយៈពេលកក់ប្រាក់">
                    {document.deposit_months} ខែ
                  </Descriptions.Item>
                </>
              )}
            </Descriptions>
            
            <div className="mt-6">
              <Title level={5} className="mb-2">អ្នកទិញ</Title>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {document.buyers.map(buyer => (
                  <div key={buyer.id} className="border p-3 rounded">
                    <div><strong>ឈ្មោះ:</strong> {buyer.name}</div>
                    <div><strong>លេខអត្តសញ្ញាណប័ណ្ណ:</strong> {buyer.identity_number}</div>
                    <div><strong>លេខទូរស័ព្ទ:</strong> {buyer.phone_number}</div>
                    <div><strong>អាសយដ្ឋាន:</strong> {buyer.address}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-4">
              <Title level={5} className="mb-2">អ្នកលក់</Title>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {document.sellers.map(seller => (
                  <div key={seller.id} className="border p-3 rounded">
                    <div><strong>ឈ្មោះ:</strong> {seller.name}</div>
                    <div><strong>លេខអត្តសញ្ញាណប័ណ្ណ:</strong> {seller.identity_number}</div>
                    <div><strong>លេខទូរស័ព្ទ:</strong> {seller.phone_number}</div>
                    <div><strong>អាសយដ្ឋាន:</strong> {seller.address}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-4">
              <Title level={5} className="mb-2">ដី</Title>
              <div className="grid grid-cols-1 gap-2">
                {document.lands.map(land => (
                  <div key={land.id} className="border p-3 rounded">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div><strong>លេខក្បាលដី:</strong> {land.plot_number}</div>
                      <div><strong>ទំហំ:</strong> {land.size} m²</div>
                      <div><strong>ទីតាំង:</strong> {land.location}</div>
                      <div><strong>តម្លៃ:</strong> ${parseFloat(land.pivot.total_price).toLocaleString()}</div>
                      {land.pivot.price_per_m2 && (
                        <div><strong>តម្លៃក្នុង 1m²:</strong> ${parseFloat(land.pivot.price_per_m2).toLocaleString()}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {document.document_type === 'sale_contract' && document.payment_steps.length > 0 && (
              <div className="mt-4">
                <Title level={5} className="mb-2">ដំណាក់កាលបង់ប្រាក់</Title>
                <div className="grid grid-cols-1 gap-2">
                  {document.payment_steps.map(step => (
                    <div key={step.id} className="border p-3 rounded">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div><strong>ដំណាក់កាលទី:</strong> {step.step_number}</div>
                        <div><strong>ចំនួនទឹកប្រាក់:</strong> ${parseFloat(step.amount).toLocaleString()}</div>
                        <div><strong>កាលបរិច្ឆេទត្រូវបង់:</strong> {formatDate(step.due_date)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
