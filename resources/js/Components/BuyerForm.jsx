import React from 'react';
import { Form, Input, Select, DatePicker, Card, Image, Typography } from 'antd';
import { FileImageOutlined, FilePdfOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title, Text } = Typography;

export default function BuyerForm({ formData, setFormData, displayImage }) {
    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Helper function to get preview URL for display image
    const getPreviewUrl = (file) => {
        if (!file) {

            return null;
        }
        

        
        // Try base64 first - most reliable since it's embedded data
        if (file.base64) {

            return file.base64;
        }
        
        // Then try direct URL (which might also be base64)
        if (file.url) {
            // If URL is already a data URI, use it directly
            if (file.url.startsWith('data:')) {

                return file.url;
            }
            
            // If URL is a relative path, make sure it has the right prefix
            if (file.url.startsWith('/')) {

                return file.url;
            }
        }
        
        // Handle tempPath or path from response
        if (file.response?.file?.tempPath) {

            return `/storage/${file.response.file.tempPath}`;
        } else if (file.response?.path) {

            return `/storage/${file.response.path}`;
        } else if (file.tempPath) {

            return `/storage/${file.tempPath}`;
        }
        
        // Handle originFileObj (for newly selected files)
        if (file.originFileObj) {

            return URL.createObjectURL(file.originFileObj);
        } else if (file.originFileObj?.response?.file?.tempPath) {

            return `/storage/${file.originFileObj.response.file.tempPath}`;
        }
        

        return null;
    };

    // Helper function to check if file is an image
    const isImage = (file) => {
        if (!file) return false;
        
        // Check if we have base64 data that starts with image data URI
        if (file.base64 && file.base64.startsWith('data:image/')) {

            return true;
        }
        
        // Check if URL is a base64 image
        if (file.url && file.url.startsWith('data:image/')) {

            return true;
        }
        
        // Check file name for image extensions
        const fileName = file.name || file.fileName || '';
        if (fileName && /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(fileName)) {

            return true;
        }
        
        // Traditional MIME type check
        const imageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp', 'image/bmp'];
        const isImageType = file.type && imageTypes.includes(file.type);
        if (isImageType) {

            return true;
        }
        

        return false;
    };

    // Render display image preview
    const renderDisplayImage = () => {
        if (!displayImage) {

            return null;
        }
        

        
        // Force image detection based on file name if available
        const fileName = displayImage.name || displayImage.fileName || '';
        const isImageFile = isImage(displayImage) || (fileName && /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(fileName));
        

        
        // Get preview URL with more aggressive checks
        let previewUrl = null;
        
        // Try all possible sources for a URL
        if (displayImage.base64) {
            previewUrl = displayImage.base64;

        } else if (displayImage.url) {
            previewUrl = displayImage.url;

        } else if (displayImage.response?.file?.base64) {
            previewUrl = displayImage.response.file.base64;

        } else if (displayImage.tempPath) {
            previewUrl = `/storage/${displayImage.tempPath}`;

        } else if (fileName) {
            // Last resort - try to construct a URL from the file name
            previewUrl = `/storage/temp/${fileName}`;

        }
        

        
        // Debug all possible URL sources










        
        return (
            <Card 
                title="រូបភាពបង្ហាញ" 
                className="mb-6"
                styles={{ body: { padding: '16px', textAlign: 'center' } }}
            >
                {isImageFile && previewUrl ? (
                    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                        <Image
                            src={previewUrl}
                            alt={displayImage.name || displayImage.fileName || 'Image'}
                            style={{ maxHeight: '350px', objectFit: 'contain' }}
                            preview={{ maskClassName: 'preview-mask', mask: <div>Click to view full size</div> }}
                            fallback="data:image/png;base64,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"
                        />
                    </div>
                ) : (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        <div style={{ marginBottom: '10px', color: 'red' }}>
                            {!isImageFile ? 'Not an image file' : 'No valid URL found'}
                        </div>
                        {displayImage.type && displayImage.type.includes('pdf') ? (
                            <FilePdfOutlined style={{ fontSize: '48px', color: '#ff4d4f' }} />
                        ) : (
                            <FileImageOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                        )}
                        <div style={{ marginTop: '10px' }}>
                            {displayImage.name || displayImage.fileName || 'ឯកសារ'}
                        </div>
                    </div>
                )}
            </Card>
        );
    };

    return (
        <>
            {displayImage && renderDisplayImage()}
            
            <Card title="ព័ត៌មានអ្នកទិញ" className="mb-6">
                <Form layout="vertical">
                <Form.Item 
                    label="ឈ្មោះ" 
                    required 
                    rules={[{ required: true, message: 'សូមបញ្ចូលឈ្មោះ' }]}
                >
                    <Input 
                        placeholder="បញ្ចូលឈ្មោះ" 
                        value={formData.name} 
                        onChange={(e) => handleChange('name', e.target.value)} 
                    />
                </Form.Item>
                
                <Form.Item 
                    label="ភេទ" 
                    required
                >
                    <Select 
                        value={formData.sex} 
                        onChange={(value) => handleChange('sex', value)}
                    >
                        <Option value="male">ប្រុស</Option>
                        <Option value="female">ស្រី</Option>
                    </Select>
                </Form.Item>
                
                <Form.Item 
                    label="ថ្ងៃខែឆ្នាំកំណើត" 
                    required
                >
                    <DatePicker 
                        style={{ width: '100%' }} 
                        format="DD/MM/YYYY"
                        value={formData.date_of_birth ? dayjs(formData.date_of_birth) : null}
                        onChange={(date, dateString) => handleChange('date_of_birth', date ? date.format('YYYY-MM-DD') : null)}
                    />
                </Form.Item>
                
                <Form.Item 
                    label="លេខអត្តសញ្ញាណប័ណ្ណ" 
                    required
                >
                    <Input 
                        placeholder="បញ្ចូលលេខអត្តសញ្ញាណប័ណ្ណ" 
                        value={formData.identity_number} 
                        onChange={(e) => handleChange('identity_number', e.target.value)} 
                    />
                </Form.Item>
                
                <Form.Item 
                    label="អាសយដ្ឋាន" 
                    required
                >
                    <Input.TextArea 
                        placeholder="បញ្ចូលអាសយដ្ឋាន" 
                        rows={3} 
                        value={formData.address} 
                        onChange={(e) => handleChange('address', e.target.value)} 
                    />
                </Form.Item>
                
                <Form.Item 
                    label="លេខទូរស័ព្ទ"
                >
                    <Input 
                        placeholder="បញ្ចូលលេខទូរស័ព្ទ" 
                        value={formData.phone_number} 
                        onChange={(e) => handleChange('phone_number', e.target.value)} 
                    />
                </Form.Item>
            </Form>
        </Card>
        </>
    );
}
