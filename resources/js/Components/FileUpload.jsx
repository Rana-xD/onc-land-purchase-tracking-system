import React, { useState, useEffect } from 'react';
import { 
    Upload, Button, Modal, Spin, 
    Card, Row, Col, Typography, Space, Tag, Tooltip 
} from 'antd';
import { 
    UploadOutlined, DeleteOutlined, 
    EyeOutlined, CheckCircleOutlined,
    FileImageOutlined, FilePdfOutlined 
} from '@ant-design/icons';
import axios from 'axios';
import messageUtil from '@/utils/message';

const { Title, Text } = Typography;

// Custom styles for the file upload component
const styles = {
    fileGridContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '16px'
    },
    fileCard: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    fileCardCover: {
        padding: '8px',
        textAlign: 'center',
        height: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    filePreviewImage: {
        maxHeight: '100px',
        maxWidth: '100%',
        objectFit: 'contain'
    },
    fileIconContainer: {
        textAlign: 'center'
    },
    fileIcon: {
        fontSize: '48px'
    },
    fileName: {
        marginTop: '8px',
        wordBreak: 'break-word',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
    },
    displayTag: {
        marginTop: '4px'
    },
    cardActions: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 8px'
    }
};

export default function FileUpload({ 
    category,
    referenceId = null,
    initialFiles = [],
    onFilesChange,
    maxFiles = 4,
    maxSize = 10, // MB
}) {
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    
    useEffect(() => {
        if (initialFiles && initialFiles.length > 0) {
            const files = initialFiles.map(file => ({
                uid: file.id,
                name: file.file_name,
                status: 'done',
                url: `/storage/${file.file_path}`,
                response: { id: file.id },
                isDisplay: file.is_display,
                isExisting: true,
            }));
            setFileList(files);
        }
    }, [initialFiles]);

    const handlePreview = async (file) => {
        if (file.url) {
            setPreviewImage(file.url);
            setPreviewVisible(true);
            setPreviewTitle(file.name);
            return;
        }
        
        if (file.originFileObj) {
            const preview = await getBase64(file.originFileObj);
            setPreviewImage(preview);
            setPreviewVisible(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        }
    };

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const handleUpload = async ({ file, onSuccess, onError }) => {
        const isJpgOrPngOrPdf = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf';
        if (!isJpgOrPngOrPdf) {
            messageUtil.error('អ្នកអាចផ្ទុកឡើងបានតែឯកសារប្រភេទ JPG, PNG, ឬ PDF ប៉ុណ្ណោះ!');
            onError('File type error');
            return;
        }
        
        const isLessThanMaxSize = file.size / 1024 / 1024 < maxSize;
        if (!isLessThanMaxSize) {
            messageUtil.error(`ឯកសារត្រូវតែមានទំហំតិចជាង ${maxSize}MB!`);
            onError('File size error');
            return;
        }
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);
        
        try {
            setUploading(true);
            const response = await axios.post('/api/files/upload-temp', formData);
            onSuccess(response.data);
            messageUtil.success('ឯកសារត្រូវបានផ្ទុកឡើងដោយជោគជ័យ');
        } catch (error) {
            console.error('Error uploading file:', error);
            messageUtil.error('មានបញ្ហាក្នុងការផ្ទុកឡើងឯកសារ');
            onError('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleChange = ({ fileList: newFileList }) => {
        // Filter out files with error status
        const filteredList = newFileList.filter(file => file.status !== 'error');
        setFileList(filteredList);
        
        // Notify parent component of changes
        const files = filteredList.map(file => {
            if (file.isExisting) {
                return {
                    id: file.response?.id,
                    isExisting: true,
                    isDisplay: file.isDisplay || false,
                    url: file.url,  // Preserve URL for existing files
                    response: file.response  // Preserve the complete response
                };
            } else {
                // For new files, preserve all important information
                // Create a direct URL to the uploaded file - NEVER use just the filename
                // Always use the complete path from the response with the timestamp prefix
                const fileUrl = file.response?.file?.url || 
                               (file.response?.file?.tempPath ? `/storage/${file.response.file.tempPath}` : null) ||
                               (file.response?.path ? `/storage/${file.response.path}` : null);
                
                console.log('Creating file URL:', fileUrl, 'from file:', file);
                
                return {
                    tempPath: file.response?.file?.tempPath || file.response?.path,
                    url: fileUrl,
                    fileName: file.name,
                    isDisplay: file.isDisplay || false,
                    response: file.response  // Preserve the complete response
                };
            }
        });
        
        console.log('Files being sent to parent component:', files);
        
        // Only call onFilesChange if it exists and is a function
        if (onFilesChange && typeof onFilesChange === 'function') {
            onFilesChange(files);
        }
    };

    const handleRemove = async (file) => {
        if (file.isExisting && referenceId) {
            try {
                // Check if this is the only display document
                const displayFiles = fileList.filter(f => f.isDisplay);
                if (displayFiles.length === 1 && displayFiles[0].uid === file.uid) {
                    messageUtil.error('មិនអាចលុបឯកសារនេះបានទេ ព្រោះវាជាឯកសារតែមួយគត់ដែលបង្ហាញ។ សូមកំណត់ឯកសារផ្សេងជាឯកសារបង្ហាញជាមុនសិន។');
                    return false;
                }
                
                await axios.delete(`/api/${category}s/${referenceId}/documents/${file.response.id}`);
                messageUtil.success('ឯកសារត្រូវបានលុបដោយជោគជ័យ');
                return true;
            } catch (error) {
                console.error('Error deleting file:', error);
                messageUtil.error('មានបញ្ហាក្នុងការលុបឯកសារ');
                return false;
            }
        }
        return true;
    };

    const setAsDisplay = async (file) => {
        console.log('Setting as display image:', file);
        
        // Store the original file object to ensure we have all the data
        const originalFile = fileList.find(f => f.uid === file.uid);
        console.log('Original file from fileList:', originalFile);
        
        // Extract the complete path information from the original file
        const tempPath = originalFile?.response?.file?.tempPath || originalFile?.response?.path;
        const fileUrl = originalFile?.response?.file?.url || 
                      (originalFile?.response?.file?.tempPath ? `/storage/${originalFile.response.file.tempPath}` : null) ||
                      (originalFile?.response?.path ? `/storage/${originalFile.response.path}` : null);
        
        console.log('Extracted tempPath:', tempPath);
        console.log('Extracted fileUrl:', fileUrl);
        
        if (file.isExisting && referenceId) {
            try {
                await axios.put(`/api/${category}s/${referenceId}/documents/${file.response.id}/set-display`);
                
                // Update file list to reflect the change
                const newFileList = fileList.map(f => ({
                    ...f,
                    isDisplay: f.uid === file.uid
                }));
                
                setFileList(newFileList);
                
                // Notify parent component
                const files = newFileList.map(f => {
                    if (f.isExisting) {
                        return {
                            id: f.response.id,
                            isExisting: true,
                            isDisplay: f.uid === file.uid,
                            url: f.url,  // Preserve URL for existing files
                            response: f.response  // Preserve the complete response
                        };
                    } else {
                        return {
                            tempPath: f.response?.file?.tempPath || f.response?.path,
                            url: f.response?.file?.url || `/storage/${f.response?.path}`,  // Ensure URL is properly formatted
                            fileName: f.name,
                            isDisplay: f.uid === file.uid,
                            response: f.response  // Preserve the complete response
                        };
                    }
                });
                
                console.log('Files being sent to parent component (existing):', files);
                
                if (onFilesChange && typeof onFilesChange === 'function') {
                    onFilesChange(files);
                }
                messageUtil.success('ឯកសារត្រូវបានកំណត់ជាឯកសារបង្ហាញដោយជោគជ័យ');
            } catch (error) {
                console.error('Error setting display document:', error);
                messageUtil.error('មានបញ្ហាក្នុងការកំណត់ឯកសារបង្ហាញ');
            }
        } else {
            // For new files, just update the state
            const newFileList = fileList.map(f => ({
                ...f,
                isDisplay: f.uid === file.uid
            }));
            
            setFileList(newFileList);
            
            // Notify parent component
            const files = newFileList.map(f => {
                if (f.isExisting) {
                    return {
                        id: f.response.id,
                        isExisting: true,
                        isDisplay: f.uid === file.uid,
                        url: f.url,  // Preserve URL for existing files
                        response: f.response  // Preserve the complete response
                    };
                } else {
                    // Find the original file with complete data
                    const origFile = fileList.find(orig => orig.uid === f.uid);
                    
                    // Create a direct URL to the uploaded file - NEVER use just the filename
                    // Always use the complete path from the response
                    const fileUrl = origFile?.response?.file?.url || 
                                   (origFile?.response?.file?.tempPath ? `/storage/${origFile.response.file.tempPath}` : null) ||
                                   (origFile?.response?.path ? `/storage/${origFile.response.path}` : null)
                    
                    console.log('Creating display image URL:', fileUrl, 'from file:', origFile);
                    
                    // For new files, ensure we have the complete path information
                    const result = {
                        tempPath: origFile?.response?.file?.tempPath || origFile?.response?.path,
                        url: fileUrl,
                        fileName: f.name,
                        isDisplay: f.uid === file.uid,
                        response: origFile?.response  // Preserve the complete response
                    };
                    
                    // If this is the display image, make sure it has the tempPath and url
                    if (f.uid === file.uid) {
                        result.tempPath = tempPath || result.tempPath;
                        result.url = fileUrl || result.url;
                        console.log('Setting display image with tempPath and url:', result);
                    }
                    
                    console.log('New file object for display:', result);
                    return result;
                }
            });
            
            console.log('Files being sent to parent component (new):', files);
            
            if (onFilesChange && typeof onFilesChange === 'function') {
                onFilesChange(files);
            }
            messageUtil.success('ឯកសារត្រូវបានកំណត់ជាឯកសារបង្ហាញដោយជោគជ័យ');
        }
    };

    const uploadButton = (
        <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>ផ្ទុកឡើង</div>
        </div>
    );

    return (
        <div className="file-upload">
            <Title level={5} className="khmer-heading mb-4">ឯកសារ</Title>
            
            <Text className="khmer-text mb-4 block">
                សូមផ្ទុកឡើងឯកសារ (អតិបរមា {maxFiles} ឯកសារ, ទំហំអតិបរមា {maxSize}MB ក្នុងមួយឯកសារ)
            </Text>
            
            {/* Custom grid layout for file cards */}
            {fileList.length > 0 && (
                <div style={styles.fileGridContainer}>
                    {fileList.map(file => {
                        // Don't render anything for error files
                        if (file.status === 'error') {
                            return null;
                        }
                        
                        return (
                            <Card
                                key={file.uid}
                                size="small"
                                className={`file-card ${file.isDisplay ? 'border-2 border-blue-500' : ''}`}
                                style={styles.fileCard}
                                styles={{ body: { padding: '8px', flex: '1 0 auto' } }}
                                cover={
                                    <div style={styles.fileCardCover}>
                                        {file.type && file.type.includes('image') ? (
                                            <img 
                                                src={file.url || (file.originFileObj && URL.createObjectURL(file.originFileObj))} 
                                                alt={file.name} 
                                                style={styles.filePreviewImage} 
                                            />
                                        ) : (
                                            <div style={styles.fileIconContainer}>
                                                {file.type && file.type.includes('pdf') ? (
                                                    <FilePdfOutlined style={{ ...styles.fileIcon, color: '#ff4d4f' }} />
                                                ) : (
                                                    <FileImageOutlined style={{ ...styles.fileIcon, color: '#1890ff' }} />
                                                )}
                                                <div style={styles.fileName}>
                                                    <Tooltip title={file.name}>{file.name}</Tooltip>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                }
                            >
                                <div style={{ minHeight: '40px' }}>
                                    <Tooltip title={file.name}>
                                        <div style={styles.fileName}>{file.name}</div>
                                    </Tooltip>
                                    {file.isDisplay && (
                                        <Tag color="blue" style={styles.displayTag}>ឯកសារបង្ហាញ</Tag>
                                    )}
                                </div>
                                
                                {/* Custom action buttons with proper spacing */}
                                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                                    <Button 
                                        type="text" 
                                        icon={<EyeOutlined />} 
                                        onClick={() => handlePreview(file)}
                                        size="small"
                                    />
                                    
                                    {/* On small screens, show only icon */}
                                    <Tooltip title="កំណត់ជាបង្ហាញ">
                                        <Button 
                                            type={file.isDisplay ? 'primary' : 'default'}
                                            icon={<CheckCircleOutlined />}
                                            size="small"
                                            onClick={() => setAsDisplay(file)}
                                            disabled={file.isDisplay}
                                            className="display-button"
                                        >
                                            <span className="button-text">{file.isDisplay ? 'បង្ហាញ' : 'កំណត់ជាបង្ហាញ'}</span>
                                        </Button>
                                    </Tooltip>
                                    
                                    <Button 
                                        type="text" 
                                        icon={<DeleteOutlined />} 
                                        danger
                                        size="small"
                                        onClick={() => {
                                            const onConfirm = async () => {
                                                const success = await handleRemove(file);
                                                if (success) {
                                                    const newFileList = fileList.filter(item => item.uid !== file.uid);
                                                    setFileList(newFileList);
                                                    handleChange({ fileList: newFileList });
                                                }
                                            };
                                            
                                            Modal.confirm({
                                                title: 'តើអ្នកពិតជាចង់លុបឯកសារនេះមែនទេ?',
                                                content: 'សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។',
                                                okText: 'យល់ព្រម',
                                                cancelText: 'បោះបង់',
                                                onOk: onConfirm
                                            });
                                        }}
                                    />
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
            
            {/* Upload button */}
            <Upload
                listType="picture-card"
                fileList={[]}
                customRequest={handleUpload}
                onChange={handleChange}
                onPreview={handlePreview}
                multiple={true}
                maxCount={maxFiles}
                disabled={uploading || fileList.length >= maxFiles}
                accept=".jpg,.jpeg,.png,.pdf"
                className="file-upload-button"
                showUploadList={false}
            >
                {fileList.length >= maxFiles ? null : uploadButton}
            </Upload>
            
            <Modal
                open={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewVisible(false)}
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
            
            {uploading && (
                <div className="upload-loading">
                    <Spin tip="កំពុងផ្ទុកឡើង..." size="large">
                        <div className="content">
                        </div>
                    </Spin>
                </div>
            )}
        </div>
    );
}
