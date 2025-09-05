import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Form, Input, Button, Steps, Card, Row, Col, 
    Typography, DatePicker, Radio, message, Breadcrumb, 
    Space
} from 'antd';
import { 
    SaveOutlined, ArrowLeftOutlined, ArrowRightOutlined, 
    CheckCircleOutlined, FileAddOutlined, UserOutlined
} from '@ant-design/icons';
import SellerForm from '@/Components/SellerForm';
import FrontImageUpload from '@/Components/FrontImageUpload';
import BackImageUpload from '@/Components/BackImageUpload';
import dayjs from 'dayjs';
import axios from 'axios';

const { Title, Text } = Typography;
const { Step } = Steps;

export default function SellerEdit({ seller, documents }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Initialize images from existing documents
    useEffect(() => {
        if (documents && documents.length > 0) {
            documents.forEach(doc => {
                const imageData = {
                    uid: doc.id,
                    name: doc.file_name,
                    fileName: doc.file_name,
                    url: `/storage/${doc.file_path}`,
                    base64: `/storage/${doc.file_path}`,
                    isExisting: true,
                    id: doc.id,
                    isDisplay: doc.is_display,
                    mimeType: 'image/jpeg'
                };
                
                if (doc.is_display) {
                    setFrontImage(imageData);
                } else {
                    setBackImage(imageData);
                }
            });
        }
    }, [documents]);

    const steps = [
        {
            title: 'រូបខាងមុខ',
            content: 'front-image',
        },
        {
            title: 'រូបខាងក្រោយ',
            content: 'back-image',
        },
        {
            title: 'បញ្ចូលព័ត៌មាន',
            content: 'seller-info',
        },
    ];

    const next = () => {
        if (currentStep === 0) {
            // Validate that front image is uploaded
            if (!frontImage) {
                message.error('សូមផ្ទុកឡើងរូបខាងមុខ');
                return;
            }
        } else if (currentStep === 1) {
            // Validate that back image is uploaded
            if (!backImage) {
                message.error('សូមផ្ទុកឡើងរូបខាងក្រោយ');
                return;
            }
        }
        setCurrentStep(currentStep + 1);
    };

    const prev = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            // Prepare files array with front and back images
            const files = [];
            if (frontImage) {
                files.push({
                    ...frontImage,
                    isDisplay: true, // Front image is always the display image
                    type: 'front'
                });
            }
            if (backImage) {
                files.push({
                    ...backImage,
                    isDisplay: false,
                    type: 'back'
                });
            }
            
            const submitData = {
                ...formData,
                files: files
            };
            
            // Submit data
            await axios.put(`/api/sellers/${seller.id}`, submitData);
            
            message.success('អ្នកលក់ត្រូវបានកែប្រែដោយជោគជ័យ');
            router.visit(route('data-entry.sellers.index'));
        } catch (error) {
            console.error('Error updating seller:', error);
            message.error('មានបញ្ហាក្នុងការកែប្រែអ្នកលក់');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="កែប្រែអ្នកលក់" />
            
            <div className="seller-edit">
                <Breadcrumb
                    items={[
                        { title: <Link href={route('data-entry.index')}>ជ្រើសរើសប្រភេទទិន្នន័យ</Link> },
                        { title: <Link href={route('data-entry.sellers.index')}>បញ្ជីអ្នកលក់</Link> },
                        { title: 'កែប្រែអ្នកលក់' },
                    ]}
                    className="mb-6"
                />
                
                <Card>
                    <Title level={4} className="khmer-heading mb-6">កែប្រែអ្នកលក់</Title>
                    
                    <Steps current={currentStep} className="mb-8">
                        {steps.map(item => (
                            <Step key={item.title} title={item.title} icon={item.icon} />
                        ))}
                    </Steps>
                    
                    <div className="steps-content mb-6">
                        {steps[currentStep].content === 'front-image' && (
                            <FrontImageUpload
                                category="seller"
                                frontImage={frontImage}
                                onFrontImageChange={setFrontImage}
                            />
                        )}
                        {steps[currentStep].content === 'back-image' && (
                            <BackImageUpload
                                category="seller"
                                backImage={backImage}
                                onBackImageChange={setBackImage}
                            />
                        )}
                        {steps[currentStep].content === 'seller-info' && (
                            <SellerForm
                                onSubmit={handleSubmit}
                                files={[frontImage, backImage].filter(Boolean)}
                                frontImage={frontImage}
                                initialValues={{
                                    name: seller.name,
                                    sex: seller.sex,
                                    date_of_birth: seller.date_of_birth ? dayjs(seller.date_of_birth) : null,
                                    identity_number: seller.identity_number,
                                    address: seller.address,
                                    phone_number: seller.phone_number
                                }}
                            />
                        )}
                    </div>
                    
                    <div className="steps-action">
                        <Row justify="space-between">
                            <Col>
                                {currentStep > 0 && (
                                    <Button 
                                        icon={<ArrowLeftOutlined />} 
                                        onClick={prev}
                                    >
                                        ត្រឡប់ក្រោយ
                                    </Button>
                                )}
                            </Col>
                            <Col>
                                <Space>
                                    <Button 
                                        onClick={() => router.visit(route('data-entry.sellers.index'))}
                                    >
                                        បោះបង់
                                    </Button>
                                    
                                    {currentStep < steps.length - 1 && (
                                        <Button 
                                            type="primary" 
                                            onClick={next}
                                            icon={<ArrowRightOutlined />}
                                            iconPosition="end"
                                        >
                                            {currentStep === 0 ? 'បន្តទៅរូបខាងក្រោយ' : 'បន្ទាប់'}
                                        </Button>
                                    )}
                                </Space>
                            </Col>
                        </Row>
                    </div>
                </Card>
            </div>
        </>
    );
}

SellerEdit.layout = page => <AdminLayout title="កែប្រែអ្នកលក់" children={page} />
