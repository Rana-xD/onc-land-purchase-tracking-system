import React, { useState, useCallback, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Card, DatePicker, Button, List, Spin, Row, Col, Alert, Empty, Space, Typography, Divider, Tag, Badge, Tooltip, Select } from 'antd';
import { CalendarOutlined, FileExcelOutlined, FilePdfOutlined, FolderOutlined, DownloadOutlined, UserOutlined, HomeOutlined, DollarOutlined, FileOutlined } from '@ant-design/icons';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';
import moment from 'moment';

// Custom Khmer month mapping
const khmerMonths = {
    1: 'មករា',
    2: 'កុម្ភៈ',
    3: 'មីនា',
    4: 'មេសា',
    5: 'ឧសភា',
    6: 'មិថុនា',
    7: 'កក្កដា',
    8: 'សីហា',
    9: 'កញ្ញា',
    10: 'តុលា',
    11: 'វិច្ឆិកា',
    12: 'ធ្នូ'
};

// Format date in Khmer
const formatKhmerDate = (date) => {
    const month = date.month() + 1; // moment months are 0-indexed
    const year = date.year();
    return `${khmerMonths[month]} ${year}`;
};
const { Title, Text } = Typography;

// Custom styles
const headerStyle = {
    backgroundColor: '#fafafa',
    padding: '12px 16px',
    borderBottom: '1px solid #f0f0f0',
    marginBottom: '8px',
    fontWeight: 'bold'
};

const listItemStyle = {
    background: '#fff',
    padding: '16px',
    marginBottom: '8px',
    borderBottom: '1px solid #f0f0f0'
};

const listContainerStyle = {
    backgroundColor: '#fff',
    marginBottom: '24px'
};

const MonthlyReport = ({ auth }) => {
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [exportFormat, setExportFormat] = useState(null);
    const [reportData, setReportData] = useState(null);
    const [error, setError] = useState(null);

    // Initialize start and end months
    const [startMonth, setStartMonth] = useState(moment());
    const [endMonth, setEndMonth] = useState(moment());

    // Generate years and months for dropdowns
    const currentYear = moment().year();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
    const months = [
        { value: 0, label: 'មករា' },
        { value: 1, label: 'កុម្ភៈ' },
        { value: 2, label: 'មីនា' },
        { value: 3, label: 'មេសា' },
        { value: 4, label: 'ឧសភា' },
        { value: 5, label: 'មិថុនា' },
        { value: 6, label: 'កក្កដា' },
        { value: 7, label: 'សីហា' },
        { value: 8, label: 'កញ្ញា' },
        { value: 9, label: 'តុលា' },
        { value: 10, label: 'វិច្ឆិកា' },
        { value: 11, label: 'ធ្នូ' }
    ];

    // Get date range for API calls
    const getDateRange = () => [
        startMonth.clone().startOf('month'),
        endMonth.clone().endOf('month')
    ];

    // Fetch report data when date range changes
    const fetchReportData = useCallback(async () => {
        const dateRange = getDateRange();
        if (!dateRange || !dateRange[0] || !dateRange[1]) {
            setError('សូមជ្រើសរើសកាលបរិច្ឆេទ');
            return;
        }

        setLoading(true);
        setError(null);
        setReportData(null); // Clear previous data while loading

        try {
            const response = await axios.post('/api/reports/monthly/data', {
                start_date: dateRange[0].format('YYYY-MM-DD'),
                end_date: dateRange[1].format('YYYY-MM-DD')
            });

            setReportData(response.data);
        } catch (err) {
            console.error('Error fetching monthly report data:', err);
            setError(err.response && err.response.data && err.response.data.error ? err.response.data.error : 'Failed to fetch report data');
        } finally {
            setLoading(false);
        }
    }, [startMonth, endMonth]);

    // Handle export
    const handleExport = useCallback(async (format) => {
        const dateRange = getDateRange();
        if (!dateRange || !dateRange[0] || !dateRange[1]) {
            setError('សូមជ្រើសរើសកាលបរិច្ឆេទ');
            return;
        }

        setExporting(true);
        setExportFormat(format);

        try {
            const response = await axios.post('/api/reports/monthly/export', {
                start_date: dateRange[0].format('YYYY-MM-DD'),
                end_date: dateRange[1].format('YYYY-MM-DD'),
                format: format
            }, {
                responseType: 'blob'
            });

            // Create a download link and trigger it
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const filename = `monthly_report_${dateRange[0].format('YYYYMMDD')}_to_${dateRange[1].format('YYYYMMDD')}.${format === 'excel' ? 'xlsx' : format}`;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error(`Error exporting report as ${format}:`, err);
            setError(`Failed to export report as ${format}`);
        } finally {
            setExporting(false);
            setExportFormat(null);
        }
    }, [startMonth, endMonth]);

    // Handle month/year changes
    const handleStartMonthChange = (month) => {
        const newDate = startMonth.clone().month(month);
        setStartMonth(newDate);
    };

    const handleStartYearChange = (year) => {
        const newDate = startMonth.clone().year(year);
        setStartMonth(newDate);
    };

    const handleEndMonthChange = (month) => {
        const newDate = endMonth.clone().month(month);
        setEndMonth(newDate);
    };

    const handleEndYearChange = (year) => {
        const newDate = endMonth.clone().year(year);
        setEndMonth(newDate);
    };

    // Set to current month
    const setCurrentMonth = () => {
        const now = moment();
        setStartMonth(now.clone());
        setEndMonth(now.clone());
    };

    // Set to previous month
    const setPreviousMonth = () => {
        const prevMonth = moment().subtract(1, 'month');
        setStartMonth(prevMonth.clone());
        setEndMonth(prevMonth.clone());
    };

    // Set to current year
    const setCurrentYear = () => {
        const now = moment();
        setStartMonth(now.clone().startOf('year'));
        setEndMonth(now.clone());
    };

    // Format Khmer numerals for step numbers
    const formatStepNumber = (number) => {
        return `ដំណាក់កាលទី ${number}`;
    };

    // Format currency
    const formatCurrency = (amount) => {
        return `$${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };
    
    // Load data on component mount
    useEffect(() => {
        fetchReportData();
    }, [fetchReportData]);

    return (
        <AdminLayout user={auth.user}>
            <Head title="របាយការណ៍ប្រចាំខែ" />

            <div className="monthly-report-container" style={{ padding: '24px' }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: 24,
                    borderBottom: '1px solid #f0f0f0',
                    paddingBottom: '12px'
                }}>
                    <Title level={2} style={{ margin: 0 }}>របាយការណ៍ប្រចាំខែ</Title>
                    <Space>
                        <CalendarOutlined style={{ fontSize: '18px' }} />
                        <Text type="secondary" style={{ fontSize: '14px' }}>
                            {`${formatKhmerDate(startMonth)}${!startMonth.isSame(endMonth, 'month') || !startMonth.isSame(endMonth, 'year') ? ` - ${formatKhmerDate(endMonth)}` : ''}`}
                        </Text>
                    </Space>
                </div>
                
                {/* Filter Section */}
                <Card 
                    className="filter-card" 
                    style={{ marginBottom: 24 }}
                    title={
                        <Space>
                            <CalendarOutlined />
                            <span>ជ្រើសរើសខែ</span>
                        </Space>
                    }
                >
                    <Row gutter={16} align="middle">
                        <Col xs={24} sm={16}>
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <div className="mb-2">
                                        <Text type="secondary">ខែចាប់ផ្តើម</Text>
                                    </div>
                                    <Row gutter={8}>
                                        <Col span={12}>
                                            <Select
                                                style={{ width: '100%' }}
                                                value={startMonth.month()}
                                                onChange={handleStartMonthChange}
                                                options={months}
                                            />
                                        </Col>
                                        <Col span={12}>
                                            <Select
                                                style={{ width: '100%' }}
                                                value={startMonth.year()}
                                                onChange={handleStartYearChange}
                                                options={years.map(year => ({ value: year, label: year }))}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={24} md={12}>
                                    <div className="mb-2">
                                        <Text type="secondary">ខែបញ្ចប់</Text>
                                    </div>
                                    <Row gutter={8}>
                                        <Col span={12}>
                                            <Select
                                                style={{ width: '100%' }}
                                                value={endMonth.month()}
                                                onChange={handleEndMonthChange}
                                                options={months}
                                            />
                                        </Col>
                                        <Col span={12}>
                                            <Select
                                                style={{ width: '100%' }}
                                                value={endMonth.year()}
                                                onChange={handleEndYearChange}
                                                options={years.map(year => ({ value: year, label: year }))}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <div style={{ marginTop: 16 }}>
                                <Space>
                                    <Button size="small" onClick={setCurrentMonth}>ខែបច្ចុប្បន្ន</Button>
                                    <Button size="small" onClick={setPreviousMonth}>ខែមុន</Button>
                                    <Button size="small" onClick={setCurrentYear}>ឆ្នាំនេះ</Button>
                                </Space>
                            </div>
                        </Col>
                        <Col xs={24} sm={8} style={{ textAlign: 'right', marginTop: { xs: 16, sm: 0 } }}>
                            <Button 
                                type="primary" 
                                onClick={fetchReportData}
                                loading={loading}
                                icon={<CalendarOutlined />}
                            >
                                បង្កើតរបាយការណ៍
                            </Button>
                        </Col>
                    </Row>
                </Card>

                {/* Error Message */}
                {error && (
                    <Alert 
                        message={error} 
                        type="error" 
                        showIcon 
                        style={{ marginBottom: 24 }} 
                    />
                )}

                {/* Export Buttons - Only visible after generating report */}
                {reportData && !loading && reportData.payments && reportData.payments.length > 0 && (
                    <Card style={{ marginBottom: 16 }}>
                        <Row justify="space-between" align="middle">
                            <Col>
                                <Text strong>
                                    <CalendarOutlined /> របាយការណ៍សម្រាប់: {formatKhmerDate(startMonth)} - {formatKhmerDate(endMonth)}
                                </Text>
                            </Col>
                            <Col>
                                <Space>
                                    <Tooltip title="នាំចេញជា PDF">
                                        <Button 
                                            type="primary"
                                            icon={<FilePdfOutlined />} 
                                            onClick={() => handleExport('pdf')}
                                            loading={exporting && exportFormat === 'pdf'}
                                            danger
                                        >
                                            PDF
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="នាំចេញជា Excel">
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
                {!loading && (!reportData || !reportData.payments || reportData.payments.length === 0) && (
                    <Card style={{ textAlign: 'center', padding: '20px 0' }}>
                        <Empty 
                            description={
                                <Text style={{ fontSize: '16px' }}>
                                    មិនមានទិន្នន័យសម្រាប់ខែដែលបានជ្រើសរើស
                                </Text>
                            }
                            image={<FolderOutlined style={{ fontSize: 60, color: '#ccc' }} />} 
                        />
                        <Divider dashed />
                        <Text type="secondary">
                            សូមជ្រើសរើសខែផ្សេងឬពិនិត្យមើលថាតើមានទិន្នន័យសម្រាប់ខែនេះឬអត់
                        </Text>
                    </Card>
                )}

                {/* Payment List */}
                {!loading && reportData && reportData.payments && reportData.payments.length > 0 && (
                    <div style={listContainerStyle}>
                        {/* Header Row */}
                        <Row gutter={16} style={headerStyle}>
                            <Col xs={24} sm={6} md={4}>
                                <Space>
                                    <FileOutlined />
                                    <Text>លេខកុងត្រា</Text>
                                </Space>
                            </Col>
                            <Col xs={24} sm={6} md={4}>
                                <Space>
                                    <HomeOutlined />
                                    <Text>លេខដី</Text>
                                </Space>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Space>
                                    <UserOutlined />
                                    <Text>អ្នកលក់/អ្នកទិញ</Text>
                                </Space>
                            </Col>
                            <Col xs={24} sm={12} md={5}>
                                <Space>
                                    <CalendarOutlined />
                                    <Text>ដំណាក់កាល</Text>
                                </Space>
                            </Col>
                            <Col xs={24} sm={12} md={5} style={{ textAlign: 'right', paddingRight: '24px' }}>
                                <Space>
                                    <DollarOutlined />
                                    <Text>ចំនួនទឹកប្រាក់</Text>
                                </Space>
                            </Col>
                        </Row>
                        
                        <List
                            itemLayout="horizontal"
                            dataSource={reportData.payments}
                            renderItem={item => (
                                <List.Item style={listItemStyle}>
                                    <Row gutter={16} style={{ width: '100%' }}>
                                        <Col xs={24} sm={6} md={4}>
                                            <Link href={`/reports/document?contract_id=${item.contract_id}`} className="text-blue-600 hover:text-blue-800 font-bold">
                                                {item.contract_id}
                                            </Link>
                                        </Col>
                                        <Col xs={24} sm={6} md={4}>
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
                                        <Col xs={24} sm={12} md={6}>
                                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                                {/* Sellers */}
                                                {Array.isArray(item.sellers) && item.sellers.length > 0 ? (
                                                    <div>
                                                        <Text type="secondary" style={{ fontSize: '12px' }}>អ្នកលក់:</Text>
                                                        <div>
                                                            {item.sellers.map((seller, index) => (
                                                                <Tooltip title={seller.full_info} key={index}>
                                                                    <span>
                                                                        {index > 0 ? ', ' : ''}
                                                                    {seller.name}
                                                                    </span>
                                                                </Tooltip>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <Text type="secondary" style={{ fontSize: '12px' }}>អ្នកលក់:</Text>
                                                        <div>{item.seller_names || '-'}</div>
                                                    </div>
                                                )}
                                                
                                                {/* Buyers */}
                                                {Array.isArray(item.buyers) && item.buyers.length > 0 ? (
                                                    <div>
                                                        <Text type="secondary" style={{ fontSize: '12px' }}>អ្នកទិញ:</Text>
                                                        <div>
                                                            {item.buyers.map((buyer, index) => (
                                                                <Tooltip title={buyer.full_info} key={index}>
                                                                    <span>
                                                                        {index > 0 ? ', ' : ''}
                                                                    {buyer.name}
                                                                    </span>
                                                                </Tooltip>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <Text type="secondary" style={{ fontSize: '12px' }}>អ្នកទិញ:</Text>
                                                        <div>{item.buyer_names || '-'}</div>
                                                    </div>
                                                )}
                                            </Space>
                                        </Col>
                                        <Col xs={24} sm={12} md={5}>
                                            {formatStepNumber(item.step_number)}
                                        </Col>
                                        <Col xs={24} sm={12} md={5} style={{ textAlign: 'right', paddingRight: '24px' }}>
                                            <Text strong>{formatCurrency(item.amount)}</Text>
                                        </Col>
                                    </Row>
                                </List.Item>
                            )}
                        />

                        {/* Total Section */}
                        <Row>
                            <Col xs={0} sm={0} md={19}></Col>
                            <Col xs={24} sm={12} md={5} style={{ textAlign: 'right', marginTop: 16, paddingRight: '24px' }}>
                                <Space>
                                    <Text type="secondary" style={{ fontSize: '16px' }}>ចំនួនសរុប:</Text>
                                    <Text strong style={{ fontSize: '18px' }}>{formatCurrency(reportData.summary.total_amount)}</Text>
                                </Space>
                            </Col>
                        </Row>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default MonthlyReport;
