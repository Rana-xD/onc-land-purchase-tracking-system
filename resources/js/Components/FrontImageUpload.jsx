import React, { useState } from 'react';
import { 
    Upload, Button, Modal, Spin, 
    Card, Typography, Space, Tag, Tooltip, message 
} from 'antd';
import { 
    UploadOutlined, DeleteOutlined, 
    EyeOutlined, FileImageOutlined, FilePdfOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function FrontImageUpload({ 
    category,
    frontImage,
    onFrontImageChange,
    maxSize = 10 // MB
}) {
    const [uploading, setUploading] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const handlePreview = async () => {
        if (frontImage?.url) {
            setPreviewImage(frontImage.url);
            setPreviewVisible(true);
            setPreviewTitle(frontImage.fileName || 'រូបខាងមុខ');
        }
    };

    const handleUpload = async ({ file, onSuccess, onError }) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('អ្នកអាចផ្ទុកឡើងបានតែរូបភាពប្រភេទ JPG ឬ PNG ប៉ុណ្ណោះ!');
            onError('File type error');
            return;
        }
        
        const isLessThanMaxSize = file.size / 1024 / 1024 < maxSize;
        if (!isLessThanMaxSize) {
            message.error(`អ្នកអាចផ្ទុកឡើងបានតែរូបភាពទំហំតូចជាង ${maxSize}MB ប៉ុណ្ណោះ!`);
            onError('File size error');
            return;
        }
        
        setUploading(true);
        
        try {
            const base64Data = await getBase64(file);
            
            const imageData = {
                fileName: file.name,
                base64: base64Data,
                mimeType: file.type,
                size: file.size,
                url: base64Data
            };
            
            onFrontImageChange(imageData);
            onSuccess({ success: true });
            message.success('រូបខាងមុខត្រូវបានផ្ទុកឡើងដោយជោគជ័យ');
        } catch (error) {
            console.error('Error uploading front image:', error);
            message.error('មានបញ្ហាក្នុងការផ្ទុកឡើងរូបខាងមុខ');
            onError('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        Modal.confirm({
            title: 'តើអ្នកពិតជាចង់លុបរូបខាងមុខនេះមែនទេ?',
            content: 'សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។',
            okText: 'យល់ព្រម',
            cancelText: 'បោះបង់',
            onOk: () => {
                onFrontImageChange(null);
                message.success('រូបខាងមុខត្រូវបានលុបដោយជោគជ័យ');
            }
        });
    };

    const uploadButton = (
        <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>ផ្ទុកឡើងរូបខាងមុខ</div>
        </div>
    );

    return (
        <div className="front-image-upload">
            <Title level={5} className="khmer-heading mb-4">រូបខាងមុខ</Title>
            
            <Text className="khmer-text mb-4 block">
                សូមផ្ទុកឡើងរូបខាងមុខ (អតិបរមា 1 រូបភាព, ទំហំអតិបរមា {maxSize}MB)
            </Text>
            
            {/* Display uploaded front image */}
            {frontImage && (
                <div style={{ marginBottom: '24px' }}>
                    <Card
                        size="small"
                        className="border-2 border-blue-500"
                        style={{ width: '300px' }}
                        cover={
                            <div style={{ padding: '12px', textAlign: 'center', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {frontImage.mimeType && frontImage.mimeType.includes('image') ? (
                                    <img 
                                        src={frontImage.url} 
                                        alt="រូបខាងមុខ" 
                                        style={{ maxHeight: '160px', maxWidth: '100%', objectFit: 'contain' }} 
                                    />
                                ) : (
                                    <div style={{ textAlign: 'center' }}>
                                        <FileImageOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                                        <div style={{ marginTop: '8px', wordBreak: 'break-word' }}>
                                            <Tooltip title={frontImage.fileName}>{frontImage.fileName}</Tooltip>
                                        </div>
                                    </div>
                                )}
                            </div>
                        }
                    >
                        <div style={{ minHeight: '40px' }}>
                            <Tooltip title={frontImage.fileName}>
                                <div style={{ wordBreak: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {frontImage.fileName}
                                </div>
                            </Tooltip>
                            <Tag color="blue" style={{ marginTop: '4px' }}>រូបខាងមុខ</Tag>
                        </div>
                        
                        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                            <Button 
                                type="text" 
                                icon={<EyeOutlined />} 
                                onClick={handlePreview}
                                size="small"
                            />
                            
                            <Button 
                                type="text" 
                                icon={<DeleteOutlined />} 
                                danger
                                size="small"
                                onClick={handleRemove}
                            />
                        </div>
                    </Card>
                </div>
            )}
            
            {/* Upload button - only show if no front image */}
            {!frontImage && (
                <Upload
                    listType="picture-card"
                    fileList={[]}
                    customRequest={handleUpload}
                    multiple={false}
                    maxCount={1}
                    disabled={uploading}
                    accept=".jpg,.jpeg,.png"
                    showUploadList={false}
                >
                    {uploadButton}
                </Upload>
            )}
            
            <Modal
                open={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewVisible(false)}
            >
                {previewImage && (
                    <img alt={previewTitle} style={{ width: '100%' }} src={previewImage} />
                )}
            </Modal>
            
            {uploading && (
                <div className="upload-loading">
                    <Spin tip="កំពុងផ្ទុកឡើង..." size="large">
                        <div className="content"></div>
                    </Spin>
                </div>
            )}
        </div>
    );
}
