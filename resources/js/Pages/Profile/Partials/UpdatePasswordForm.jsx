import React, { useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { Form, Input, Button, Card, Typography, message, Space, Divider } from 'antd';
import { LockOutlined, SaveOutlined, CheckCircleOutlined } from '@ant-design/icons';

export default function UpdatePasswordForm() {
    const { Title, Text } = Typography;
    const passwordInput = useRef(null);
    const currentPasswordInput = useRef(null);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                message.success('ពាក្យសម្ងាត់ត្រូវបានប្តូរដោយជោគជ័យ');
            },
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <Card 
            bordered={false}
            style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}
        >
            <div className="mb-6">
                <Title level={4} className="khmer-heading mb-2">ប្តូរពាក្យសម្ងាត់</Title>
                <Text type="secondary" className="khmer-text">
                    ប្រាកដថាគណនីរបស់អ្នកប្រើពាក្យសម្ងាត់វែងនិងពិបាកដើម្បីរក្សាសុវត្ថិភាព។
                </Text>
            </div>

            <Form
                layout="vertical"
                onSubmitCapture={updatePassword}
                initialValues={data}
                className="khmer-text"
            >
                <Form.Item 
                    label="ពាក្យសម្ងាត់បច្ចុប្បន្ន" 
                    validateStatus={errors.current_password ? 'error' : ''}
                    help={errors.current_password}
                >
                    <Input.Password
                        prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        size="large"
                        autoComplete="current-password"
                        placeholder="បញ្ចូលពាក្យសម្ងាត់បច្ចុប្បន្នរបស់អ្នក"
                    />
                </Form.Item>

                <Form.Item 
                    label="ពាក្យសម្ងាត់ថ្មី" 
                    validateStatus={errors.password ? 'error' : ''}
                    help={errors.password}
                >
                    <Input.Password 
                        prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        size="large"
                        autoComplete="new-password"
                        placeholder="បញ្ចូលពាក្យសម្ងាត់ថ្មី"
                    />
                </Form.Item>

                <Form.Item 
                    label="បញ្ជាក់ពាក្យសម្ងាត់ថ្មី" 
                    validateStatus={errors.password_confirmation ? 'error' : ''}
                    help={errors.password_confirmation}
                >
                    <Input.Password 
                        prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        size="large"
                        autoComplete="new-password"
                        placeholder="បញ្ចូលពាក្យសម្ងាត់ថ្មីម្តងទៀត"
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
