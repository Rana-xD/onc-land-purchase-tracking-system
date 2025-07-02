import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Layout, 
    Menu, 
    Button, 
    Avatar, 
    Dropdown, 
    theme,
    ConfigProvider,
    Badge,
    Space,
    Divider
} from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
    SettingOutlined,
    BellOutlined,
    LogoutOutlined,
    FileTextOutlined,
    BankOutlined,
    DollarOutlined,
    PercentageOutlined,
    HistoryOutlined,
    AuditOutlined,
    SearchOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons';
import khKH from 'antd/locale/km_KH';

const { Header, Sider, Content } = Layout;

function getItem(
    label,
    key,
    icon,
    children,
) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const items = [
    getItem('ផ្ទាំងគ្រប់គ្រង', 'dashboard', <DashboardOutlined />),
    getItem('គ្រប់គ្រងដី', 'land', <BankOutlined />, [
        getItem('កំណត់ត្រាដី', 'land-records', <FileOutlined />),
        getItem('ផ្ទុកឯកសារ', 'document-upload', <FileTextOutlined />),
        getItem('ស្ថានភាពដី', 'land-status', <FileTextOutlined />),
    ]),
    getItem('គ្រប់គ្រងការទូទាត់', 'payment', <DollarOutlined />, [
        getItem('គម្រោងទូទាត់', 'payment-plans', <FileOutlined />),
        getItem('តាមដានការទូទាត់', 'payment-tracking', <FileOutlined />),
        getItem('របាយការណ៍ទូទាត់', 'payment-reports', <FileOutlined />),
    ]),
    getItem('គ្រប់គ្រងកូម៉ីសិន', 'commission', <PercentageOutlined />),
    getItem('គ្រប់គ្រងឯកសារ', 'documents', <FileTextOutlined />),
    getItem('របាយការណ៍ និង វិភាគ', 'reports', <FileOutlined />),
    getItem('កំណត់ត្រាសកម្មភាព', 'activities', <AuditOutlined />, [
        getItem('សកម្មភាពរបស់ខ្ញុំ', 'my-activities', <HistoryOutlined />),
        getItem('សកម្មភាពទាំងអស់', 'all-activities', <AuditOutlined />),
    ]),
    getItem('ការជូនដំណឹង', 'notifications', <BellOutlined />),
    getItem('ការកំណត់ប្រព័ន្ធ', 'settings', <SettingOutlined />),
];

export default function AdminLayout({ children, title }) {
    const [collapsed, setCollapsed] = useState(false);
    const { defaultAlgorithm, darkAlgorithm } = theme;
    const { user } = usePage().props.auth;

    const userMenuItems = [
        {
            key: '1',
            label: <span className="khmer-text">{user?.name}</span>,
            icon: <UserOutlined />,
            disabled: true,
        },
        {
            type: 'divider',
        },
        {
            key: '2',
            label: <Link href={route('profile.edit')} className="khmer-text">គណនី</Link>,
            icon: <UserOutlined />,
        },
        {
            key: '3',
            label: <Link href={route('activities.my')} className="khmer-text">សកម្មភាពរបស់ខ្ញុំ</Link>,
            icon: <HistoryOutlined />,
        },
        {
            key: '4',
            label: (
                <Link href={route('logout')} method="post" as="button" className="khmer-text w-full text-left">
                    ចាកចេញ
                </Link>
            ),
            icon: <LogoutOutlined />,
        },
    ];

    return (
        <ConfigProvider
            locale={khKH}
            theme={{
                algorithm: defaultAlgorithm,
                token: {
                    colorPrimary: '#1890ff',
                },
            }}
        >
            <Layout style={{ minHeight: '100vh' }}>
                <Sider 
                    trigger={null} 
                    collapsible 
                    collapsed={collapsed}
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        bottom: 0,
                    }}
                >
                    <div className="demo-logo-vertical p-4 text-center">
                        <h2 className="khmer-heading text-white text-lg m-0">
                            {collapsed ? 'LPTS' : 'ប្រព័ន្ធតាមដានដី'}
                        </h2>
                    </div>
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={['dashboard']}
                        className="khmer-text"
                        style={{ fontSize: '16px' }}
                        onClick={({ key }) => {
                            if (key === 'dashboard') {
                                window.location.href = route('dashboard');
                            } else if (key === 'my-activities') {
                                window.location.href = route('activities.my');
                            } else if (key === 'all-activities') {
                                window.location.href = route('activities.index');
                            }
                        }}
                    >
                        {items.map(item => {
                            if (item.children) {
                                return (
                                    <Menu.SubMenu 
                                        key={item.key} 
                                        icon={<span style={{ fontSize: '18px' }}>{item.icon}</span>} 
                                        title={item.label}
                                    >
                                        {item.children.map(child => (
                                            <Menu.Item 
                                                key={child.key} 
                                                icon={<span style={{ fontSize: '18px' }}>{child.icon}</span>}
                                            >
                                                {child.label}
                                            </Menu.Item>
                                        ))}
                                    </Menu.SubMenu>
                                );
                            }
                            return (
                                <Menu.Item 
                                    key={item.key} 
                                    icon={<span style={{ fontSize: '18px' }}>{item.icon}</span>}
                                >
                                    {item.label}
                                </Menu.Item>
                            );
                        })}
                    </Menu>
                </Sider>
                <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
                    <Header 
                        style={{ 
                            padding: '0 16px', 
                            background: '#fff', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
                            height: '64px',
                            position: 'sticky',
                            top: 0,
                            zIndex: 1000
                        }}
                    >
                        <div className="flex items-center">
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{ fontSize: '18px', width: 48, height: 48 }}
                            />
                            <div className="ml-4 khmer-heading hidden md:block">
                                <span style={{ fontSize: '18px', fontWeight: 500 }}>{title || 'ប្រព័ន្ធតាមដានដី'}</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <Space size="large">

                                
                                <Dropdown 
                                    menu={{ 
                                        items: [
                                            {
                                                key: 'notifications',
                                                label: <span className="khmer-text">ការជូនដំណឹងទាំងអស់</span>,
                                                icon: <BellOutlined />
                                            },
                                            {
                                                type: 'divider'
                                            },
                                            {
                                                key: 'mark-all-read',
                                                label: <span className="khmer-text">គូសចំណាំថាបានអានទាំងអស់</span>
                                            }
                                        ] 
                                    }} 
                                    placement="bottomRight"
                                    arrow
                                >
                                    <Badge count={5} size="small">
                                        <Button 
                                            type="text" 
                                            icon={<BellOutlined style={{ fontSize: '18px' }} />} 
                                            style={{ height: 40, width: 40 }}
                                        />
                                    </Badge>
                                </Dropdown>
                                

                                
                                <Divider type="vertical" style={{ height: 24, margin: '0 8px' }} />
                                
                                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                                    <div className="cursor-pointer flex items-center">
                                        <Avatar 
                                            icon={<UserOutlined />} 
                                            style={{ backgroundColor: '#1890ff' }} 
                                            size="large" 
                                        />
                                        <span className="khmer-text ml-2 hidden md:inline">{user?.name}</span>
                                    </div>
                                </Dropdown>
                            </Space>
                        </div>
                    </Header>
                    <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
                        {title && <h1 className="khmer-heading text-2xl mb-6">{title}</h1>}
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
}
