import React, { useState, useCallback, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
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
import YearlyReportHTML from '@/Components/PDF/YearlyReportHTML';
import useHTMLToPDF from '@/Hooks/useHTMLToPDF';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

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
    const [isAllYears, setIsAllYears] = useState(false);
    
    // HTML-to-PDF hook
    const { generatePDFFromComponent } = useHTMLToPDF();
    
    // Format currency
    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return '$0.00';
        return '$' + new Intl.NumberFormat('en-US').format(amount);
    };

    // Prepare chart data
    const prepareChartData = () => {
        if (!reportData || !reportData.contracts || reportData.contracts.length === 0) {
            return [];
        }

        const chartData = [];
        
        if (isAllYears) {
            // Prepare yearly chart data
            const currentYear = moment().year();
            for (let year = currentYear - 6; year <= currentYear + 6; year++) {
                let totalPaid = 0;
                let totalUnpaid = 0;
                
                reportData.contracts.forEach(contract => {
                    if (contract.time_data && contract.time_data[year]) {
                        totalPaid += contract.time_data[year].paid || 0;
                        totalUnpaid += contract.time_data[year].unpaid || 0;
                    }
                });
                
                chartData.push({
                    period: year.toString(),
                    paid: totalPaid,
                    unpaid: totalUnpaid,
                    total: totalPaid + totalUnpaid
                });
            }
        } else {
            // Prepare monthly chart data
            for (let month = 1; month <= 12; month++) {
                let totalPaid = 0;
                let totalUnpaid = 0;
                
                reportData.contracts.forEach(contract => {
                    if (contract.time_data && contract.time_data[month]) {
                        totalPaid += contract.time_data[month].paid || 0;
                        totalUnpaid += contract.time_data[month].unpaid || 0;
                    }
                });
                
                chartData.push({
                    period: khmerMonths[month] || month.toString(),
                    paid: totalPaid,
                    unpaid: totalUnpaid,
                    total: totalPaid + totalUnpaid
                });
            }
        }
        
        return chartData;
    };

    // Custom tooltip formatter for chart
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
                    <p className="font-semibold">{`${isAllYears ? 'ឆ្នាំ' : 'ខែ'}: ${label}`}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                            {`${entry.name}: ${formatCurrency(entry.value)}`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
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
        if (!reportData) {
            message.error('សូមទាញយកទិន្នន័យរបាយការណ៍ជាមុនសិន');
            return;
        }

        setExporting(true);
        setExportFormat(format);
        
        try {
            if (format === 'pdf') {
                const filename = `yearly_report_${selectedYear}.pdf`;
                
                const htmlComponent = (
                    <YearlyReportHTML 
                        data={reportData}
                        year={selectedYear}
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
                const response = await axios.post('/reports/yearly/export', { 
                    format: 'excel',
                    year: selectedYear
                }, {
                    responseType: 'blob'
                });
                
                const blob = new Blob([response.data], { 
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
                });
                
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `yearly_report_${selectedYear}.xlsx`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                message.success('នាំចេញ Excel បានជោគជ័យ');
            }
        } catch (err) {
            console.error(`Error exporting report as ${format}:`, err);
            message.error(`មានបញ្ហាក្នុងការនាំចេញ: ${err.message}`);
        } finally {
            setExporting(false);
            setExportFormat(null);
        }
    }, [selectedYear, reportData, auth.user.name, generatePDFFromComponent]);

    // Handle year change
    const handleYearChange = (year) => {
        setSelectedYear(year);
        setIsAllYears(year === 'all');
    };
    
    // Generate year options for the select dropdown (12 years range + ALL option)
    const yearOptions = [];
    const currentYear = moment().year();
    
    // Add ALL option
    yearOptions.push({ value: 'all', label: 'បង្ហាញទាំងអស់' });
    
    // Add 12 years range (6 behind + 6 ahead)
    for (let i = currentYear - 6; i <= currentYear + 6; i++) {
        yearOptions.push({ value: i, label: i });
    }

    // Generate table columns for months or years based on selection
    const generateTimeColumns = () => {
        const timeColumns = [];
        
        if (isAllYears) {
            // Generate yearly columns
            const currentYear = moment().year();
            for (let year = currentYear - 6; year <= currentYear + 6; year++) {
                timeColumns.push({
                    title: year.toString(),
                    align: 'center',
                    children: [
                        {
                            title: 'បានបង់',
                            dataIndex: ['time_data', year, 'paid'],
                            key: `year_${year}_paid`,
                            width: 100,
                            align: 'center',
                            render: (text) => <Text style={{ color: '#52c41a', display: 'block', textAlign: 'right' }}>{formatCurrency(text || 0)}</Text>,
                        },
                        {
                            title: 'មិនទាន់បង់',
                            dataIndex: ['time_data', year, 'unpaid'],
                            key: `year_${year}_unpaid`,
                            width: 100,
                            align: 'center',
                            render: (text) => <Text style={{ color: '#f5222d', display: 'block', textAlign: 'right' }}>{formatCurrency(text || 0)}</Text>,
                        }
                    ]
                });
            }
        } else {
            // Generate monthly columns
            for (let month = 1; month <= 12; month++) {
                timeColumns.push({
                    title: `${month.toString().padStart(2, '0')}/${selectedYear.toString().slice(-2)}`,
                    align: 'center',
                    children: [
                        {
                            title: 'បានបង់',
                            dataIndex: ['time_data', month, 'paid'],
                            key: `month_${month}_paid`,
                            width: 100,
                            align: 'center',
                            render: (text) => <Text style={{ color: '#52c41a', display: 'block', textAlign: 'right' }}>{formatCurrency(text || 0)}</Text>,
                        },
                        {
                            title: 'មិនទាន់បង់',
                            dataIndex: ['time_data', month, 'unpaid'],
                            key: `month_${month}_unpaid`,
                            width: 100,
                            align: 'center',
                            render: (text) => <Text style={{ color: '#f5222d', display: 'block', textAlign: 'right' }}>{formatCurrency(text || 0)}</Text>,
                        }
                    ]
                });
            }
        }
        
        return timeColumns;
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
            render: (text) => (
                <Link href={`/reports/document?contract_id=${text}`} className="text-blue-600 hover:text-blue-800 font-bold">
                    {text}
                </Link>
            ),
        },
        {
            title: 'លេខក្បាលដី',
            dataIndex: 'lands',
            key: 'lands',
            fixed: 'left',
            width: 150,
            align: 'center',
            render: renderLands
        },
        {
            title: 'អ្នកលក់',
            dataIndex: 'sellers',
            key: 'sellers',
            fixed: 'left',
            width: 200,
            align: 'center',
            render: (sellers) => {
                if (!sellers || sellers.length === 0) return <Text>-</Text>;
                const sellerNames = sellers.map(seller => seller.name || 'N/A').join(', ');
                return <Text>{sellerNames}</Text>;
            }
        },
        ...generateTimeColumns(),
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
            sellers: [], // Empty sellers for summary row
            paid_amount: summary.paid_amount,
            unpaid_amount: summary.unpaid_amount,
            total_amount: summary.total_amount,
            monthly_data: {}
        };

        // Initialize time summary data based on selection
        if (isAllYears) {
            const currentYear = moment().year();
            for (let year = currentYear - 6; year <= currentYear + 6; year++) {
                summaryRow.monthly_data[year] = {
                    paid: 0,
                    unpaid: 0
                };
            }
        } else {
            for (let month = 1; month <= 12; month++) {
                summaryRow.monthly_data[month] = {
                    paid: 0,
                    unpaid: 0
                };
            }
        }

        // Aggregate time data across all contracts
        reportData.contracts.forEach(contract => {
            if (isAllYears) {
                // Aggregate yearly data
                const currentYear = moment().year();
                for (let year = currentYear - 6; year <= currentYear + 6; year++) {
                    if (contract.time_data && contract.time_data[year]) {
                        summaryRow.monthly_data[year] = summaryRow.monthly_data[year] || { paid: 0, unpaid: 0 };
                        summaryRow.monthly_data[year].paid += contract.time_data[year].paid;
                        summaryRow.monthly_data[year].unpaid += contract.time_data[year].unpaid;
                    }
                }
            } else {
                // Aggregate monthly data
                for (let month = 1; month <= 12; month++) {
                    if (contract.time_data && contract.time_data[month]) {
                        summaryRow.monthly_data[month].paid += contract.time_data[month].paid;
                        summaryRow.monthly_data[month].unpaid += contract.time_data[month].unpaid;
                    }
                }
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
                            style={{ backgroundColor: '#52c41a', marginRight: 8 }}
                            icon={<FileExcelOutlined />}
                            onClick={() => handleExport('excel')}
                            loading={exporting && exportFormat === 'excel'}
                        >
                            Excel
                        </Button>
                        <Button
                            type="primary"
                            danger
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
                            <>
                                {/* Line Chart Section */}
                                <Card className="mb-6" title={`📊 ${isAllYears ? 'ទិន្នន័យតាមឆ្នាំ' : `ទិន្នន័យប្រចាំខែឆ្នាំ ${selectedYear}`}`}>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <LineChart
                                            data={prepareChartData()}
                                            margin={{
                                                top: 20,
                                                right: 30,
                                                left: 20,
                                                bottom: 20,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis 
                                                dataKey="period" 
                                                tick={{ fontSize: 12 }}
                                                angle={isAllYears ? 0 : -45}
                                                textAnchor={isAllYears ? 'middle' : 'end'}
                                                height={isAllYears ? 30 : 60}
                                            />
                                            <YAxis 
                                                tick={{ fontSize: 12 }}
                                                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                                            />
                                            <RechartsTooltip content={<CustomTooltip />} />
                                            <Legend 
                                                wrapperStyle={{ paddingTop: '20px' }}
                                                iconType="line"
                                            />
                                            <Line 
                                                type="monotone" 
                                                dataKey="paid" 
                                                stroke="#52c41a" 
                                                strokeWidth={3}
                                                name="បានបង់"
                                                dot={{ fill: '#52c41a', strokeWidth: 2, r: 4 }}
                                                activeDot={{ r: 6, stroke: '#52c41a', strokeWidth: 2 }}
                                            />
                                            <Line 
                                                type="monotone" 
                                                dataKey="unpaid" 
                                                stroke="#f5222d" 
                                                strokeWidth={3}
                                                name="មិនទាន់បង់"
                                                dot={{ fill: '#f5222d', strokeWidth: 2, r: 4 }}
                                                activeDot={{ r: 6, stroke: '#f5222d', strokeWidth: 2 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Card>

                                {/* Table Section */}
                                <Card title={`📋 ${isAllYears ? 'តារាងទិន្នន័យតាមឆ្នាំ' : `តារាងទិន្នន័យប្រចាំខែឆ្នាំ ${selectedYear}`}`}>
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
                                                <Table.Summary.Cell index={2} fixed="left">-</Table.Summary.Cell>
                                                {Object.keys(summaryRow.monthly_data).map(timeKey => (
                                                    <React.Fragment key={`summary_${timeKey}`}>
                                                        <Table.Summary.Cell index={parseInt(timeKey) * 2} align="right">
                                                            <Text style={{ color: '#52c41a', fontWeight: 'bold' }}>{formatCurrency(summaryRow.monthly_data[timeKey].paid)}</Text>
                                                        </Table.Summary.Cell>
                                                        <Table.Summary.Cell index={parseInt(timeKey) * 2 + 1} align="right">
                                                            <Text style={{ color: '#f5222d', fontWeight: 'bold' }}>{formatCurrency(summaryRow.monthly_data[timeKey].unpaid)}</Text>
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
                                </Card>
                            </>
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
