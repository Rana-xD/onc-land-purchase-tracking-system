import React from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Form, Input, Button, Card, Typography, message, Space, Divider } from 'antd';
import { UserOutlined, MailOutlined, SaveOutlined, CheckCircleOutlined } from '@ant-design/icons';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const { Title, Text } = Typography;
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            onSuccess: () => {
                message.success('ព័ត៌មានគណនីត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ');
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
                    ធ្វើបច្ចុប្បន្នភាពព័ត៌មានគណនីនិងអាសយដ្ឋានអ៊ីមែលរបស់អ្នក។
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

                <Form.Item 
                    label="អ៊ីមែល" 
                    validateStatus={errors.email ? 'error' : ''}
                    help={errors.email}
                >
                    <Input 
                        prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        size="large"
                        autoComplete="email"
                        placeholder="បញ្ចូលអាសយដ្ឋានអ៊ីមែលរបស់អ្នក"
                    />
                </Form.Item>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="mb-4">
                        <Text type="warning" className="khmer-text block mb-2">
                            អាសយដ្ឋានអ៊ីមែលរបស់អ្នកមិនទាន់បានផ្ទៀងផ្ទាត់នៅឡើយទេ។
                        </Text>
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="khmer-text text-blue-600 hover:text-blue-800"
                        >
                            ចុចទីនេះដើម្បីផ្ញើអ៊ីមែលផ្ទៀងផ្ទាត់ម្តងទៀត។
                        </Link>

                        {status === 'verification-link-sent' && (
                            <Text type="success" className="khmer-text block mt-2">
                                តំណភ្ជាប់ផ្ទៀងផ្ទាត់ថ្មីត្រូវបានផ្ញើទៅអាសយដ្ឋានអ៊ីមែលរបស់អ្នក។
                            </Text>
                        )}
                    </div>
                )}

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
