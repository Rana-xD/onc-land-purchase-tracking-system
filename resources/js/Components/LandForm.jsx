import React, { useEffect } from 'react';
import { Form, Input, Select, InputNumber, Card, Row, Col, Image, Typography } from 'antd';
import { FileImageOutlined, FilePdfOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title, Text } = Typography;

export default function LandForm({ formData, setFormData, displayImage }) {
    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Calculate total price when size or price_per_unit changes
    useEffect(() => {
        if (formData.size && formData.price_per_unit) {
            const totalPrice = formData.size * formData.price_per_unit;
            setFormData({
                ...formData,
                total_price: totalPrice
            });
        }
    }, [formData.size, formData.price_per_unit]);

    // Helper function to get preview URL for display image
    const getPreviewUrl = (file) => {
        if (!file) return null;
        
        // Handle base64 data directly
        if (file.base64) {
            return file.base64;
        }
        
        // Handle file.url directly if available
        if (file.url) {
            return file.url;
        }
        
        // Handle file.response from Upload component
        if (file.response && file.response.file && file.response.file.url) {
            return file.response.file.url;
        }
        
        // Handle originFileObj (for newly selected files)
        if (file.originFileObj) {
            return URL.createObjectURL(file.originFileObj);
        }
        
        // Handle tempPath directly
        if (file.tempPath) {
            return `/storage/${file.tempPath}`;
        }
        
        // Handle tempPath from response
        if (file.response && file.response.file && file.response.file.tempPath) {
            return `/storage/${file.response.file.tempPath}`;
        }
        
        return null;
    };

    // Helper function to check if file is an image
    const isImage = (file) => {
        if (!file) return false;
        
        // If file has base64 data that starts with image/jpeg or image/png, it's an image
        if (file.base64 && (
            file.base64.startsWith('data:image/jpeg') || 
            file.base64.startsWith('data:image/png') || 
            file.base64.startsWith('data:image/jpg')
        )) {
            return true;
        }
        
        // Check file.type if available
        const imageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        return file.type && imageTypes.includes(file.type);
    };

    // Render display image preview
    const renderDisplayImage = () => {
        if (!displayImage) return null;
        
        const previewUrl = getPreviewUrl(displayImage);
        
        return (
            <Card 
                title="រូបភាពបង្ហាញ" 
                className="mb-6"
                styles={{ body: { padding: '16px', textAlign: 'center' } }}
            >
                {isImage(displayImage) && previewUrl ? (
                    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                        <Image
                            src={previewUrl}
                            alt={displayImage.name || displayImage.fileName}
                            style={{ maxHeight: '350px', objectFit: 'contain' }}
                            preview={{ maskClassName: 'preview-mask', mask: <div>Click to view full size</div> }}
                            fallback="data:image/png;base64,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"
                        />
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        {displayImage.type && displayImage.type.includes('pdf') ? (
                            <FilePdfOutlined style={{ fontSize: '48px', color: '#ff4d4f' }} />
                        ) : (
                            <FileImageOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                        )}
                        <div style={{ marginTop: '8px' }}>
                            {displayImage.name || displayImage.fileName}
                        </div>
                    </div>
                )}
            </Card>
        );
    };

    return (
        <>
            {displayImage && renderDisplayImage()}
            
            <Card title="ព័ត៌មានដី" className="mb-6">
                <Form layout="vertical">
                <Form.Item 
                    label="លេខប្លង់" 
                    required 
                    rules={[{ required: true, message: 'សូមបញ្ចូលលេខប្លង់' }]}
                >
                    <Input 
                        placeholder="បញ្ចូលលេខប្លង់" 
                        value={formData.title_deed_number} 
                        onChange={(e) => handleChange('title_deed_number', e.target.value)} 
                    />
                </Form.Item>
                
                <Form.Item 
                    label="ទីតាំង" 
                    required
                >
                    <Input 
                        placeholder="បញ្ចូលទីតាំង" 
                        value={formData.location} 
                        onChange={(e) => handleChange('location', e.target.value)} 
                    />
                </Form.Item>
                
                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item 
                            label="ខេត្ត/ក្រុង" 
                            required
                        >
                            <Input 
                                placeholder="បញ្ចូលខេត្ត/ក្រុង" 
                                value={formData.province} 
                                onChange={(e) => handleChange('province', e.target.value)} 
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item 
                            label="ស្រុក/ខណ្ឌ" 
                            required
                        >
                            <Input 
                                placeholder="បញ្ចូលស្រុក/ខណ្ឌ" 
                                value={formData.district} 
                                onChange={(e) => handleChange('district', e.target.value)} 
                            />
                        </Form.Item>
                    </Col>
                </Row>
                
                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item 
                            label="ឃុំ/សង្កាត់" 
                            required
                        >
                            <Input 
                                placeholder="បញ្ចូលឃុំ/សង្កាត់" 
                                value={formData.commune} 
                                onChange={(e) => handleChange('commune', e.target.value)} 
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item 
                            label="ភូមិ" 
                            required
                        >
                            <Input 
                                placeholder="បញ្ចូលភូមិ" 
                                value={formData.village} 
                                onChange={(e) => handleChange('village', e.target.value)} 
                            />
                        </Form.Item>
                    </Col>
                </Row>
                
                <Row gutter={16}>
                    <Col xs={24} sm={16}>
                        <Form.Item 
                            label="ទំហំ" 
                            required
                        >
                            <InputNumber 
                                style={{ width: '100%' }}
                                placeholder="បញ្ចូលទំហំ" 
                                value={formData.size} 
                                onChange={(value) => handleChange('size', value)} 
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Form.Item 
                            label="ឯកតា" 
                            required
                        >
                            <Select 
                                value={formData.size_unit} 
                                onChange={(value) => handleChange('size_unit', value)}
                            >
                                <Option value="sqm">ម៉ែត្រការ៉េ</Option>
                                <Option value="hectare">ហិកតា</Option>
                                <Option value="acre">អាក្រ</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                
                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item 
                            label="តម្លៃក្នុងមួយឯកតា" 
                            required
                        >
                            <InputNumber 
                                style={{ width: '100%' }}
                                placeholder="បញ្ចូលតម្លៃក្នុងមួយឯកតា" 
                                value={formData.price_per_unit} 
                                onChange={(value) => handleChange('price_per_unit', value)} 
                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item 
                            label="តម្លៃសរុប" 
                            required
                        >
                            <InputNumber 
                                style={{ width: '100%' }}
                                placeholder="តម្លៃសរុប" 
                                value={formData.total_price} 
                                onChange={(value) => handleChange('total_price', value)} 
                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                disabled
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Card>
        </>
    );
}
