import React, { useState, useCallback, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import {
    Typography,
    Button,
    Table,
    Row,
    Col,
    Spin,
    Empty,
    message,
    Card,
    Space,
    Divider,
    Alert,
    Select,
    Tooltip
} from 'antd';
import { DownloadOutlined, FileExcelOutlined, FilePdfOutlined, DollarOutlined, FileOutlined, CalendarOutlined } from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout';
import moment from 'moment';

const { Title, Text } = Typography;

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

// Custom CSS styles
const styles = {
    totalColumnHeader: {
        backgroundColor: '#f0f5ff',
        fontWeight: 'bold',
    },
    totalColumn: {
        backgroundColor: '#f9f9ff',
    },
};

const YearlyReport = ({ auth }) => {
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [exportFormat, setExportFormat] = useState(null);
    const [reportData, setReportData] = useState(null);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState(moment().year());
    
    // Format currency
    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return '$0.00';
        return '$' + new Intl.NumberFormat('en-US').format(amount);
    };

    // Fetch report data
    const fetchReportData = useCallback(async (year) => {
        setLoading(true);
        setError(null);
        setReportData(null); // Clear previous data while loading

        try {
            const response = await axios.post('/reports/yearly/data', { year });
            console.log('Yearly report data:', response.data);
            
            // Make sure lands data is properly formatted
            if (response.data && response.data.contracts) {
                response.data.contracts = response.data.contracts.map(contract => {
                    console.log('Contract lands:', contract.lands);
                    return contract;
                });
            }
            
            setReportData(response.data);
        } catch (err) {
            console.error('Error fetching yearly report data:', err);
            setError(err.response && err.response.data && err.response.data.error ? err.response.data.error : 'Failed to fetch report data');
            message.error('Failed to load yearly report data. Please refresh the page.');
        } finally {
            setLoading(false);
        }
    }, []);
    
    // Load data automatically when component mounts or year changes
    useEffect(() => {
        fetchReportData(selectedYear);
    }, [fetchReportData, selectedYear]);

    // Handle export
    const handleExport = useCallback(async (format) => {
        setExporting(true);
        setExportFormat(format);
        message.loading(`Preparing ${format.toUpperCase()} export...`);
        
        try {
            const response = await axios.post('/reports/yearly/export', { 
                format,
                year: selectedYear
            }, {
                responseType: 'blob'
            });
            
            // Create a blob from the response data
            const blob = new Blob(
                [response.data], 
                { type: format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'application/pdf' }
            );
            
            // Create a link element and trigger download
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `yearly_report_${selectedYear}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            message.success(`${format.toUpperCase()} export completed successfully`);
        } catch (err) {
            console.error(`Error exporting ${format}:`, err);
            message.error(`Failed to export ${format.toUpperCase()}. Please try again.`);
        } finally {
            setExporting(false);
            setExportFormat(null);
        }
    }, [selectedYear]);

    // Handle year change
    const handleYearChange = (year) => {
        setSelectedYear(year);
    };
    
    // Generate year options for the select dropdown
    const yearOptions = [];
    const currentYear = moment().year();
    for (let i = currentYear - 5; i <= currentYear; i++) {
        yearOptions.push({ value: i, label: i });
    }

    // Generate table columns for months
    const generateMonthColumns = () => {
        const monthColumns = [];
        
        for (let month = 1; month <= 12; month++) {
            monthColumns.push({
                title: `${month.toString().padStart(2, '0')}/${selectedYear.toString().slice(-2)}`,
                align: 'center',
                children: [
                    {
                        title: 'បានបង់',
                        dataIndex: ['monthly_data', month, 'paid'],
                        key: `month_${month}_paid`,
                        width: 100,
                        align: 'center', // Center the header text
                        render: (text) => <Text style={{ color: '#52c41a', display: 'block', textAlign: 'right' }}>{formatCurrency(text || 0)}</Text>,
                    },
                    {
                        title: 'មិនទាន់បង់',
                        dataIndex: ['monthly_data', month, 'unpaid'],
                        key: `month_${month}_unpaid`,
                        width: 100,
                        align: 'center', // Center the header text
                        render: (text) => <Text style={{ color: '#f5222d', display: 'block', textAlign: 'right' }}>{formatCurrency(text || 0)}</Text>,
                    }
                ]
            });
        }
        
        return monthColumns;
    };
    
    // Render function for lands column
    const renderLands = (lands, record) => {
        if (!lands || lands.length === 0) {
            return <Text>-</Text>;
        }
        
        return (
            <div>
                {lands.map((land, index) => (
                    <div key={`land_${index}`}>
                        <Text>{land.plot_number || 'N/A'}</Text>
                    </div>
                ))}
            </div>
        );
    };
    
    // Define table columns
    const columns = [
        {
            title: 'លេខកិច្ចសន្យា',
            dataIndex: 'contract_id',
            key: 'contract_id',
            fixed: 'left',
            width: 150,
            align: 'center',
        },
        {
            title: 'ដីឡូត៍',
            dataIndex: 'lands',
            key: 'lands',
            fixed: 'left',
            width: 150,
            align: 'center',
            render: renderLands
        },
        ...generateMonthColumns(),
        {
            title: 'ទឹកប្រាក់សរុប',
            align: 'center',
            className: 'total-column-header',
            children: [
                {
                    title: 'បានបង់',
                    dataIndex: 'paid_amount',
                    key: 'paid_amount',
                    width: 120,
                    align: 'center', // Center the header text
                    className: 'total-column',
                    render: (text) => <Text style={{ color: '#52c41a', display: 'block', textAlign: 'right' }}>{formatCurrency(text || 0)}</Text>,
                },
                {
                    title: 'មិនទាន់បង់',
                    dataIndex: 'unpaid_amount',
                    key: 'unpaid_amount',
                    width: 120,
                    align: 'center', // Center the header text
                    className: 'total-column',
                    render: (text) => <Text style={{ color: '#f5222d', display: 'block', textAlign: 'right' }}>{formatCurrency(text || 0)}</Text>,
                },
                {
                    title: 'សរុប',
                    dataIndex: 'total_amount',
                    key: 'total_amount',
                    width: 120,
                    align: 'center', // Center the header text
                    className: 'total-column',
                    render: (text) => <Text strong style={{ fontSize: '16px', display: 'block', textAlign: 'right' }}>{formatCurrency(text || 0)}</Text>,
                }
            ]
        }
    ];

    // Calculate summary data for the table footer
    const getSummaryData = () => {
        if (!reportData || !reportData.contracts || reportData.contracts.length === 0) {
            return null;
        }

        const summary = reportData.summary;
        
        // Create a summary row with the same structure as the data rows
        const summaryRow = {
            key: 'summary',
            contract_id: <Text strong>សរុប</Text>,
            lands: <Text strong>{summary.lands_count} ឡូត៍</Text>,
            paid_amount: summary.paid_amount,
            unpaid_amount: summary.unpaid_amount,
            total_amount: summary.total_amount,
            monthly_data: {}
        };

        // Initialize monthly summary data
        for (let month = 1; month <= 12; month++) {
            summaryRow.monthly_data[month] = {
                paid: 0,
                unpaid: 0
            };
        }

        // Aggregate monthly data across all contracts
        reportData.contracts.forEach(contract => {
            for (let month = 1; month <= 12; month++) {
                summaryRow.monthly_data[month].paid += contract.monthly_data[month].paid;
                summaryRow.monthly_data[month].unpaid += contract.monthly_data[month].unpaid;
            }
        });

        return summaryRow;
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="របាយការណ៍ប្រចាំឆ្នាំ" />

            <div style={{ padding: '24px' }}>
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">របាយការណ៍ប្រចាំឆ្នាំ</h1>
                    <div>
                        <Select
                            defaultValue={selectedYear}
                            value={selectedYear}
                            onChange={handleYearChange}
                            style={{ width: 120, marginRight: 16 }}
                            options={yearOptions}
                        />
                        <Button
                            type="primary"
                            icon={<FileExcelOutlined />}
                            onClick={() => handleExport('excel')}
                            loading={exporting && exportFormat === 'excel'}
                            style={{ marginRight: 8 }}
                        >
                            Excel
                        </Button>
                        <Button
                            icon={<FilePdfOutlined />}
                            onClick={() => handleExport('pdf')}
                            loading={exporting && exportFormat === 'pdf'}
                        >
                            PDF
                        </Button>
                    </div>
                </div>

                {error && (
                    <Alert
                        message="Error"
                        description={error}
                        type="error"
                        showIcon
                        className="mb-4"
                    />
                )}

                {loading ? (
                    <div className="flex justify-center items-center" style={{ height: '400px' }}>
                        <Spin size="large" tip="កំពុងដំណើរការ..." />
                    </div>
                ) : (
                    <div className="yearly-report-container">
                        {reportData && reportData.contracts && reportData.contracts.length > 0 ? (
                            <Table
                                dataSource={reportData.contracts}
                                columns={columns}
                                rowKey="contract_id"
                                scroll={{ x: 'max-content' }}
                                pagination={false}
                                bordered
                                size="middle"
                                loading={loading}
                                className="yearly-report-table"
                                onHeaderRow={(column) => {
                                    if (column.className === 'total-column-header') {
                                        return { style: styles.totalColumnHeader };
                                    }
                                    return {};
                                }}
                                onCell={(record, rowIndex, column) => {
                                    if (column && column.className === 'total-column') {
                                        return { style: styles.totalColumn };
                                    }
                                    return {};
                                }}
                                summary={() => {
                                    const summaryRow = getSummaryData();
                                    return summaryRow ? (
                                        <Table.Summary fixed>
                                            <Table.Summary.Row style={{ backgroundColor: '#fafafa', fontWeight: 'bold' }}>
                                                <Table.Summary.Cell index={0} fixed="left">{summaryRow.contract_id}</Table.Summary.Cell>
                                                <Table.Summary.Cell index={1} fixed="left">{summaryRow.lands}</Table.Summary.Cell>
                                                {Object.keys(summaryRow.monthly_data).map(month => (
                                                    <React.Fragment key={`summary_${month}`}>
                                                        <Table.Summary.Cell index={parseInt(month) * 2} align="right">
                                                            <Text style={{ color: '#52c41a', fontWeight: 'bold' }}>{formatCurrency(summaryRow.monthly_data[month].paid)}</Text>
                                                        </Table.Summary.Cell>
                                                        <Table.Summary.Cell index={parseInt(month) * 2 + 1} align="right">
                                                            <Text style={{ color: '#f5222d', fontWeight: 'bold' }}>{formatCurrency(summaryRow.monthly_data[month].unpaid)}</Text>
                                                        </Table.Summary.Cell>
                                                    </React.Fragment>
                                                ))}
                                                <Table.Summary.Cell index={25} align="right">
                                                    <Text style={{ color: '#52c41a', fontWeight: 'bold' }}>{formatCurrency(summaryRow.paid_amount)}</Text>
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell index={26} align="right">
                                                    <Text style={{ color: '#f5222d', fontWeight: 'bold' }}>{formatCurrency(summaryRow.unpaid_amount)}</Text>
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell index={27} align="right">
                                                    <Text strong>{formatCurrency(summaryRow.total_amount)}</Text>
                                                </Table.Summary.Cell>
                                            </Table.Summary.Row>
                                        </Table.Summary>
                                    ) : null;
                                }}
                            />
                        ) : (
                            <Empty
                                description={
                                    <span>
                                        គ្មានទិន្នន័យសម្រាប់ឆ្នាំ {selectedYear}
                                    </span>
                                }
                            />
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default YearlyReport;
