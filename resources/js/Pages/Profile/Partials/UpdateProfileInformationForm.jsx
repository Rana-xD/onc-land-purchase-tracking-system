import React from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Form, Input, Button, Card, Typography, App, Space, Divider } from 'antd';
import { UserOutlined, SaveOutlined, CheckCircleOutlined } from '@ant-design/icons';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const { Title, Text } = Typography;
    const { message } = App.useApp();
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                message.success('ព័ត៌មានគណនីត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ');
            },
            onError: (errors) => {
                console.error('Profile update errors:', errors);
                message.error('មានបញ្ហាក្នុងការធ្វើបច្ចុប្បន្នភាពព័ត៌មានគណនី');
            }
        });
    };

    return (
        <Card 
            className={className}
            variant="outlined"
            style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}
        >
            <div className="mb-6">
                <Title level={4} className="khmer-heading mb-2">ព័ត៌មានគណនី</Title>
                <Text type="secondary" className="khmer-text">
                    ធ្វើបច្ចុប្បន្នភាពព័ត៌មានគណនីរបស់អ្នក។
                </Text>
            </div>

            <Form
                layout="vertical"
                onSubmitCapture={submit}
                initialValues={data}
                className="khmer-text"
            >
                <Form.Item 
                    label="ឈ្មោះ" 
                    validateStatus={errors.name ? 'error' : ''}
                    help={errors.name}
                >
                    <Input 
                        prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        size="large"
                        autoComplete="name"
                        placeholder="បញ្ចូលឈ្មោះរបស់អ្នក"
                    />
                </Form.Item>

                <Divider />
                
                <div className="flex justify-between items-center">
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={processing}
                        icon={<SaveOutlined />}
                        size="large"
                        className="khmer-text"
                    >
                        រក្សាទុក
                    </Button>

                    {recentlySuccessful && (
                        <Space>
                            <CheckCircleOutlined style={{ color: '#52c41a' }} />
                            <Text type="success" className="khmer-text">បានរក្សាទុក</Text>
                        </Space>
                    )}
                </div>
            </Form>
        </Card>
    );
}
