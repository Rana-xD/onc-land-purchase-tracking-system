import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Row, Col, Card, Table, Typography, Empty, Divider, Button } from 'antd';
import { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { CenteredSpin } from '@/theme';
import dayjs from 'dayjs';
import { BarChartOutlined } from '@ant-design/icons';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard({ auth }) {
    const [paymentStats, setPaymentStats] = useState(null);
    const [upcomingPayments, setUpcomingPayments] = useState(null);
    const [loadingPaymentStats, setLoadingPaymentStats] = useState(true);
    const [loadingUpcomingPayments, setLoadingUpcomingPayments] = useState(true);
    
    // Fetch data from API endpoints
    useEffect(() => {
        const fetchPaymentStats = async () => {
            try {
                const response = await fetch('/api/dashboard/payment-overview');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch payment overview data');
                }
                
                const data = await response.json();
                setPaymentStats(data);
            } catch (error) {
                console.error('Error fetching payment stats:', error);
                // Show error state instead of fallback dummy data
                setPaymentStats(null);
            } finally {
                setLoadingPaymentStats(false);
            }
        };
        
        const fetchUpcomingPayments = async () => {
            try {
                const response = await fetch('/api/dashboard/upcoming-payments');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch upcoming payments data');
                }
                
                const data = await response.json();
                setUpcomingPayments(data);
            } catch (error) {
                console.error('Error fetching upcoming payments:', error);
                // Show error state instead of fallback dummy data
                setUpcomingPayments([]);
            } finally {
                setLoadingUpcomingPayments(false);
            }
        };
        
        // Execute both fetch operations
        fetchPaymentStats();
        fetchUpcomingPayments();
    }, []);
    
    // Prepare chart data with enhanced colors
    const chartData = {
        labels: ['បានទូទាត់', 'មិនទាន់ទូទាត់'],
        datasets: [
            {
                data: paymentStats ? [paymentStats.paid, paymentStats.unpaid] : [0, 0],
                backgroundColor: ['rgba(24, 144, 255, 0.85)', 'rgba(245, 34, 45, 0.75)'],
                hoverBackgroundColor: ['rgba(24, 144, 255, 1)', 'rgba(245, 34, 45, 0.9)'],
                borderWidth: 2,
                borderColor: ['#1890ff', '#f5222d'],
                hoverBorderColor: ['#096dd9', '#cf1322'],
                hoverBorderWidth: 3,
                hoverOffset: 10,
                borderRadius: 4,
                spacing: 5,
            },
        ],
    };
    
    // Enhanced chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',  // Donut style
        animation: {
            animateScale: true,
            animateRotate: true,
            duration: 1000,
            easing: 'easeOutQuart',
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                titleFont: {
                    size: 14,
                    weight: 'bold',
                },
                bodyFont: {
                    size: 13,
                },
                padding: 12,
                cornerRadius: 6,
                displayColors: true,
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = paymentStats ? paymentStats.total : 0;
                        const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                        return `${label}: $${value.toLocaleString()} (${percentage}%)`;
                    }
                }
            }
        },
    };
    
    // Updated table columns for monthly summary
    const columns = [
        {
            title: 'ខែ-ឆ្នាំ',
            dataIndex: 'date',
            key: 'date',
            className: 'khmer-text',
            render: (date) => (
                <Typography.Text strong style={{ color: '#1890ff' }}>
                    {date}
                </Typography.Text>
            ),
        },
        {
            title: 'ចំនួនទឹកប្រាក់សរុប',
            dataIndex: 'amount',
            key: 'amount',
            className: 'khmer-text',
            align: 'right',
            render: (amount) => (
                <Typography.Text strong style={{ color: '#52c41a' }}>
                    ${amount.toLocaleString()}
                </Typography.Text>
            )
        },
    ];
    
    // Calculate total upcoming payments
    const totalUpcomingPayments = upcomingPayments ? 
        upcomingPayments.reduce((sum, payment) => sum + payment.amount, 0) : 0;
    
    return (
        <AdminLayout title="ផ្ទាំងគ្រប់គ្រង">
            <Head title="ផ្ទាំងគ្រប់គ្រង" />

            <div className="p-6" style={{ background: 'linear-gradient(to bottom, #f5f7fa, #ffffff)' }}>
                
                {/* Payment Status and Upcoming Payments */}
                <Row gutter={[24, 24]}>
                    {/* Payment Status Chart */}
                    <Col xs={24} lg={12}>
                        <Card 
                            title={<span className="khmer-text font-medium">ស្ថានភាពការទូទាត់</span>}
                            className="khmer-text dashboard-card"
                            style={{ height: '100%', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
                            variant="outlined"
                        >
                            {loadingPaymentStats ? (
                                <CenteredSpin />
                            ) : paymentStats ? (
                                <div>
                                    {/* Chart section - full width */}
                                    <div style={{ height: 350, position: 'relative', marginBottom: 20 }}>
                                        <Pie data={chartData} options={chartOptions} />
                                        <div style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            textAlign: 'center'
                                        }}>
                                            <Typography.Text type="secondary" style={{ fontSize: '14px', display: 'block' }}>
                                                សរុប
                                            </Typography.Text>
                                            <Typography.Title level={4} style={{ margin: 0, marginTop: '4px' }}>
                                                ${paymentStats ? paymentStats.total.toLocaleString() : '0'}
                                            </Typography.Title>
                                        </div>
                                    </div>
                                    
                                    {/* Legend section - centered below chart */}
                                    <div className="flex justify-center mt-4">
                                        <div className="flex items-center mr-8">
                                            <div style={{ 
                                                width: 20, 
                                                height: 20, 
                                                backgroundColor: 'rgba(24, 144, 255, 0.85)', 
                                                borderRadius: '50%', 
                                                marginRight: 10,
                                                border: '2px solid #1890ff',
                                                boxShadow: '0 2px 4px rgba(24, 144, 255, 0.3)'
                                            }}></div>
                                            <div>
                                                <span className="khmer-text font-medium block">បានទូទាត់</span>
                                                <Typography.Text strong style={{ fontSize: '16px' }}>
                                                    ${paymentStats.paid.toLocaleString()} ({Math.round((paymentStats.paid / paymentStats.total) * 100)}%)
                                                </Typography.Text>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <div style={{ 
                                                width: 20, 
                                                height: 20, 
                                                backgroundColor: 'rgba(245, 34, 45, 0.75)', 
                                                borderRadius: '50%', 
                                                marginRight: 10,
                                                border: '2px solid #f5222d',
                                                boxShadow: '0 2px 4px rgba(245, 34, 45, 0.3)'
                                            }}></div>
                                            <div>
                                                <span className="khmer-text font-medium block">មិនទាន់ទូទាត់</span>
                                                <Typography.Text strong style={{ fontSize: '16px' }}>
                                                    ${paymentStats.unpaid.toLocaleString()} ({Math.round((paymentStats.unpaid / paymentStats.total) * 100)}%)
                                                </Typography.Text>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Button section - centered below legend */}
                                    <div className="flex justify-center mt-4">
                                        <Link href="/reports/payment-status">
                                            <Button type="primary" icon={<BarChartOutlined />}>
                                                <span className="khmer-text">របាយការណ៍លម្អិត</span>
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <Empty description={<span className="khmer-text">មិនមានទិន្នន័យ</span>} />
                            )}
                        </Card>
                    </Col>
                    
                    {/* Upcoming Payments List */}
                    <Col xs={24} lg={12}>
                        <Card 
                            title={<span className="khmer-text font-medium">ការទូទាត់ក្នុង 6 ខែខាងមុខ</span>}
                            className="khmer-text dashboard-card"
                            style={{ height: '100%', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
                            variant="outlined"
                        >
                            {loadingUpcomingPayments ? (
                                <CenteredSpin />
                            ) : upcomingPayments && upcomingPayments.length > 0 ? (
                                <>
                                    <Table 
                                        dataSource={upcomingPayments} 
                                        columns={columns}
                                        pagination={false}
                                        rowKey="id"
                                        size="middle"
                                        onRow={(record) => ({
                                            style: { cursor: 'pointer' }
                                        })}
                                        className="dashboard-table"
                                    />
                                    <Divider style={{ margin: '16px 0' }} />
                                    <div className="text-right">
                                        <Typography.Text strong style={{ fontSize: 16, color: '#1890ff' }} className="khmer-text">
                                            សរុប: ${totalUpcomingPayments.toLocaleString()}
                                        </Typography.Text>
                                    </div>
                                </>
                            ) : (
                                <Empty 
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={<span className="khmer-text">មិនមានការទូទាត់ក្នុងពេលឆាប់ៗនេះទេ</span>} 
                                />
                            )}
                        </Card>
                    </Col>
                </Row>
            </div>
        </AdminLayout>
    );
}
