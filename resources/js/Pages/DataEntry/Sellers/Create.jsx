import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Steps, Button, Card, Row, Col, message, Breadcrumb, Space } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, HomeOutlined } from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout';
import SellerForm from '@/Components/SellerForm';
import FrontImageUpload from '@/Components/FrontImageUpload';
import BackImageUpload from '@/Components/BackImageUpload';

export default function Create() {
    const { props } = usePage();
    const [current, setCurrent] = useState(0);
    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);
    const [loading, setLoading] = useState(false);
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
        if (current === 0) {
            // Validate that front image is uploaded
            if (!frontImage) {
                message.error('សូមផ្ទុកឡើងរូបខាងមុខ');
                return;
            }
        } else if (current === 1) {
            // Validate that back image is uploaded
            if (!backImage) {
                message.error('សូមផ្ទុកឡើងរូបខាងក្រោយ');
                return;
            }
        }
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
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
            
            // Use axios for API call with automatic CSRF handling
            const axios = window.axios;
            const response = await axios.post('/api/sellers', submitData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            // Axios response handling
            if (response.status === 200 || response.status === 201) {
                message.success('អ្នកលក់ត្រូវបានបង្កើតដោយជោគជ័យ');
                setLoading(false);
                // Use window.location for redirect to avoid Inertia issues
                window.location.href = '/data-entry/sellers';
            }
        } catch (error) {
            setLoading(false);
            console.error('Error creating seller:', error);
            
            if (error.response && error.response.data) {
                const result = error.response.data;
                if (result.errors) {
                    Object.keys(result.errors).forEach(key => {
                        const errorMessage = Array.isArray(result.errors[key]) ? result.errors[key][0] : result.errors[key];
                        message.error(errorMessage);
                    });
                } else if (result.message) {
                    message.error(result.message);
                } else {
                    message.error('មានបញ្ហាក្នុងការបង្កើតអ្នកលក់');
                }
            } else {
                message.error('មានបញ្ហាក្នុងការបង្កើតអ្នកលក់');
            }
        }
    };

    // handleSubmit function moved above its first use

    return (
        <>
            <Head title="បញ្ចូលព័ត៌មានអ្នកលក់ថ្មី" />
            
            <Breadcrumb 
                className="mb-6"
                items={[
                    {
                        href: route('dashboard'),
                        title: <HomeOutlined />
                    },
                    {
                        href: route('data-entry.index'),
                        title: 'ទិន្នន័យបញ្ចូល'
                    },
                    {
                        href: route('data-entry.sellers.index'),
                        title: 'បញ្ជីអ្នកលក់'
                    },
                    {
                        title: 'បញ្ចូលព័ត៌មានអ្នកលក់ថ្មី'
                    }
                ]}
            />
            
            <Card>
                <Steps
                    current={current}
                    items={steps.map(item => ({
                        title: item.title,
                        icon: item.icon,
                    }))}
                    className="mb-8"
                />
                
                <div className="steps-content mb-8">
                    {steps[current].content === 'front-image' && (
                        <FrontImageUpload
                            category="seller"
                            frontImage={frontImage}
                            onFrontImageChange={setFrontImage}
                        />
                    )}
                    {steps[current].content === 'back-image' && (
                        <BackImageUpload
                            category="seller"
                            backImage={backImage}
                            onBackImageChange={setBackImage}
                        />
                    )}
                    {steps[current].content === 'seller-info' && (
                        <SellerForm
                            onSubmit={handleSubmit}
                            files={[frontImage, backImage].filter(Boolean)}
                            frontImage={frontImage}
                        />
                    )}
                </div>
                
                <div className="steps-action">
                    <Row justify="space-between">
                        <Col>
                            {current > 0 && (
                                <Button 
                                    icon={<ArrowLeftOutlined />}
                                    onClick={prev}
                                >
                                    ត្រឡប់ក្រោយ
                                </Button>
                            )}
                        </Col>
                        <Col>
                            {current < steps.length - 1 && (
                                <Button 
                                    type="primary" 
                                    onClick={next}
                                    icon={<ArrowRightOutlined />}
                                    iconPosition="end"
                                >
                                    {current === 0 ? 'បន្តទៅរូបខាងក្រោយ' : 'បន្ទាប់'}
                                </Button>
                            )}
                        </Col>
                    </Row>
                </div>
            </Card>
        </>
    );
}

Create.layout = page => <AdminLayout children={page} title="បញ្ចូលព័ត៌មានអ្នកលក់ថ្មី" />
