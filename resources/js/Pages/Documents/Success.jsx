import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, Button, Typography, Result, Descriptions, Tag, Divider } from 'antd';
import { CheckCircleOutlined, FilePdfOutlined, HomeOutlined, PlusOutlined } from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout';

const { Title, Text } = Typography;

export default function Success({ document }) {
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
      <Head title="បង្កើតកិច្ចសន្យាបានជោគជ័យ" />
      
      <div className="container mx-auto py-6">
        <Card>
          <Result
            status="success"
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            title="បង្កើតកិច្ចសន្យាបានជោគជ័យ!"
            subTitle="កិច្ចសន្យារបស់អ្នកត្រូវបានបង្កើតដោយជោគជ័យ"
            extra={[
              <Button 
                key="download" 
                type="primary" 
                icon={<FilePdfOutlined />}
                href={`/documents/${document.id}/download`}
                target="_blank"
              >
                ទាញយកកិច្ចសន្យា PDF
              </Button>,
              <Button 
                key="create-new" 
                icon={<PlusOutlined />}
                href={document.document_type === 'deposit_contract' ? route('deposit-contracts.index') : route('sale-contracts.index')}
              >
                បង្កើតកិច្ចសន្យាថ្មី
              </Button>,
              <Button 
                key="home" 
                icon={<HomeOutlined />}
                href={route('dashboard')}
              >
                ទៅទំព័រដើម
              </Button>,
            ]}
          />
          
          <Divider />
          
          <div className="max-w-3xl mx-auto">
            <Title level={4} className="mb-4">ព័ត៌មានលម្អិតនៃកិច្ចសន្យា</Title>
            
            <Descriptions bordered column={{ xs: 1, sm: 2 }}>
              <Descriptions.Item label="ប្រភេទកិច្ចសន្យា">
                <Tag color={document.document_type === 'deposit_contract' ? 'blue' : 'green'}>
                  {getDocumentTypeDisplay(document.document_type)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="កាលបរិច្ឆេទបង្កើត">
                {formatDate(document.created_at)}
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
                {document.buyers && document.buyers.length > 0 ? (
                  document.buyers.map(buyerRel => (
                    <div key={buyerRel.id} className="border p-2 rounded">
                      {buyerRel.buyer ? (
                        <>
                          {buyerRel.buyer.name} - {buyerRel.buyer.phone_number}
                        </>
                      ) : (
                        'អ្នកទិញមិនមានទិន្នន័យ'
                      )}
                    </div>
                  ))
                ) : (
                  <div className="border p-2 rounded">មិនមានអ្នកទិញ</div>
                )}
              </div>
            </div>
            
            <div className="mt-4">
              <Title level={5} className="mb-2">អ្នកលក់</Title>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {document.sellers && document.sellers.length > 0 ? (
                  document.sellers.map(sellerRel => (
                    <div key={sellerRel.id} className="border p-2 rounded">
                      {sellerRel.seller ? (
                        <>
                          {sellerRel.seller.name} - {sellerRel.seller.phone_number}
                        </>
                      ) : (
                        'អ្នកលក់មិនមានទិន្នន័យ'
                      )}
                    </div>
                  ))
                ) : (
                  <div className="border p-2 rounded">មិនមានអ្នកលក់</div>
                )}
              </div>
            </div>
            
            <div className="mt-4">
              <Title level={5} className="mb-2">ដី</Title>
              <div className="grid grid-cols-1 gap-2">
                {document.lands && document.lands.length > 0 ? (
                  document.lands.map(landRel => (
                    <div key={landRel.id} className="border p-2 rounded">
                      {landRel.land ? (
                        <>
                          <div className="flex justify-between">
                            <span>លេខក្បាលដី: {landRel.land.plot_number}</span>
                            <span>ទំហំ: {landRel.land.size} m²</span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span>ទីតាំង: {landRel.land.location || 'N/A'}</span>
                            <span>តម្លៃ: ${landRel.total_price ? parseFloat(landRel.total_price).toLocaleString() : 'N/A'}</span>
                          </div>
                        </>
                      ) : (
                        'ដីមិនមានទិន្នន័យ'
                      )}
                    </div>
                  ))
                ) : (
                  <div className="border p-2 rounded">មិនមានដី</div>
                )}
              </div>
            </div>
            
            {document.document_type === 'sale_contract' && document.payment_steps.length > 0 && (
              <div className="mt-4">
                <Title level={5} className="mb-2">ដំណាក់កាលបង់ប្រាក់</Title>
                <div className="grid grid-cols-1 gap-2">
                  {document.payment_steps.map(step => (
                    <div key={step.id} className="border p-2 rounded">
                      <div className="flex justify-between">
                        <span>ដំណាក់កាលទី {step.step_number}</span>
                        <span>ចំនួនទឹកប្រាក់: ${parseFloat(step.amount).toLocaleString()}</span>
                      </div>
                      <div className="mt-1">
                        <span>កាលបរិច្ឆេទត្រូវបង់: {formatDate(step.due_date)}</span>
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
