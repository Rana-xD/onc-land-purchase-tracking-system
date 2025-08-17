import React, { useState, useCallback, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import {
    Typography,
    Button,
    Card,
    List,
    Row,
    Col,
    Spin,
    Empty,
    message,
    Tag,
    Space,
    Divider,
    Alert,
    Tooltip
} from 'antd';
import { DownloadOutlined, FileExcelOutlined, FilePdfOutlined, DollarOutlined, FileOutlined, FolderOutlined } from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout';
import PaymentStatusReportHTML from '@/Components/PDF/PaymentStatusReportHTML';
import useHTMLToPDF from '@/Hooks/useHTMLToPDF';

const { Title, Text } = Typography;

// Custom styles
const summaryCardStyle = {
    padding: '16px',
    borderRadius: '2px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    height: '100%'
};

const summaryValueStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginTop: '8px',
    display: 'block'
};

const summaryLabelStyle = {
    fontSize: '14px',
    color: 'rgba(0, 0, 0, 0.45)',
    marginBottom: '4px'
};

const PaymentStatusReport = ({ auth }) => {
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [exportFormat, setExportFormat] = useState(null);
    const [reportData, setReportData] = useState(null);
    const [error, setError] = useState(null);
    
    // HTML-to-PDF hook
    const { generatePDFFromComponent } = useHTMLToPDF();

    // Format currency
    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return '$0.00';
        return '$' + new Intl.NumberFormat('en-US').format(amount);
    };

    // Fetch report data
    const fetchReportData = useCallback(async () => {
        setLoading(true);
        setError(null);
        setReportData(null); // Clear previous data while loading

        try {
            const response = await axios.post('/reports/payment-status/data');
            setReportData(response.data);
        } catch (err) {
            console.error('Error fetching payment status report data:', err);
            setError(err.response && err.response.data && err.response.data.error ? err.response.data.error : 'Failed to fetch report data');
            message.error('Failed to load payment status data. Please refresh the page.');
        } finally {
            setLoading(false);
        }
    }, []);
    
    // Load data automatically when component mounts
    useEffect(() => {
        fetchReportData();
    }, [fetchReportData]);

    // Handle export
    const handleExport = useCallback(async (format) => {
        if (!reportData) {
            message.error('សូមទាញយកទិន្នន័យរបាយការណ៍ជាមុនសិន');
            return;
        }

        setExporting(true);
        setExportFormat(format);
        
        try {
            if (format === 'pdf') {
                const filename = `payment_status_report_${new Date().toISOString().split('T')[0]}.pdf`;
                
                const htmlComponent = (
                    <PaymentStatusReportHTML 
                        data={reportData}
                        exportedBy={auth.user.name}
                    />
                );

                const result = await generatePDFFromComponent(htmlComponent, filename);
                
                if (!result.success) {
                    throw new Error(result.error);
                }
                
                message.success('នាំចេញ PDF បានជោគជ័យ');
            } else if (format === 'excel') {
                // Keep existing Excel export logic
                const response = await axios.post('/reports/payment-status/export', { format: 'excel' }, {
                    responseType: 'blob'
                });
                
                const blob = new Blob([response.data], { 
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
                });
                
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `payment_status_report_${new Date().toISOString().split('T')[0]}.xlsx`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                
                message.success('នាំចេញ Excel បានជោគជ័យ');
            }
        } catch (err) {
            console.error(`Error exporting ${format}:`, err);
            message.error(`មានបញ្ហាក្នុងការនាំចេញ: ${err.message}`);
        } finally {
            setExporting(false);
            setExportFormat(null);
        }
    }, [reportData, auth.user.name, generatePDFFromComponent]);

    return (
        <AdminLayout user={auth.user}>
            <Head title="របាយការណ៍ប្រាក់បានបង់/មិនទាន់បង់" />

            <div style={{ padding: '24px' }}>
                <Card style={{ marginBottom: '24px' }}>
                    <Row gutter={16} align="middle">
                        <Col xs={24} sm={12}>
                            <Title level={4} style={{ margin: 0 }}>របាយការណ៍ប្រាក់បានបង់/មិនទាន់បង់</Title>
                        </Col>
                        <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
                            {loading && <Spin />}
                        </Col>
                    </Row>
                </Card>

                {/* Error Message */}
                {error && (
                    <Alert
                        message="Error"
                        description={error}
                        type="error"
                        showIcon
                        style={{ marginBottom: '24px' }}
                    />
                )}

                {/* Summary Section */}
                {!loading && reportData && reportData.contracts && reportData.contracts.length > 0 && (
                    <Row gutter={16} style={{ marginBottom: '24px' }}>
                        <Col xs={24} sm={8} style={{ marginBottom: '16px' }}>
                            <Card style={{ ...summaryCardStyle, backgroundColor: '#e6f7ff' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={summaryLabelStyle}>ចំនួនសរុបទាំងអស់</span>
                                    <span style={{ ...summaryValueStyle }}>
                                        {formatCurrency(reportData.summary.total_amount)}
                                    </span>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} sm={8} style={{ marginBottom: '16px' }}>
                            <Card style={{ ...summaryCardStyle, backgroundColor: '#f6ffed' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={summaryLabelStyle}>ចំនួនបានបង់</span>
                                    <span style={{ ...summaryValueStyle, color: '#52c41a' }}>
                                        {formatCurrency(reportData.summary.total_paid)}
                                    </span>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} sm={8} style={{ marginBottom: '16px' }}>
                            <Card style={{ ...summaryCardStyle, backgroundColor: '#fff1f0' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={summaryLabelStyle}>ចំនួនមិនទាន់បង់</span>
                                    <span style={{ ...summaryValueStyle, color: '#f5222d' }}>
                                        {formatCurrency(reportData.summary.total_unpaid)}
                                    </span>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                )}

                {/* Export Buttons - Only visible after report is generated */}
                {!loading && reportData && reportData.contracts && reportData.contracts.length > 0 && (
                    <Card style={{ marginBottom: '24px' }}>
                        <Row gutter={16} align="middle">
                            <Col xs={24} sm={12}>
                                <Text>ទិន្នន័យរបាយការណ៍</Text>
                            </Col>
                            <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
                                <Space>
                                    <Tooltip title="នាំចេញរបាយការណ៍ជាកិច្ចសន្យា PDF">
                                        <Button 
                                            type="primary"
                                            danger
                                            icon={<FilePdfOutlined />} 
                                            onClick={() => handleExport('pdf')}
                                            loading={exporting && exportFormat === 'pdf'}
                                        >
                                            PDF
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="នាំចេញរបាយការណ៍ជាកិច្ចសន្យា Excel">
                                        <Button 
                                            type="primary"
                                            style={{ backgroundColor: '#52c41a' }}
                                            icon={<FileExcelOutlined />} 
                                            onClick={() => handleExport('excel')}
                                            loading={exporting && exportFormat === 'excel'}
                                        >
                                            Excel
                                        </Button>
                                    </Tooltip>
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                )}

                {/* Loading State */}
                {loading && (
                    <Card style={{ textAlign: 'center', padding: '40px 0' }}>
                        <Spin size="large" />
                        <p style={{ marginTop: 16 }}>កំពុងបង្កើតរបាយការណ៍...</p>
                    </Card>
                )}

                {/* Empty State */}
                {!loading && (!reportData || !reportData.contracts || reportData.contracts.length === 0) && (
                    <Card style={{ textAlign: 'center', padding: '20px 0' }}>
                        <Empty 
                            description={
                                <Text style={{ fontSize: '16px' }}>
                                    មិនមានទិន្នន័យសម្រាប់ការជ្រើសរើសនេះ
                                </Text>
                            }
                            image={<FolderOutlined style={{ fontSize: 60, color: '#ccc' }} />} 
                        />
                        <Divider dashed />
                        <Text type="secondary">
                            កំពុងផ្ទុកទិន្នន័យ...
                        </Text>
                    </Card>
                )}

                {/* Payment Status List */}
                {!loading && reportData && reportData.contracts && reportData.contracts.length > 0 && (
                    <div style={{ backgroundColor: '#fff', marginBottom: '24px' }}>
                        {/* Header Row */}
                        <Row gutter={16} style={{ backgroundColor: '#fafafa', padding: '12px 16px', borderBottom: '1px solid #f0f0f0', marginBottom: '8px', fontWeight: 'bold' }}>
                            <Col xs={24} sm={5} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                <Space>
                                    <FileOutlined />
                                    <Text>លេខកុងត្រា</Text>
                                </Space>
                            </Col>
                            <Col xs={24} sm={5} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                <Space>
                                    <FileOutlined />
                                    <Text>លេខក្បាលដី</Text>
                                </Space>
                            </Col>
                            <Col xs={24} sm={6} md={4} style={{ display: 'flex', alignItems: 'center' }}>
                                <Space>
                                    <FileOutlined />
                                    <Text>អ្នកលក់</Text>
                                </Space>
                            </Col>
                            <Col xs={24} sm={3} md={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <Space>
                                    <DollarOutlined />
                                    <Text>ចំនួនសរុប</Text>
                                </Space>
                            </Col>
                            <Col xs={24} sm={3} md={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <Space>
                                    <DollarOutlined />
                                    <Text>ចំនួនបានបង់</Text>
                                </Space>
                            </Col>
                            <Col xs={24} sm={3} md={5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <Space>
                                    <DollarOutlined />
                                    <Text>ចំនួនមិនទាន់បង់</Text>
                                </Space>
                            </Col>
                        </Row>
                        
                        <List
                            itemLayout="horizontal"
                            dataSource={reportData.contracts}
                            renderItem={item => (
                                <List.Item style={{ background: '#fff', padding: '16px', marginBottom: '8px', borderBottom: '1px solid #f0f0f0' }}>
                                    <Row gutter={16} style={{ width: '100%' }}>
                                        <Col xs={24} sm={5} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Link href={`/reports/document?contract_id=${item.contract_id}`} className="text-blue-600 hover:text-blue-800 font-bold">
                                                {item.contract_id}
                                            </Link>
                                        </Col>
                                        <Col xs={24} sm={5} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            {/* Support for multiple lands */}
                                            {Array.isArray(item.lands) && item.lands.length > 0 ? (
                                                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                                    {item.lands.map((land, index) => (
                                                        <span key={index}>
                                                            {land.plot_number}
                                                        </span>
                                                    ))}
                                                </Space>
                                            ) : (
                                                item.land_plot_number ? <span>{item.land_plot_number}</span> : <span>-</span>
                                            )}
                                        </Col>
                                        <Col xs={24} sm={6} md={4} style={{ display: 'flex', alignItems: 'center' }}>
                                            {/* Seller information */}
                                            {Array.isArray(item.sellers) && item.sellers.length > 0 ? (
                                                <Text>{item.sellers.map(seller => seller.name || 'N/A').join(', ')}</Text>
                                            ) : (
                                                <Text>-</Text>
                                            )}
                                        </Col>
                                        <Col xs={24} sm={3} md={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                            <Text>{formatCurrency(item.total_amount)}</Text>
                                        </Col>
                                        <Col xs={24} sm={3} md={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                            <Text style={{ color: '#52c41a' }}>{formatCurrency(item.paid_amount)}</Text>
                                        </Col>
                                        <Col xs={24} sm={3} md={5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                            <Text style={{ color: '#f5222d' }}>{formatCurrency(item.unpaid_amount)}</Text>
                                        </Col>
                                    </Row>
                                </List.Item>
                            )}
                        />

                        {/* End of list */}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default PaymentStatusReport;
