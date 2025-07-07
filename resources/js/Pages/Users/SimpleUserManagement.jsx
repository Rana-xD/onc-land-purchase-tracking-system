import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function SimpleUserManagement({ auth }) {
    return (
        <AdminLayout user={auth.user}>
            <Head title="Simple User Management" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold mb-4">Simple User Management</h1>
                            <p>This is a simplified user management page for testing.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
