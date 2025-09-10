import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Steps, Button, Card, Row, Col, message, Breadcrumb, Space } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, HomeOutlined } from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout';
import LandForm from '@/Components/LandForm';
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
            content: 'land-info',
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
            const submitData = {
                ...formData,
                frontImage: frontImage,
                backImage: backImage
            };
            
            // Use axios for API call with automatic CSRF handling
            const axios = window.axios;
            const response = await axios.post('/api/lands', submitData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            // Axios response handling
            if (response.status === 200 || response.status === 201) {
                setLoading(false);
                // Use Inertia router with success message
                router.visit(route('data-entry.lands.index'), {
                    onSuccess: () => {
                        message.success('ដីត្រូវបានបង្កើតដោយជោគជ័យ');
                    }
                });
            }
        } catch (error) {
            setLoading(false);
            console.error('Error creating land:', error);
            
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
                    message.error('មានបញ្ហាក្នុងការបង្កើតដី');
                }
            } else {
                message.error('មានបញ្ហាក្នុងការបង្កើតដី');
            }
        }
    };

    return (
        <>
            <Head title="បញ្ចូលព័ត៌មានដីថ្មី" />
            
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
                        href: route('data-entry.lands.index'),
                        title: 'បញ្ជីដី'
                    },
                    {
                        title: 'បញ្ចូលព័ត៌មានដីថ្មី'
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
                            category="land"
                            frontImage={frontImage}
                            onFrontImageChange={setFrontImage}
                        />
                    )}
                    {steps[current].content === 'back-image' && (
                        <BackImageUpload
                            category="land"
                            backImage={backImage}
                            onBackImageChange={setBackImage}
                        />
                    )}
                    {steps[current].content === 'land-info' && (
                        <LandForm
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

Create.layout = page => <AdminLayout children={page} title="បញ្ចូលព័ត៌មានដីថ្មី" />
