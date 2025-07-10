import React, { useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Form, Input, Button, Card, Typography, Modal, Space, Divider, Popconfirm } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined, LockOutlined } from '@ant-design/icons';

export default function DeleteUserForm() {
    const { Title, Text, Paragraph } = Typography;
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <Card 
            variant="borderless"
            style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}
        >
            <div className="mb-6">
                <Title level={4} className="khmer-heading mb-2 text-danger">លុបគណនី</Title>
                <Paragraph type="secondary" className="khmer-text">
                    នៅពេលដែលគណនីរបស់អ្នកត្រូវបានលុប រាល់ទិន្នន័យនិងព័ត៌មានទាំងអស់របស់វានឹងត្រូវលុបចេញជាអចិន្ត្រៃយ៍។ មុនពេលលុបគណនីរបស់អ្នក សូមទាញយកទិន្នន័យាមួយដែលអ្នកចង់រក្សាទុក។
                </Paragraph>
            </div>

            <Divider />

            <div className="text-center">
                <Button 
                    danger 
                    type="primary" 
                    icon={<DeleteOutlined />}
                    size="large"
                    onClick={confirmUserDeletion}
                    className="khmer-text"
                >
                    លុបគណនី
                </Button>
            </div>

            <Modal
                title={<span className="khmer-heading">តើអ្នកពិតជាចង់លុបគណនីរបស់អ្នកមែនទេ?</span>}
                open={confirmingUserDeletion}
                onCancel={closeModal}
                footer={null}
                centered
            >
                <Form onSubmitCapture={deleteUser} layout="vertical">
                    <Paragraph className="khmer-text mb-4">
                        នៅពេលដែលគណនីរបស់អ្នកត្រូវបានលុប រាល់ទិន្នន័យនិងព័ត៌មានទាំងអស់របស់វានឹងត្រូវលុបចេញជាអចិន្ត្រៃយ៍។ សូមបញ្ចូលពាក្យសម្ងាត់របស់អ្នកដើម្បីបញ្ជាក់ថាអ្នកចង់លុបគណនីរបស់អ្នកជាអចិន្ត្រៃយ៍។
                    </Paragraph>

                    <Form.Item
                        label={<span className="khmer-text">ពាក្យសម្ងាត់</span>}
                        validateStatus={errors.password ? 'error' : ''}
                        help={errors.password}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="បញ្ចូលពាក្យសម្ងាត់របស់អ្នក"
                            size="large"
                            className="khmer-text"
                        />
                    </Form.Item>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button onClick={closeModal} className="khmer-text">
                            បោះបង់
                        </Button>
                        <Button 
                            danger 
                            type="primary" 
                            htmlType="submit" 
                            loading={processing}
                            className="khmer-text"
                        >
                            លុបគណនី
                        </Button>
                    </div>
                </Form>
            </Modal>
        </Card>
    );
}
