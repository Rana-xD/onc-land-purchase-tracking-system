import React from 'react';
import { Head } from '@inertiajs/react';

export default function MinimalUserManagement({ auth }) {
    return (
        <>
            <Head title="Minimal User Management" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold mb-4">Minimal User Management</h1>
                            <p>This is a minimal user management page for testing.</p>
                            {auth?.user && (
                                <div className="mt-4">
                                    <p>Logged in as: {auth.user.name}</p>
                                    <p>Role: {auth.user.role}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
