import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, Row, Col, Typography, Button } from 'antd';
import { UserOutlined, BankOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function CategorySelection() {
    return (
        <>
            <Head title="ជ្រើសរើសប្រភេទទិន្នន័យ" />
            
            <div className="data-entry-category">
                <Title level={2} className="khmer-heading mb-6">ជ្រើសរើសប្រភេទទិន្នន័យ</Title>
                
                <Paragraph className="khmer-text mb-6">
                    សូមជ្រើសរើសប្រភេទទិន្នន័យដែលអ្នកចង់បញ្ចូល។ អ្នកអាចបញ្ចូលព័ត៌មានអ្នកទិញ អ្នកលក់ ឬព័ត៌មានដី។
                </Paragraph>
                
                <Row gutter={[24, 24]} className="mt-8">
                    <Col xs={24} sm={12} md={8}>
                        <Card 
                            hoverable 
                            className="h-full"
                            cover={
                                <div className="text-center py-6 bg-blue-50">
                                    <UserOutlined style={{ fontSize: '64px', color: '#1890ff' }} />
                                </div>
                            }
                            actions={[
                                <Button type="primary" href={route('data-entry.buyers')} block>
                                    បញ្ចូលព័ត៌មាន
                                </Button>
                            ]}
                        >
                            <Card.Meta
                                title={<span className="khmer-heading text-lg">អ្នកទិញ</span>}
                                description={
                                    <span className="khmer-text">
                                        បញ្ចូលព័ត៌មានលម្អិតអំពីអ្នកទិញដី និងឯកសារពាក់ព័ន្ធ
                                    </span>
                                }
                            />
                        </Card>
                    </Col>
                    
                    <Col xs={24} sm={12} md={8}>
                        <Card 
                            hoverable 
                            className="h-full"
                            cover={
                                <div className="text-center py-6 bg-blue-50">
                                    <UserOutlined style={{ fontSize: '64px', color: '#52c41a' }} />
                                </div>
                            }
                            actions={[
                                <Button type="primary" href={route('data-entry.sellers')} block>
                                    បញ្ចូលព័ត៌មាន
                                </Button>
                            ]}
                        >
                            <Card.Meta
                                title={<span className="khmer-heading text-lg">អ្នកលក់</span>}
                                description={
                                    <span className="khmer-text">
                                        បញ្ចូលព័ត៌មានលម្អិតអំពីអ្នកលក់ដី និងឯកសារពាក់ព័ន្ធ
                                    </span>
                                }
                            />
                        </Card>
                    </Col>
                    
                    <Col xs={24} sm={12} md={8}>
                        <Card 
                            hoverable 
                            className="h-full"
                            cover={
                                <div className="text-center py-6 bg-blue-50">
                                    <BankOutlined style={{ fontSize: '64px', color: '#fa8c16' }} />
                                </div>
                            }
                            actions={[
                                <Button type="primary" href={route('data-entry.lands')} block>
                                    បញ្ចូលព័ត៌មាន
                                </Button>
                            ]}
                        >
                            <Card.Meta
                                title={<span className="khmer-heading text-lg">ដី</span>}
                                description={
                                    <span className="khmer-text">
                                        បញ្ចូលព័ត៌មានលម្អិតអំពីដី និងឯកសារពាក់ព័ន្ធ
                                    </span>
                                }
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

CategorySelection.layout = page => <AdminLayout title="ជ្រើសរើសប្រភេទទិន្នន័យ" children={page} />
