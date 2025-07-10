import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Card, Row, Col, Typography, Breadcrumb, Button, 
    Space, Descriptions, Image, Modal, Divider, Popconfirm,
    Tag, message
} from 'antd';
import { 
    EditOutlined, DeleteOutlined, ArrowLeftOutlined,
    FileOutlined, FilePdfOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

export default function LandShow({ land, documents }) {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    
    const handleDelete = async () => {
        try {
            await axios.delete(`/api/lands/${land.id}`);
            router.visit(route('data-entry.lands.index'), {
                onSuccess: () => {
                    message.success('ដីត្រូវបានលុបដោយជោគជ័យ');
                }
            });
        } catch (error) {
            console.error('Error deleting land:', error);
            message.error('មានបញ្ហាក្នុងការលុបដី');
        }
    };
    
    const handlePreview = (document) => {
        setPreviewImage(`/storage/${document.file_path}`);
        setPreviewTitle(document.file_name);
        setPreviewVisible(true);
    };

    const getFileIcon = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
            return null; // No icon for images as they are shown as thumbnails
        } else if (extension === 'pdf') {
            return <FilePdfOutlined style={{ fontSize: '24px' }} />;
        } else {
            return <FileOutlined style={{ fontSize: '24px' }} />;
        }
    };

    const isImage = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif'].includes(extension);
    };

    const formatSize = (size) => {
        return `${Number(size).toLocaleString('en-US', { maximumFractionDigits: 2 })} ម²`;
    };

    return (
        <>
            <Head title="ព័ត៌មានលម្អិតដី" />
            
            <div className="land-show">
                <Breadcrumb
                    items={[
                        { title: <Link href={route('data-entry.index')}>ជ្រើសរើសប្រភេទទិន្នន័យ</Link> },
                        { title: <Link href={route('data-entry.lands.index')}>បញ្ជីដី</Link> },
                        { title: 'ព័ត៌មានលម្អិតដី' },
                    ]}
                    className="mb-6"
                />
                
                <Card>
                    <Row justify="space-between" align="middle" className="mb-6">
                        <Col>
                            <Title level={4} className="khmer-heading m-0">ព័ត៌មានលម្អិតដី</Title>
                        </Col>
                        <Col>
                            <Space>
                                <Button 
                                    icon={<ArrowLeftOutlined />}
                                    onClick={() => router.visit(route('data-entry.lands.index'))}
                                >
                                    ត្រឡប់ក្រោយ
                                </Button>
                                <Button 
                                    type="primary" 
                                    icon={<EditOutlined />}
                                    onClick={() => router.visit(route('data-entry.lands.edit', land.id))}
                                >
                                    កែប្រែ
                                </Button>
                                <Popconfirm
                                    title="តើអ្នកពិតជាចង់លុបដីនេះមែនទេ?"
                                    onConfirm={handleDelete}
                                    okText="យល់ព្រម"
                                    cancelText="បោះបង់"
                                >
                                    <Button 
                                        danger 
                                        icon={<DeleteOutlined />}
                                    >
                                        លុប
                                    </Button>
                                </Popconfirm>
                            </Space>
                        </Col>
                    </Row>
                    
                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={16}>
                            <Card title="ព័ត៌មានដី" className="mb-6">
                                <Descriptions bordered column={{ xs: 1, sm: 2 }}>
                                    <Descriptions.Item label="លេខក្បាលដី">{land.plot_number}</Descriptions.Item>
                                    <Descriptions.Item label="ទំហំ">{formatSize(land.size)}</Descriptions.Item>
                                    <Descriptions.Item label="ទីតាំង" span={2}>{land.location}</Descriptions.Item>
                                    <Descriptions.Item label="កាលបរិច្ឆេទចុះបញ្ជី">{land.date_of_registration}</Descriptions.Item>
                                    <Descriptions.Item label="កំណត់សម្គាល់" span={2}>{land.notes || 'គ្មាន'}</Descriptions.Item>
                                    <Descriptions.Item label="បង្កើតនៅ">{land.created_at}</Descriptions.Item>
                                    <Descriptions.Item label="កែប្រែនៅ">{land.updated_at}</Descriptions.Item>
                                </Descriptions>
                            </Card>
                        </Col>
                        
                        <Col xs={24} md={8}>
                            <Card title="ឯកសារបង្ហាញ" className="mb-6">
                                {documents && documents.filter(doc => doc.is_display).length > 0 ? (
                                    documents.filter(doc => doc.is_display).map(doc => (
                                        <div key={doc.id} className="display-document">
                                            {isImage(doc.file_name) ? (
                                                <Image 
                                                    src={`/storage/${doc.file_path}`}
                                                    alt={doc.file_name}
                                                    style={{ width: '100%' }}
                                                    preview={false}
                                                    onClick={() => handlePreview(doc)}
                                                />
                                            ) : (
                                                <div 
                                                    className="document-preview-box"
                                                    onClick={() => handlePreview(doc)}
                                                >
                                                    {getFileIcon(doc.file_name)}
                                                    <Text>{doc.file_name}</Text>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <Text type="secondary">គ្មានឯកសារបង្ហាញ</Text>
                                )}
                            </Card>
                        </Col>
                    </Row>
                    
                    <Divider />
                    
                    <Card title="ឯកសារទាំងអស់">
                        <Row gutter={[16, 16]}>
                            {documents && documents.length > 0 ? (
                                documents.map(doc => (
                                    <Col key={doc.id} xs={24} sm={12} md={8} lg={6}>
                                        <Card 
                                            hoverable
                                            cover={
                                                isImage(doc.file_name) ? (
                                                    <Image 
                                                        src={`/storage/${doc.file_path}`}
                                                        alt={doc.file_name}
                                                        style={{ height: 150, objectFit: 'cover' }}
                                                        preview={false}
                                                    />
                                                ) : (
                                                    <div className="document-icon-container">
                                                        {getFileIcon(doc.file_name)}
                                                    </div>
                                                )
                                            }
                                            onClick={() => handlePreview(doc)}
                                        >
                                            <Card.Meta 
                                                title={doc.file_name} 
                                                description={
                                                    <>
                                                        {doc.is_display && <Tag color="blue">ឯកសារបង្ហាញ</Tag>}
                                                    </>
                                                }
                                            />
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <Col span={24}>
                                    <Text type="secondary">គ្មានឯកសារ</Text>
                                </Col>
                            )}
                        </Row>
                    </Card>
                </Card>
                
                <Modal
                    open={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={() => setPreviewVisible(false)}
                    width={800}
                >
                    {previewImage && (
                        previewImage.endsWith('.pdf') ? (
                            <iframe
                                src={previewImage}
                                style={{ width: '100%', height: '500px' }}
                                title={previewTitle}
                            />
                        ) : (
                            <img alt={previewTitle} style={{ width: '100%' }} src={previewImage} />
                        )
                    )}
                </Modal>
            </div>
        </>
    );
}

LandShow.layout = page => <AdminLayout title="ព័ត៌មានលម្អិតដី" children={page} />
