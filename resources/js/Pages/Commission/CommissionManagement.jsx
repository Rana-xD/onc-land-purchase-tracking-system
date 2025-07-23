import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, Row, Col, Statistic, Typography, Button, Space } from 'antd';
import { DollarOutlined, PercentageOutlined, ArrowRightOutlined } from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout';

const { Title, Text } = Typography;

export default function CommissionManagement({ statistics }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('km-KH', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount || 0);
    };

    return (
        <AdminLayout>
            <Head title="គ្រប់គ្រងកម៉ីសិន" />
            
            <div style={{ padding: '24px' }}>
                {/* Header */}
                <div style={{ marginBottom: '24px' }}>
                    <Title level={2} style={{ margin: 0, textAlign: 'center' }}>
                        គ្រប់គ្រងកម៉ីសិន
                    </Title>
                </div>

                {/* Statistics Cards */}
                <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
                    {/* Pre-purchase Statistics */}
                    <Col xs={24} lg={12}>
                        <Card 
                            title={
                                <Space>
                                    <DollarOutlined />
                                    <Text strong>កម៉ីសិនមុនទិញ</Text>
                                </Space>
                            }
                            extra={
                                <Link href={route('commissions.pre-purchase')}>
                                    <Button type="link" icon={<ArrowRightOutlined />}>
                                        មើលលម្អិត
                                    </Button>
                                </Link>
                            }
                        >
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Statistic
                                        title="សរុប"
                                        value={statistics?.pre_purchase?.total || 0}
                                        formatter={(value) => formatCurrency(value)}
                                        valueStyle={{ color: '#1890ff' }}
                                    />
                                </Col>
                                <Col span={8}>
                                    <Statistic
                                        title="បានបង់ហើយ"
                                        value={statistics?.pre_purchase?.paid || 0}
                                        formatter={(value) => formatCurrency(value)}
                                        valueStyle={{ color: '#52c41a' }}
                                    />
                                </Col>
                                <Col span={8}>
                                    <Statistic
                                        title="មិនទាន់បង់"
                                        value={statistics?.pre_purchase?.pending || 0}
                                        formatter={(value) => formatCurrency(value)}
                                        valueStyle={{ color: '#faad14' }}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    {/* Post-purchase Statistics */}
                    <Col xs={24} lg={12}>
                        <Card 
                            title={
                                <Space>
                                    <PercentageOutlined />
                                    <Text strong>កម៉ីសិនក្រោយទិញ</Text>
                                </Space>
                            }
                            extra={
                                <Link href={route('commissions.post-purchase')}>
                                    <Button type="link" icon={<ArrowRightOutlined />}>
                                        មើលលម្អិត
                                    </Button>
                                </Link>
                            }
                        >
                            <Row gutter={16}>
                                <Col span={6}>
                                    <Statistic
                                        title="សរុប"
                                        value={statistics?.post_purchase?.total || 0}
                                        formatter={(value) => formatCurrency(value)}
                                        valueStyle={{ color: '#1890ff' }}
                                    />
                                </Col>
                                <Col span={6}>
                                    <Statistic
                                        title="បានបង់ហើយ"
                                        value={statistics?.post_purchase?.paid || 0}
                                        formatter={(value) => formatCurrency(value)}
                                        valueStyle={{ color: '#52c41a' }}
                                    />
                                </Col>
                                <Col span={6}>
                                    <Statistic
                                        title="បង់ខ្លះ"
                                        value={statistics?.post_purchase?.partial || 0}
                                        formatter={(value) => formatCurrency(value)}
                                        valueStyle={{ color: '#1890ff' }}
                                    />
                                </Col>
                                <Col span={6}>
                                    <Statistic
                                        title="មិនទាន់បង់"
                                        value={statistics?.post_purchase?.pending || 0}
                                        formatter={(value) => formatCurrency(value)}
                                        valueStyle={{ color: '#faad14' }}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>

                {/* Overall Statistics */}
                <Card 
                    title={
                        <Space>
                            <DollarOutlined />
                            <Text strong>សរុបរួម</Text>
                        </Space>
                    }
                >
                    <Row gutter={24} justify="center">
                        <Col xs={24} sm={8}>
                            <Statistic
                                title="ចំនួនសរុប"
                                value={statistics?.overall?.total || 0}
                                formatter={(value) => formatCurrency(value)}
                                valueStyle={{ color: '#1890ff', fontSize: '24px' }}
                            />
                        </Col>
                        <Col xs={24} sm={8}>
                            <Statistic
                                title="បានបង់ហើយ"
                                value={statistics?.overall?.paid || 0}
                                formatter={(value) => formatCurrency(value)}
                                valueStyle={{ color: '#52c41a', fontSize: '24px' }}
                            />
                        </Col>
                        <Col xs={24} sm={8}>
                            <Statistic
                                title="នៅសល់"
                                value={statistics?.overall?.pending || 0}
                                formatter={(value) => formatCurrency(value)}
                                valueStyle={{ color: '#faad14', fontSize: '24px' }}
                            />
                        </Col>
                    </Row>
                </Card>

                {/* Quick Actions */}
                <Row gutter={16} style={{ marginTop: '32px' }}>
                    <Col xs={24} sm={12}>
                        <Link href={route('commissions.pre-purchase')}>
                            <Card 
                                hoverable
                                style={{ textAlign: 'center', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Space direction="vertical" align="center">
                                    <DollarOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
                                    <Text strong>គ្រប់គ្រងកម៉ីសិនមុនទិញ</Text>
                                </Space>
                            </Card>
                        </Link>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Link href={route('commissions.post-purchase')}>
                            <Card 
                                hoverable
                                style={{ textAlign: 'center', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Space direction="vertical" align="center">
                                    <PercentageOutlined style={{ fontSize: '32px', color: '#52c41a' }} />
                                    <Text strong>គ្រប់គ្រងកម៉ីសិនក្រោយទិញ</Text>
                                </Space>
                            </Card>
                        </Link>
                    </Col>
                </Row>
            </div>
        </AdminLayout>
    );
}
