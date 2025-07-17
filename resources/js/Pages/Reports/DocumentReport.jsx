import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Input, Button, Card, Table, Collapse, Space, 
    Typography, Tag, message, Spin, Tooltip, Popconfirm 
} from 'antd';
import { 
    SearchOutlined, DownloadOutlined, FileTextOutlined, 
    UploadOutlined, ExpandOutlined, FileExcelOutlined, 
    FilePdfOutlined, CheckCircleOutlined, ClockCircleOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
import DocumentUploadModal from './Components/DocumentUploadModal';
import DocumentListModal from './Components/DocumentListModal';

const { Title, Text } = Typography;
const { Panel } = Collapse;

export default function DocumentReport({ auth }) {
    const [contractId, setContractId] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchResult, setSearchResult] = useState(null);
    const [uploadModalVisible, setUploadModalVisible] = useState(false);
    const [listModalVisible, setListModalVisible] = useState(false);
    const [selectedPaymentStep, setSelectedPaymentStep] = useState(null);
    // Add state for the sale contract
    const [saleContract, setSaleContract] = useState(null);

    // Handle contract search
    const handleSearch = async () => {
        if (!contractId.trim()) {
            message.error('សូមបញ្ចូលលេខកិច្ចសន្យា');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/api/reports/document/search', {
                contract_id: contractId.trim()
            });
            
            // Debug: Log the search result structure
            console.log('Search result:', response.data);
            
            setSearchResult(response.data);
            
            // Set the sale contract from the search result
            if (response.data && response.data.contract) {
                console.log('Found contract in search result:', response.data.contract);
                setSaleContract(response.data.contract);
            } else {
                console.log('No contract found in search result. Structure:', response.data);
                setSaleContract(null);
            }
            
            message.success('រកឃើញកិច្ចសន្យា');
        } catch (error) {
            console.error('បញ្ហាក្នុងការស្វែងរក:', error);
            message.error(error.response?.data?.error || 'មិនរកឃើញកិច្ចសន្យា');
            setSearchResult(null);
        } finally {
            setLoading(false);
        }
    };

    // Handle payment contract creation
    const handleCreateContract = async (paymentStepId) => {
        try {
            setLoading(true);
            const response = await axios.post(`/api/reports/payment-steps/${paymentStepId}/create-contract`);
            message.success('បង្កើតកិច្ចសន្យាបង់ប្រាក់ជោគជ័យ');
            
            // Refresh search results
            handleSearch();
        } catch (error) {
            console.error('បញ្ហាក្នុងការបង្កើតកិច្ចសន្យា:', error);
            message.error(error.response?.data?.error || 'មិនអាចបង្កើតកិច្ចសន្យាបង់ប្រាក់');
        } finally {
            setLoading(false);
        }
    };

    // Handle marking payment step as paid
    const handleMarkAsPaidAction = async (paymentStepId) => {
        try {
            setLoading(true);
            const response = await axios.post(`/api/reports/payment-steps/${paymentStepId}/mark-as-paid`);
            message.success('បានកំណត់ថាបានបង់ប្រាក់ហើយ');
            
            // Refresh search results
            handleSearch();
        } catch (error) {
            console.error('បញ្ហាក្នុងការកំណត់ថាបានបង់ប្រាក់:', error);
            message.error(error.response?.data?.error || 'មិនអាចកំណត់ថាបានបង់ប្រាក់');
        } finally {
            setLoading(false);
        }
    };

    // Handle document export
    const handleExport = async (format) => {
        if (!searchResult) return;
        
        try {
            window.open(`/api/reports/document/export/${searchResult.contract.contract_id}?format=${format}`, '_blank');
        } catch (error) {
            console.error('បញ្ហាក្នុងការនាំចេញ:', error);
            message.error('មិនអាចនាំចេញឯកសារ');
        }
    };

    // Show upload document modal
    const showUploadModal = () => {
        console.log('showUploadModal called, saleContract:', saleContract);
        console.log('searchResult:', searchResult);
        
        // Check if we have a sale contract
        if (!saleContract) {
            console.log('No sale contract found, showing error message');
            
            // Try to get the contract from searchResult if available
            if (searchResult && searchResult.contract) {
                console.log('Found contract in searchResult, using it:', searchResult.contract);
                setSaleContract(searchResult.contract);
                setUploadModalVisible(true);
                return;
            }
            
            message.error('សូមស្វែងរកកិច្ចសន្យាមុននឹងផ្ទុកឯកសារ');
            return;
        }
        
        console.log('Setting upload modal visible, saleContract ID:', saleContract.id);
        setUploadModalVisible(true);
    };

    // Show document list modal
    const showListModal = (paymentStep) => {
        // If paymentStep is null, show all documents
        // Otherwise, show documents for specific payment step
        setSelectedPaymentStep(paymentStep);
        setListModalVisible(true);
    };

    // Payment step status tag
    const getStatusTag = (status) => {
        switch (status) {
            case 'paid':
                return <Tag color="green"><CheckCircleOutlined /> បានបង់ប្រាក់រួចរាល់</Tag>;
            case 'unpaid':
            default:
                return <Tag color="red"><ClockCircleOutlined /> មិនទាន់បង់ប្រាក់</Tag>;
        }
    };

    // Payment steps table columns
    const columns = [
        {
            title: 'ដំណាក់កាល',
            dataIndex: 'step_number',
            key: 'step_number',
            width: 120,
            render: (step_number) => `ទី${step_number}`,
        },
        // ការពិពណ៌នា column removed as requested
        {
            title: 'ចំនួនទឹកប្រាក់',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => `$${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            width: 150,
        },
        {
            title: 'កាលបរិច្ឆេទត្រូវបង់ប្រាក់',
            dataIndex: 'due_date',
            key: 'due_date',
            render: (dueDate, record) => {
                const dueDateObj = new Date(dueDate);
                const currentDate = new Date();
                const isOverdue = dueDateObj < currentDate && record.status === 'unpaid';
                
                return isOverdue ? 
                    <Text strong style={{ color: 'red' }}>{dueDate}</Text> : 
                    <Text>{dueDate}</Text>;
            },
        },
        {
            title: 'ស្ថានភាព',
            dataIndex: 'status',
            key: 'status',
            render: (status) => getStatusTag(status),
        },
        {
            title: 'សកម្មភាព',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    {record.status !== 'paid' && (
                        <Popconfirm
                            title="តើអ្នកប្រាកដថាចង់កំណត់ថាបានបង់ប្រាក់នេះមែនទេ?"
                            description="ការសកម្មភាពនេះអាចត្រូវបានប្រព្រឹត្តទៅ"
                            icon={<ExclamationCircleOutlined style={{ color: '#faad14' }} />}
                            okText="បាទ/ចាស"
                            cancelText="ទេ"
                            okButtonProps={{ style: { backgroundColor: '#1890ff', borderColor: '#1890ff' } }}
                            onConfirm={() => handleMarkAsPaidAction(record.id)}
                        >
                            <Button 
                                type="primary" 
                                icon={<CheckCircleOutlined />} 
                                size="small"
                                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                                disabled={record.status === 'paid'}
                            />
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">របាយការណ៍ឯកសារ</h2>}
        >
            <Head title="របាយការណ៍ឯកសារ" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card title="ស្វែងរកកិច្ចសន្យា" className="mb-6">
                        <div className="flex items-center">
                            <Input
                                placeholder="បញ្ចូលលេខកិច្ចសន្យា"
                                value={contractId}
                                onChange={(e) => setContractId(e.target.value)}
                                onPressEnter={handleSearch}
                                style={{ width: '300px' }}
                                prefix={<SearchOutlined />}
                            />
                            <Button 
                                type="primary" 
                                onClick={handleSearch} 
                                loading={loading}
                                className="ml-2"
                            >
                                ស្វែងរក
                            </Button>
                        </div>
                    </Card>

                    {loading && (
                        <div className="text-center my-8">
                            <Spin size="large" />
                        </div>
                    )}

                    {searchResult && (
                        <>
                            <Card 
                                title={`កិច្ចសន្យា: ${searchResult.contract.contract_id}`}
                                className="mb-6"
                                extra={
                                    <Space>
                                        <Button 
                                            icon={<FilePdfOutlined />} 
                                            onClick={() => handleExport('pdf')}
                                        >
                                            នាំចេញជា PDF
                                        </Button>
                                        <Button 
                                            icon={<FileExcelOutlined />} 
                                            onClick={() => handleExport('excel')}
                                        >
                                            នាំចេញជា Excel
                                        </Button>
                                        <Button 
                                            icon={<UploadOutlined />}
                                            onClick={() => showUploadModal()}
                                        >
                                            ផ្ទុកឯកសារ
                                        </Button>
                                        <Button 
                                            icon={<ExpandOutlined />}
                                            onClick={() => showListModal(null)}
                                        >
                                            មើលឯកសារទាំងអស់
                                        </Button>
                                    </Space>
                                }
                            >
                                <Collapse defaultActiveKey={['1', '2', '3']}>
                                    <Panel header="ព័ត៌មានអ្នកទិញ" key="1">
                                        <p><strong>ឈ្មោះ:</strong> {searchResult.contract.buyer_info.name}</p>
                                        <p><strong>ទូរស័ព្ទ:</strong> {searchResult.contract.buyer_info.phone || 'N/A'}</p>
                                        <p><strong>អាសយដ្ឋាន:</strong> {searchResult.contract.buyer_info.address || 'N/A'}</p>
                                    </Panel>
                                    <Panel header="ព័ត៌មានអ្នកលក់" key="2">
                                        <p><strong>ឈ្មោះ:</strong> {searchResult.contract.seller_info.name}</p>
                                        <p><strong>ទូរស័ព្ទ:</strong> {searchResult.contract.seller_info.phone || 'N/A'}</p>
                                        <p><strong>អាសយដ្ឋាន:</strong> {searchResult.contract.seller_info.address || 'N/A'}</p>
                                    </Panel>
                                    <Panel header="ព័ត៌មានដី" key="3">
                                        <p><strong>លេខក្បែងដី:</strong> {searchResult.contract.land_info.plot_number}</p>
                                        <p><strong>ទំហំ:</strong> {searchResult.contract.land_info.size}</p>
                                        <p><strong>ទីតាំង:</strong> {searchResult.contract.land_info.location}</p>
                                    </Panel>
                                </Collapse>
                                
                                <div className="mt-6">
                                    {/* Payment Steps title removed as requested */}
                                    <Table 
                                        columns={columns} 
                                        dataSource={searchResult.payment_steps} 
                                        rowKey="id"
                                        pagination={false}
                                        size="middle"
                                    />
                                </div>
                            </Card>
                        </>
                    )}
                </div>
            </div>

            {/* Document Upload Modal */}
            <DocumentUploadModal
                visible={uploadModalVisible}
                onCancel={() => setUploadModalVisible(false)}
                saleContract={saleContract}
                onSuccess={() => {
                    setUploadModalVisible(false);
                    handleSearch();
                }}
            />

            {/* Document List Modal */}
            <DocumentListModal
                visible={listModalVisible}
                onCancel={() => setListModalVisible(false)}
                paymentStep={selectedPaymentStep}
            />
        </AdminLayout>
    );
}
