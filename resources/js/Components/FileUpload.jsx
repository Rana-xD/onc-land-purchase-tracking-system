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
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '24px'
    },
    fileCard: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    fileCardCover: {
        padding: '12px',
        textAlign: 'center',
        height: '180px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    filePreviewImage: {
        maxHeight: '160px',
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
    maxFiles = 2,
    maxSize = 10, // MB
}) {
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    
    useEffect(() => {
        if (initialFiles && initialFiles.length > 0 && fileList.length === 0) {
            const files = initialFiles.map(file => ({
                uid: file.id,
                name: file.file_name,
                status: 'done',
                url: `/storage/${file.file_path}`,
                response: { id: file.id, path: file.file_path },
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
            messageUtil.error('អ្នកអាចផ្ទុកឡើងបានតែកិច្ចសន្យាប្រភេទ JPG, PNG, ឬ PDF ប៉ុណ្ណោះ!');
            onError('File type error');
            return;
        }
        
        const isLessThanMaxSize = file.size / 1024 / 1024 < maxSize;
        if (!isLessThanMaxSize) {
            messageUtil.error(`អ្នកអាចផ្ទុកឡើងបានតែកិច្ចសន្យាទំហំតូចជាង ${maxSize}MB ប៉ុណ្ណោះ!`);
            onError('File size error');
            return;
        }
        
        setUploading(true);
        
        try {
            // Generate base64 data for the file
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64Data = reader.result;
                
                // Create response with file info and base64 data
                const response = {
                    success: true,
                    file: {
                        fileName: file.name,
                        base64: base64Data,
                        mimeType: file.type,
                        size: file.size
                    }
                };
                
                // Call the onSuccess callback with the response
                onSuccess(response);
                setUploading(false);
            };
            messageUtil.success('កិច្ចសន្យាត្រូវបានផ្ទុកឡើងដោយជោគជ័យ');
        } catch (error) {
            console.error('Error uploading file:', error);
            messageUtil.error('មានបញ្ហាក្នុងការផ្ទុកឡើងកិច្ចសន្យា');
            onError('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleChange = async ({ file, fileList: newFileList }) => {
        console.log('FileUpload handleChange called', { file, fileList: newFileList.length });
        
        // Process each file to ensure it has base64 data
        const processedFiles = await Promise.all(newFileList.map(async (fileItem) => {
            // If file already has base64 data, return it as is
            if (fileItem.base64) {
                return fileItem;
            }
            
            // If file has response with base64 data, use that
            if (fileItem.status === 'done' && fileItem.response && fileItem.response.file?.base64) {
                return { 
                    ...fileItem, 
                    url: fileItem.response.file.base64,
                    base64: fileItem.response.file.base64,
                    tempPath: fileItem.response.file?.tempPath || null,
                    fileName: fileItem.name
                };
            }
            
            // If file has originFileObj, generate base64 data
            if (fileItem.originFileObj) {
                try {
                    const base64Data = await getBase64(fileItem.originFileObj);
                    return { 
                        ...fileItem, 
                        url: fileItem.url || URL.createObjectURL(fileItem.originFileObj),
                        base64: base64Data,
                        fileName: fileItem.name,
                        tempPath: fileItem.tempPath || fileItem.response?.file?.tempPath || fileItem.response?.path
                    };
                } catch (error) {
                    console.error('Error generating base64 for file:', error);
                }
            }
            
            // If file has a URL but no base64 (e.g., existing files), try to fetch and convert
            if (fileItem.url && !fileItem.base64 && !fileItem.url.startsWith('data:')) {
                try {
                    // For existing files with URLs, we'll use the URL as is
                    return {
                        ...fileItem,
                        base64: fileItem.url, // Use URL as fallback
                        fileName: fileItem.name,
                        tempPath: fileItem.tempPath || fileItem.response?.file?.tempPath || fileItem.response?.path
                    };
                } catch (error) {
                    console.error('Error handling existing file URL:', error);
                }
            }
            
            return fileItem;
        }));

        const filteredList = processedFiles.filter(file => file.status !== 'error');
        setFileList(filteredList);
        
        // Notify parent component of changes
        const filesForParent = filteredList.map(file => {
            // Log each file's data for debugging (without full base64 content)
            console.log('Processing file for parent:', {
                name: file.name,
                tempPath: file.tempPath,
                status: file.status,
                hasBase64: !!file.base64,
                base64Length: file.base64 ? file.base64.substring(0, 30) + '...' : null
            });
            
            return {
                id: file.response?.id,
                isExisting: file.isExisting || false,
                tempPath: file.tempPath,
                url: file.url,
                base64: file.base64, // Include base64 data
                fileName: file.name,
                mimeType: file.type || (file.originFileObj ? file.originFileObj.type : 'image/jpeg'),
                isDisplay: file.isDisplay || false,
                response: file.response,
            };
        });
        
        console.log('Files being sent to parent component:', filesForParent.map(f => ({
            ...f,
            base64: f.base64 ? `${f.base64.substring(0, 30)}...` : null // Truncate base64 for logging
        })));
        
        if (onFilesChange && typeof onFilesChange === 'function') {
            onFilesChange(filesForParent);
        }
    };

    const handleRemove = async (file) => {
        if (file.isExisting && referenceId) {
            try {
                // Check if this is the only display document
                const displayFiles = fileList.filter(f => f.isDisplay);
                if (displayFiles.length === 1 && displayFiles[0].uid === file.uid) {
                    messageUtil.error('មិនអាចលុបកិច្ចសន្យានេះបានទេ ព្រោះវាជាកិច្ចសន្យាតែមួយគត់ដែលបង្ហាញ។ សូមកំណត់កិច្ចសន្យាផ្សេងជាកិច្ចសន្យាបង្ហាញជាមុនសិន។');
                    return false;
                }
                
                await axios.delete(`/api/${category}s/${referenceId}/documents/${file.response.id}`);
                messageUtil.success('កិច្ចសន្យាត្រូវបានលុបដោយជោគជ័យ');
                return true;
            } catch (error) {
                console.error('Error deleting file:', error);
                messageUtil.error('មានបញ្ហាក្នុងការលុបកិច្ចសន្យា');
                return false;
            }
        }
        return true;
    };

    const setAsDisplay = async (file) => {
        console.log('Setting as display image:', file);

        // Find the original file with all its data
        const originalFile = fileList.find(f => f.uid === file.uid);
        console.log('Original file data:', originalFile);
        
        // Extract base64 data from all possible sources
        const base64Data = originalFile?.response?.file?.base64 || 
                         (originalFile?.url?.startsWith('data:') ? originalFile.url : null) ||
                         originalFile?.base64;
        
        console.log('Base64 data found:', !!base64Data);

        const newFileList = fileList.map(f => ({
            ...f,
            isDisplay: f.uid === file.uid
        }));

        setFileList(newFileList);

        const filesForParent = newFileList.map(f => {
            // Start with a complete result object with all possible data sources
            const result = {
                id: f.response?.id,
                isExisting: f.isExisting || false,
                tempPath: f.response?.file?.tempPath || f.response?.path,
                url: f.url, // The URL is now reliable from the file object itself
                base64: f.response?.file?.base64 || (f.url?.startsWith('data:') ? f.url : null) || f.base64,
                fileName: f.name,
                isDisplay: f.isDisplay,
                response: f.response
            };
            
            // If this is the display image, ensure it has all the data we need
            if (f.isDisplay) {
                console.log('New file object for display:', result);
                
                // For display images, make sure we have a valid URL by checking all possible sources
                if (!result.url || !result.url.startsWith('data:')) {
                    // Try base64 first
                    if (result.base64) {
                        result.url = result.base64;
                        console.log('Using base64 data as URL for display image');
                    }
                    // Then try tempPath
                    else if (result.tempPath) {
                        result.url = `/storage/${result.tempPath}`;
                        console.log('Using tempPath as URL for display image');
                    }
                    // If we still don't have a URL and have an originFileObj, create one
                    else if (f.originFileObj) {
                        // Create a base64 URL synchronously if possible
                        if (window.FileReader) {
                            const reader = new FileReader();
                            reader.readAsDataURL(f.originFileObj);
                            reader.onload = () => {
                                // This happens asynchronously, so we need to update the parent again
                                const updatedFiles = filesForParent.map(file => {
                                    if (file.isDisplay) {
                                        return {
                                            ...file,
                                            url: reader.result,
                                            base64: reader.result
                                        };
                                    }
                                    return file;
                                });
                                
                                console.log('Created base64 URL for display image');
                                
                                // Update the parent with the new URL
                                if (onFilesChange && typeof onFilesChange === 'function') {
                                    onFilesChange(updatedFiles);
                                }
                            };
                        }
                    }
                }
            }

            return result;
        });
        
        console.log('Files being sent to parent component (new):', filesForParent);

        if (onFilesChange && typeof onFilesChange === 'function') {
            onFilesChange(filesForParent);
        }

        if (file.isExisting && referenceId) {
            try {
                await axios.put(`/api/${category}s/${referenceId}/documents/${file.response.id}/set-display`);
                messageUtil.success('កិច្ចសន្យាត្រូវបានកំណត់ជាកិច្ចសន្យាបង្ហាញដោយជោគជ័យ');
            } catch (error) {
                console.error('Error setting display document:', error);
                messageUtil.error('មានបញ្ហាក្នុងការកំណត់កិច្ចសន្យាបង្ហាញ');
                setFileList(fileList); // Revert on failure
            }
        } else {
            messageUtil.success('កិច្ចសន្យាត្រូវបានកំណត់ជាកិច្ចសន្យាបង្ហាញដោយជោគជ័យ');
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
            <Title level={5} className="khmer-heading mb-4">កិច្ចសន្យា</Title>
            
            <Text className="khmer-text mb-4 block">
                សូមផ្ទុកឡើងកិច្ចសន្យា (អតិបរមា {maxFiles} កិច្ចសន្យា, ទំហំអតិបរមា {maxSize}MB ក្នុងមួយកិច្ចសន្យា)
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
                                        <Tag color="blue" style={styles.displayTag}>កិច្ចសន្យាបង្ហាញ</Tag>
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
                                                title: 'តើអ្នកពិតជាចង់លុបកិច្ចសន្យានេះមែនទេ?',
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
