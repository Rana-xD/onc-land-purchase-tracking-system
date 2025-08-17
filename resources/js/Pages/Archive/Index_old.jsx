import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Table, Button, Tabs, Card, Statistic, Row, Col, 
    message, Spin, Tag, Space, Input, Typography, Popconfirm,
    Breadcrumb, Tooltip
} from 'antd';
import { 
    RollbackOutlined, SearchOutlined,
    UserOutlined, FileTextOutlined, DollarOutlined,
    TeamOutlined, AppstoreOutlined, HomeOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const { Search } = Input;

export default function Archive({ auth, statistics, archived }) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(archived || {});
    const [searchText, setSearchText] = useState('');
    const [activeTab, setActiveTab] = useState('1');

    const handleRestore = async (type, id) => {
        try {
            setLoading(true);
            await axios.post('/archive/restore', { type, id });
            message.success('ទិន្នន័យត្រូវបានស្តារដោយជោគជ័យ');
            
            // Refresh data
            const response = await axios.get('/archive/type/' + type);
            setData(prev => ({
                ...prev,
                [type]: response.data
            }));
        } catch (error) {
            console.error('Error restoring:', error);
            message.error('មានបញ្ហាក្នុងការស្តារទិន្នន័យ');
        } finally {
            setLoading(false);
        }
    };

    const getDataForTab = (tabKey) => {
        if (tabKey === 'all') {
            return Object.entries(data).flatMap(([type, items]) => 
                items.map(item => ({ ...item, type }))
            );
        }

        switch (tabKey) {
            case 'data_entry':
                return [
                    ...(data.buyers || []).map(item => ({ ...item, type: 'buyers', typeName: 'អ្នកទិញ' })),
                    ...(data.sellers || []).map(item => ({ ...item, type: 'sellers', typeName: 'អ្នកលក់' })),
                    ...(data.lands || []).map(item => ({ ...item, type: 'lands', typeName: 'ដី' }))
                ];
            case 'contracts':
                return [
                    ...(data.document_creations || []).map(item => ({ ...item, type: 'document_creations', typeName: 'ឯកសារបង្កើត' })),
                    ...(data.sale_contracts || []).map(item => ({ ...item, type: 'sale_contracts', typeName: 'កិច្ចសន្យាលក់' }))
                ];
            case 'commissions':
                return (data.commissions || []).map(item => ({ ...item, type: 'commissions', typeName: 'កម៉ីសិន' }));
            case 'users':
                return [
                    ...(data.users || []).map(item => ({ ...item, type: 'users', typeName: 'អ្នកប្រើប្រាស់' })),
                    ...(data.roles || []).map(item => ({ ...item, type: 'roles', typeName: 'តួនាទី' }))
                ];
            default:
                return [];
        }
    };

    const formatDate = (date) => {
        if (!date) return 'គ្មាន';
        return new Date(date).toLocaleDateString('km-KH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getItemDisplayName = (item) => {
        // For different types, return appropriate display name
        if (item.name) return item.name;
        if (item.title) return item.title;
        if (item.land_title_number) return `ដីលេខ: ${item.land_title_number}`;
        if (item.contract_number) return `កិច្ចសន្យាលេខ: ${item.contract_number}`;
        if (item.commission_type) return `កម៉ីសិន ${item.commission_type}`;
        return `#${item.id}`;
    };

    const filteredData = (tabData) => {
        if (!searchText) return tabData;
        return tabData.filter(item => {
            const displayName = getItemDisplayName(item).toLowerCase();
            return displayName.includes(searchText.toLowerCase());
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="ទិន្នន័យ" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <ArchiveBoxIcon className="h-8 w-8 text-gray-600 mr-3" />
                                <h1 className="text-2xl font-semibold text-gray-900">ទិន្នន័យ</h1>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="ស្វែងរក..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-blue-600">ទិន្នន័យបញ្ចូល</p>
                                        <p className="text-2xl font-bold text-blue-900">
                                            {(statistics.data_entry?.buyers || 0) + 
                                             (statistics.data_entry?.sellers || 0) + 
                                             (statistics.data_entry?.lands || 0)}
                                        </p>
                                    </div>
                                    <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                                </div>
                            </div>

                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-green-600">កិច្ចសន្យា</p>
                                        <p className="text-2xl font-bold text-green-900">
                                            {(statistics.contracts?.document_creations || 0) + 
                                             (statistics.contracts?.sale_contracts || 0)}
                                        </p>
                                    </div>
                                    <DocumentTextIcon className="h-8 w-8 text-green-500" />
                                </div>
                            </div>

                            <div className="bg-yellow-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-yellow-600">កម៉ីសិន</p>
                                        <p className="text-2xl font-bold text-yellow-900">
                                            {statistics.commissions?.total || 0}
                                        </p>
                                    </div>
                                    <CurrencyDollarIcon className="h-8 w-8 text-yellow-500" />
                                </div>
                            </div>

                            <div className="bg-purple-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-purple-600">អ្នកប្រើប្រាស់</p>
                                        <p className="text-2xl font-bold text-purple-900">
                                            {(statistics.users?.users || 0) + 
                                             (statistics.users?.roles || 0)}
                                        </p>
                                    </div>
                                    <UserGroupIcon className="h-8 w-8 text-purple-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabbed Content */}
                    <div className="bg-white rounded-lg shadow-sm">
                        <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
                            <Tab.List className="flex space-x-1 rounded-t-lg bg-gray-100 p-1">
                                {tabs.map((tab) => (
                                    <Tab
                                        key={tab.key}
                                        className={({ selected }) =>
                                            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors
                                            ${selected 
                                                ? 'bg-white text-blue-700 shadow' 
                                                : 'text-gray-700 hover:bg-white/[0.12] hover:text-gray-900'
                                            }`
                                        }
                                    >
                                        <div className="flex items-center justify-center">
                                            <tab.icon className="h-5 w-5 mr-2" />
                                            {tab.name}
                                        </div>
                                    </Tab>
                                ))}
                            </Tab.List>

                            <Tab.Panels className="p-6">
                                {tabs.map((tab) => (
                                    <Tab.Panel key={tab.key}>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            ប្រភេទ
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            ឈ្មោះ/លេខសម្គាល់
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            កាលបរិច្ឆេទលុប
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            លុបដោយ
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            សកម្មភាព
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {filteredData(getDataForTab(tab.key)).map((item) => (
                                                        <tr key={`${item.type}-${item.id}`}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {item.typeName || item.type}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {getItemDisplayName(item)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatDate(item.deleted_at)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {item.deleted_by?.name || 'មិនស្គាល់'}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                <button
                                                                    onClick={() => handleRestore(item.type, item.id)}
                                                                    disabled={loading}
                                                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                                                >
                                                                    <ArrowPathIcon className="h-4 w-4 mr-1" />
                                                                    ស្ដារឡើងវិញ
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {filteredData(getDataForTab(tab.key)).length === 0 && (
                                                        <tr>
                                                            <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                                                មិនមានទិន្នន័យក្នុងទិន្នន័យ
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </Tab.Panel>
                                ))}
                            </Tab.Panels>
                        </Tab.Group>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
