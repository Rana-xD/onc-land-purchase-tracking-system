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

export default function SellerShow({ seller, documents }) {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    
    const handleDelete = async () => {
        try {
            await axios.delete(`/api/sellers/${seller.id}`);
            router.visit(route('data-entry.sellers.index'), {
                onSuccess: () => {
                    message.success('អ្នកលក់ត្រូវបានលុបដោយជោគជ័យ');
                }
            });
        } catch (error) {
            console.error('Error deleting seller:', error);
            message.error('មានបញ្ហាក្នុងការលុបអ្នកលក់');
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

    return (
        <>
            <Head title="ព័ត៌មានលម្អិតអ្នកលក់" />
            
            <div className="seller-show">
                <Breadcrumb
                    items={[
                        { title: <Link href={route('data-entry.index')}>ជ្រើសរើសប្រភេទទិន្នន័យ</Link> },
                        { title: <Link href={route('data-entry.sellers.index')}>បញ្ជីអ្នកលក់</Link> },
                        { title: 'ព័ត៌មានលម្អិតអ្នកលក់' },
                    ]}
                    className="mb-6"
                />
                
                <Card>
                    <Row justify="space-between" align="middle" className="mb-6">
                        <Col>
                            <Title level={4} className="khmer-heading m-0">ព័ត៌មានលម្អិតអ្នកលក់</Title>
                        </Col>
                        <Col>
                            <Space>
                                <Button 
                                    icon={<ArrowLeftOutlined />}
                                    onClick={() => router.visit(route('data-entry.sellers.index'))}
                                >
                                    ត្រឡប់ក្រោយ
                                </Button>
                                <Button 
                                    type="primary" 
                                    icon={<EditOutlined />}
                                    onClick={() => router.visit(route('data-entry.sellers.edit', seller.id))}
                                >
                                    កែប្រែ
                                </Button>
                                <Popconfirm
                                    title="តើអ្នកពិតជាចង់លុបអ្នកលក់នេះមែនទេ?"
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
                            <Card title="ព័ត៌មានអ្នកលក់" className="mb-6">
                                <Descriptions bordered column={{ xs: 1, sm: 2 }}>
                                    <Descriptions.Item label="ឈ្មោះ">{seller.name}</Descriptions.Item>
                                    <Descriptions.Item label="ភេទ">
                                        <Tag color={seller.sex === 'male' ? 'blue' : 'pink'}>
                                            {seller.sex === 'male' ? 'ប្រុស' : 'ស្រី'}
                                        </Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="ថ្ងៃខែឆ្នាំកំណើត">{seller.date_of_birth}</Descriptions.Item>
                                    <Descriptions.Item label="លេខអត្តសញ្ញាណប័ណ្ណ">{seller.identity_number}</Descriptions.Item>
                                    <Descriptions.Item label="អាសយដ្ឋាន" span={2}>{seller.address}</Descriptions.Item>
                                    <Descriptions.Item label="លេខទូរស័ព្ទ">{seller.phone_number}</Descriptions.Item>
                                    <Descriptions.Item label="បង្កើតនៅ">{seller.created_at}</Descriptions.Item>
                                    <Descriptions.Item label="កែប្រែនៅ">{seller.updated_at}</Descriptions.Item>
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

SellerShow.layout = page => <AdminLayout title="ព័ត៌មានលម្អិតអ្នកលក់" children={page} />
