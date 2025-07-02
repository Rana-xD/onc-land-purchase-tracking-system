import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Row, Col, Card, Statistic, List, Tag, Typography } from 'antd';
import { BankOutlined, DollarOutlined, FileOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

export default function Dashboard({ auth, stats, recentActivities }) {
    return (
        <AdminLayout title="ផ្ទាំងគ្រប់គ្រង">
            <Head title="ផ្ទាំងគ្រប់គ្រង" />

            <div className="py-6">
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic 
                                title={<span className="khmer-text">ចំនួនដីសរុប</span>}
                                value={stats.landCount}
                                prefix={<BankOutlined />}
                                className="khmer-text"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic 
                                title={<span className="khmer-text">ការទូទាត់សរុប</span>}
                                value={stats.paymentTotal}
                                prefix={<DollarOutlined />}
                                suffix="$"
                                className="khmer-text"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic 
                                title={<span className="khmer-text">ឯកសារសរុប</span>}
                                value={stats.documentCount}
                                prefix={<FileOutlined />}
                                className="khmer-text"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic 
                                title={<span className="khmer-text">អ្នកប្រើប្រាស់សរុប</span>}
                                value={stats.userCount}
                                prefix={<TeamOutlined />}
                                className="khmer-text"
                            />
                        </Card>
                    </Col>
                </Row>

                <div className="mt-8">
                    <Card 
                        title={<span className="khmer-text">សកម្មភាពថ្មីៗ</span>} 
                        className="khmer-text"
                        extra={<a href={route('activities.index')} className="khmer-text">មើលទាំងអស់</a>}
                    >
                        {recentActivities.length > 0 ? (
                            <List
                                itemLayout="horizontal"
                                dataSource={recentActivities}
                                renderItem={(activity) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<UserOutlined />}
                                            title={
                                                <div className="flex justify-between">
                                                    <span className="khmer-text">{activity.user.name}</span>
                                                    <Typography.Text type="secondary" className="text-xs">
                                                        {dayjs(activity.created_at).format('DD/MM/YYYY HH:mm')}
                                                    </Typography.Text>
                                                </div>
                                            }
                                            description={
                                                <div>
                                                    <Tag color="blue" className="khmer-text mb-1">{activity.action}</Tag>
                                                    <div className="khmer-text">{activity.description}</div>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <p className="khmer-text">មិនមានសកម្មភាពថ្មីៗទេ</p>
                        )}
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
