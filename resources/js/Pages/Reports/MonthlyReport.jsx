import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, DatePicker, Button, Table, Spin, Tabs, Statistic, Row, Col, Alert, Empty, Tag, Space, Tooltip, Skeleton, Badge, Typography } from 'antd';
import { DownloadOutlined, FileExcelOutlined, FilePdfOutlined, SearchOutlined, CalendarOutlined, InfoCircleOutlined } from '@ant-design/icons';
import './MonthlyReport.css';
import axios from 'axios';
import moment from 'moment';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Text } = Typography;

const MonthlyReport = ({ auth }) => {
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [exportFormat, setExportFormat] = useState(null);
    const [dateRange, setDateRange] = useState([
        moment().startOf('month').subtract(2, 'months'),
        moment().endOf('month')
    ]);
    const [reportData, setReportData] = useState(null);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('summary');

    // Memoize fetchReportData to prevent unnecessary re-renders
    const fetchReportData = useCallback(async () => {
        if (!dateRange[0] || !dateRange[1]) {
            setError('Please select a valid date range');
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
            setActiveTab('summary'); // Reset to summary tab when new data is loaded
        } catch (err) {
            console.error('Error fetching monthly report data:', err);
            setError(err.response?.data?.error || 'Failed to fetch report data');
        } finally {
            setLoading(false);
        }
    }, [dateRange]);  // Only re-create this function when dateRange changes

    const handleExport = useCallback(async (format) => {
        if (!dateRange[0] || !dateRange[1]) {
            setError('Please select a valid date range');
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
            const filename = `monthly_report_${dateRange[0].format('YYYYMMDD')}_to_${dateRange[1].format('YYYYMMDD')}.${format}`;
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
    }, [dateRange]);

    // Generate tabs for each month in the report - memoized to prevent recalculation on every render
    const tabs = useMemo(() => {
        if (!reportData || !reportData.monthly_data) return [];

        const monthTabs = Object.keys(reportData.monthly_data)
            .sort()
            .map(month => {
                const monthData = reportData.monthly_data[month];
                return {
                    key: month,
                    label: (
                        <span>
                            {monthData.month_name}
                            <Tooltip title={`${monthData.payment_steps.length} payment steps`}>
                                <Badge 
                                    count={monthData.payment_steps.length} 
                                    style={{ marginLeft: 8, backgroundColor: '#52c41a' }} 
                                />
                            </Tooltip>
                        </span>
                    ),
                    children: (
                        <MonthlyDetailTab 
                            monthData={monthData} 
                            month={month} 
                        />
                    )
                };
            });

        // Add summary tab at the beginning
        monthTabs.unshift({
            key: 'summary',
            label: 'Summary',
            children: <SummaryTab reportData={reportData} />
        });

        return monthTabs;
    }, [reportData]);  // Only recalculate when reportData changes

    useEffect(() => {
        if (dateRange[0] && dateRange[1]) {
            fetchReportData();
        }
    }, []); // Empty dependency array means this effect runs once on mount
    
    // Handle date range change
    const handleDateRangeChange = (dates) => {
        if (dates && dates.length === 2) {
            setDateRange(dates);
        } else {
            setDateRange(null);
        }
    };

    // Memoize the date range picker to prevent unnecessary re-renders
    const dateRangePicker = useMemo(() => (
        <RangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            format="YYYY-MM-DD"
            allowClear={false}
            style={{ marginRight: 16 }}
        />
    ), [dateRange, handleDateRangeChange]);
    
    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Monthly Report</h2>}
        >
            <Head title="Monthly Report" />

            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4 sm:mb-0">Monthly Report</h1>
                        <div className="flex flex-wrap items-center gap-2">
                            <Tooltip title="Export as PDF">
                                <Button 
                                    type="primary" 
                                    icon={<FilePdfOutlined />} 
                                    onClick={() => handleExport('pdf')} 
                                    loading={exporting && exportFormat === 'pdf'}
                                    disabled={!reportData || loading}
                                >
                                    PDF
                                </Button>
                            </Tooltip>
                            <Tooltip title="Export as Excel">
                                <Button 
                                    type="primary" 
                                    className="bg-green-600 hover:bg-green-500" 
                                    icon={<FileExcelOutlined />} 
                                    onClick={() => handleExport('xlsx')} 
                                    loading={exporting && exportFormat === 'xlsx'}
                                    disabled={!reportData || loading}
                                >
                                    Excel
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </header>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <Card title="Monthly Payment Report" className="monthly-report-card">
                                <div className="filter-section">
                                    <div className="mr-4 mb-2">
                                        <Tooltip title="Select date range for the report">
                                            <RangePicker
                                                value={dateRange}
                                                onChange={handleDateRangeChange}
                                                format="YYYY-MM-DD"
                                                allowClear={false}
                                                className="w-full sm:w-auto"
                                            />
                                        </Tooltip>
                                    </div>
                                    <Button
                                        type="primary"
                                        icon={<SearchOutlined />}
                                        onClick={fetchReportData}
                                        loading={loading}
                                        className="mr-2 mb-2"
                                    >
                                        Generate Report
                                    </Button>
                                </div>

                                {error && (
                                    <Alert
                                        message="Error"
                                        description={error}
                                        type="error"
                                        showIcon
                                        closable
                                        className="error-alert"
                                    />
                                )}

                                <div className="export-buttons">
                                    <Tooltip title="Export as PDF">
                                        <Button 
                                            type="primary" 
                                            icon={<FilePdfOutlined />} 
                                            onClick={() => handleExport('pdf')} 
                                            loading={exporting && exportFormat === 'pdf'}
                                            disabled={!reportData || loading}
                                        >
                                            PDF
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="Export as Excel">
                                        <Button 
                                            type="primary" 
                                            className="bg-green-600 hover:bg-green-500" 
                                            icon={<FileExcelOutlined />} 
                                            onClick={() => handleExport('xlsx')} 
                                            loading={exporting && exportFormat === 'xlsx'}
                                            disabled={!reportData || loading}
                                        >
                                            Excel
                                        </Button>
                                    </Tooltip>
                                </div>

                                {loading ? (
                                    <div className="loading-container">
                                        <Spin size="large" />
                                    </div>
                                ) : reportData ? (
                                    <Tabs 
                                        activeKey={activeTab} 
                                        onChange={setActiveTab}
                                        type="card"
                                        items={tabs}
                                        className="monthly-report-tabs"
                                    />
                                ) : (
                                    <div className="empty-container">
                                        <Empty 
                                            description="Select a date range and generate the report to view payment data" 
                                            image={Empty.PRESENTED_IMAGE_SIMPLE} 
                                        />
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

// Summary Tab Component
const SummaryTab = ({ reportData }) => {
    if (!reportData || !reportData.summary) return null;
    
    // Use useMemo for expensive calculations

    const { summary, monthly_data } = reportData;

    // Prepare data for the monthly breakdown table
    const monthlyTableData = Object.keys(monthly_data).sort().map(month => {
        const data = monthly_data[month];
        return {
            key: month,
            month: data.month_name,
            total: data.total_amount,
            paid: data.total_paid,
            overdue: data.total_overdue,
            pending: data.total_pending,
            count: data.payment_steps.length
        };
    });

    const columns = [
        {
            title: 'Month',
            dataIndex: 'month',
            key: 'month',
        },
        {
            title: 'Total Amount',
            dataIndex: 'total',
            key: 'total',
            render: (text) => `$${Number(text).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            sorter: (a, b) => a.total - b.total,
        },
        {
            title: 'Paid',
            dataIndex: 'paid',
            key: 'paid',
            render: (text) => `$${Number(text).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            sorter: (a, b) => a.paid - b.paid,
        },
        {
            title: 'Overdue',
            dataIndex: 'overdue',
            key: 'overdue',
            render: (text) => (
                <span style={{ color: text > 0 ? 'red' : 'inherit' }}>
                    ${Number(text).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
            ),
            sorter: (a, b) => a.overdue - b.overdue,
        },
        {
            title: 'Pending',
            dataIndex: 'pending',
            key: 'pending',
            render: (text) => `$${Number(text).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            sorter: (a, b) => a.pending - b.pending,
        },
        {
            title: 'Payments',
            dataIndex: 'count',
            key: 'count',
            sorter: (a, b) => a.count - b.count,
        },
    ];

    return (
        <div>
            <Row gutter={16} className="mb-6">
                <Col xs={24} sm={12} md={6}>
                    <Card className="stat-card">
                        <Statistic
                            title="Total Amount"
                            value={reportData.summary.total_amount}
                            precision={2}
                            prefix="$"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="stat-card">
                        <Statistic
                            title="Total Paid"
                            value={reportData.summary.total_paid}
                            precision={2}
                            prefix="$"
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="stat-card">
                        <Statistic
                            title="Total Overdue"
                            value={reportData.summary.total_overdue}
                            precision={2}
                            prefix="$"
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="stat-card">
                        <Statistic
                            title="Total Pending"
                            value={reportData.summary.total_pending}
                            precision={2}
                            prefix="$"
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
            </Row>

            <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Monthly Breakdown</h3>
                <Table
                    columns={columns}
                    dataSource={reportData.summary.monthly_breakdown ? reportData.summary.monthly_breakdown.map((item, index) => ({ ...item, key: index })) : []}
                    pagination={false}
                    size="middle"
                    scroll={{ x: 'max-content' }}
                    bordered
                    className="monthly-report-table"
                    summary={() => (
                        <Table.Summary fixed>
                            <Table.Summary.Row className="summary-row">
                                <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                                <Table.Summary.Cell index={1}>
                                    <Text type="danger">${reportData.summary.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={2}>
                                    <Text type="success">${reportData.summary.total_paid.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={3}>
                                    <Text type="danger">${reportData.summary.total_overdue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={4}>
                                    <Text type="warning">${reportData.summary.total_pending.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    )}
                />
            </div>

            <div className="mt-4 text-sm text-gray-500">
                <p>Report Period: {reportData.summary.start_date} to {reportData.summary.end_date}</p>
                <p>Total Payments: {reportData.summary.payment_steps_count}</p>
            </div>
        </div>
    );
};

// Monthly Detail Tab Component
const MonthlyDetailTab = ({ monthData, month }) => {
    if (!monthData || !monthData.payment_steps) return null;
    
    // Use useMemo to prevent recreating columns array on every render
    const columns = useMemo(() => [
        {
            title: 'Contract ID',
            dataIndex: 'contract_id',
            key: 'contract_id',
            width: 120,
        },
        {
            title: 'Step',
            dataIndex: 'step_number',
            key: 'step_number',
            width: 60,
        },
        {
            title: 'Description',
            dataIndex: 'payment_description',
            key: 'payment_description',
            width: 150,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            width: 100,
            render: (text) => `$${Number(text).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            sorter: (a, b) => a.amount - b.amount,
        },
        {
            title: 'Due Date',
            dataIndex: 'due_date',
            key: 'due_date',
            width: 100,
            sorter: (a, b) => moment(a.due_date).unix() - moment(b.due_date).unix(),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => {
                let color = 'default';
                if (status === 'paid') color = 'success';
                if (status === 'overdue') color = 'error';
                if (status === 'pending') color = 'warning';
                if (status === 'contract_created') color = 'processing';
                
                return <Tag color={color}>{status.replace('_', ' ').toUpperCase()}</Tag>;
            },
            filters: [
                { text: 'Paid', value: 'paid' },
                { text: 'Overdue', value: 'overdue' },
                { text: 'Pending', value: 'pending' },
                { text: 'Contract Created', value: 'contract_created' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Buyer',
            dataIndex: 'buyer_name',
            key: 'buyer_name',
            width: 120,
        },
        {
            title: 'Land Plot',
            dataIndex: ['land_info', 'plot_number'],
            key: 'plot_number',
            width: 100,
        },
        {
            title: 'Location',
            dataIndex: ['land_info', 'location'],
            key: 'location',
            width: 150,
        },
    ], []);  // Empty dependency array means this only runs once

    // Memoize the data source to prevent unnecessary processing on re-renders
    const dataSource = useMemo(() => {
        return monthData.payment_steps.map(step => ({ ...step, key: step.id }));
    }, [monthData.payment_steps]);

    return (
        <div>
            <div className="mb-4">
                <Row gutter={16} className="mb-4">
                    <Col xs={24} sm={8}>
                        <Card className="stat-card">
                            <Statistic
                                title="Month Total"
                                value={monthData.total_amount}
                                precision={2}
                                prefix="$"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className="stat-card">
                            <Statistic
                                title="Paid"
                                value={monthData.total_paid}
                                precision={2}
                                prefix="$"
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className="stat-card">
                            <Statistic
                                title="Overdue"
                                value={monthData.total_overdue}
                                precision={2}
                                prefix="$"
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>

            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={{ 
                    pageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50'],
                    showTotal: (total) => `Total ${total} items`
                }}
                size="middle"
                scroll={{ x: 'max-content' }}
                loading={!monthData.payment_steps}
                bordered
                className="monthly-report-table"
                rowClassName={(record) => record.status === 'overdue' ? 'overdue-payment' : ''}
            />
        </div>
    );
};

export default MonthlyReport;
