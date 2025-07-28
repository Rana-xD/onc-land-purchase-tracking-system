import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Row, Col, Tabs } from 'antd';

export default function Edit({
    mustVerifyEmail,
    status,
}) {
    const items = [
        {
            key: 'profile',
            label: <span className="khmer-text">ព័ត៌មានគណនី</span>,
            children: (
                <UpdateProfileInformationForm
                    mustVerifyEmail={mustVerifyEmail}
                    status={status}
                />
            ),
        },
        {
            key: 'password',
            label: <span className="khmer-text">ពាក្យសម្ងាត់</span>,
            children: <UpdatePasswordForm />,
        },
    ];

    return (
        <AdminLayout title="គណនី">
            <Head title="គណនី" />
            
            <Row justify="center">
                <Col xs={24} sm={24} md={20} lg={18} xl={16}>
                    <Tabs 
                        defaultActiveKey="profile" 
                        items={items}
                        size="large"
                        className="khmer-text"
                        tabBarStyle={{ marginBottom: 24 }}
                    />
                </Col>
            </Row>
        </AdminLayout>
    );
}
