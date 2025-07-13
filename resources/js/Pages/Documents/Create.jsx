import React, { useEffect, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card, Button, Result, Spin } from 'antd';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Create({ type }) {
  const documentType = type || 'deposit_contract';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Store document type in session storage instead of creating a database record immediately
    try {
      // Store the document type in session storage
      sessionStorage.setItem('document_type', documentType);
      
      // Redirect to the buyers selection page based on document type
      const routeName = documentType === 'deposit_contract'
        ? 'deposit-contracts.select-buyers'
        : 'sale-contracts.select-buyers';
        
      // Redirect to the first step (select buyers) without an ID
      window.location.href = route(routeName);
    } catch (error) {
      console.error('Error initializing document creation:', error);
      setError('មានបញ្ហាក្នុងការបង្កើតឯកសារ សូមព្យាយាមម្តងទៀត');
      setLoading(false);
    }
  }, [documentType]);

  return (
    <AdminLayout>
      <Head title={error ? "មានបញ្ហា" : "កំពុងបង្កើតឯកសារ"} />
      
      <div className="container mx-auto py-6">
        <Card className="text-center">
          {error ? (
            <Result
              status="error"
              title="មានបញ្ហា"
              subTitle={error}
              extra={[
                <Button key="back" href={documentType === 'deposit_contract' ? route('deposit-contracts.index') : route('sale-contracts.index')}>
                  ត្រឡប់ក្រោយ
                </Button>,
                <Button key="retry" type="primary" onClick={() => window.location.reload()}>
                  ព្យាយាមម្តងទៀត
                </Button>
              ]}
            />
          ) : (
            <Result
              icon={<Spin size="large" />}
              title="កំពុងបង្កើតឯកសារ"
              subTitle="សូមរង់ចាំមួយភ្លែត..."
            />
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
