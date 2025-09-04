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

export default function BackImageUpload({ 
    category,
    backImage,
    onBackImageChange,
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
        if (backImage?.url) {
            setPreviewImage(backImage.url);
            setPreviewVisible(true);
            setPreviewTitle(backImage.fileName || 'រូបខាងក្រោយ');
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
            
            onBackImageChange(imageData);
            onSuccess({ success: true });
            message.success('រូបខាងក្រោយត្រូវបានផ្ទុកឡើងដោយជោគជ័យ');
        } catch (error) {
            console.error('Error uploading back image:', error);
            message.error('មានបញ្ហាក្នុងការផ្ទុកឡើងរូបខាងក្រោយ');
            onError('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        Modal.confirm({
            title: 'តើអ្នកពិតជាចង់លុបរូបខាងក្រោយនេះមែនទេ?',
            content: 'សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។',
            okText: 'យល់ព្រម',
            cancelText: 'បោះបង់',
            onOk: () => {
                onBackImageChange(null);
                message.success('រូបខាងក្រោយត្រូវបានលុបដោយជោគជ័យ');
            }
        });
    };

    const uploadButton = (
        <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>ផ្ទុកឡើងរូបខាងក្រោយ</div>
        </div>
    );

    return (
        <div className="back-image-upload">
            <Title level={5} className="khmer-heading mb-4">រូបខាងក្រោយ</Title>
            
            <Text className="khmer-text mb-4 block">
                សូមផ្ទុកឡើងរូបខាងក្រោយ (អតិបរមា 1 រូបភាព, ទំហំអតិបរមា {maxSize}MB)
            </Text>
            
            {/* Display uploaded back image */}
            {backImage && (
                <div style={{ marginBottom: '24px' }}>
                    <Card
                        size="small"
                        className="border-2 border-green-500"
                        style={{ width: '300px' }}
                        cover={
                            <div style={{ padding: '12px', textAlign: 'center', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {backImage.mimeType && backImage.mimeType.includes('image') ? (
                                    <img 
                                        src={backImage.url} 
                                        alt="រូបខាងក្រោយ" 
                                        style={{ maxHeight: '160px', maxWidth: '100%', objectFit: 'contain' }} 
                                    />
                                ) : (
                                    <div style={{ textAlign: 'center' }}>
                                        <FileImageOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                                        <div style={{ marginTop: '8px', wordBreak: 'break-word' }}>
                                            <Tooltip title={backImage.fileName}>{backImage.fileName}</Tooltip>
                                        </div>
                                    </div>
                                )}
                            </div>
                        }
                    >
                        <div style={{ minHeight: '40px' }}>
                            <Tooltip title={backImage.fileName}>
                                <div style={{ wordBreak: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {backImage.fileName}
                                </div>
                            </Tooltip>
                            <Tag color="green" style={{ marginTop: '4px' }}>រូបខាងក្រោយ</Tag>
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
            
            {/* Upload button - only show if no back image */}
            {!backImage && (
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
