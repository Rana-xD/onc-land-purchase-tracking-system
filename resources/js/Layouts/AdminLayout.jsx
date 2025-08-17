import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Layout, 
    Menu, 
    Button, 
    Avatar, 
    Dropdown, 
    theme,
    ConfigProvider,
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
    LogoutOutlined,
    FileTextOutlined,
    FileProtectOutlined,
    BankOutlined,
    DollarOutlined,
    PercentageOutlined,
    HistoryOutlined,
    AuditOutlined,
    SearchOutlined,
    QuestionCircleOutlined,
    // New unique icons for better menu differentiation
    ShoppingOutlined,
    ShopOutlined,
    HomeOutlined,
    DatabaseOutlined,
    FileDoneOutlined,
    ContainerOutlined,
    BarChartOutlined,
    LineChartOutlined,
    PieChartOutlined,
    WalletOutlined,
    MoneyCollectOutlined,
    CreditCardOutlined,
    GiftOutlined,
    InboxOutlined
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

const AdminLayout = ({ children, title }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [openKeys, setOpenKeys] = useState(['create-docs']);
    const { defaultAlgorithm, darkAlgorithm } = theme;
    const { user } = usePage().props.auth;
    const { url } = usePage();
    
    // Check if user is admin
    const isAdmin = user?.roles?.some(role => role.name === 'Administrator' || role.name === 'admin');
    
    const items = [
        getItem(
            <Link href={route('dashboard')}>ផ្ទាំងគ្រប់គ្រង</Link>, 
            'dashboard', 
            <DashboardOutlined />
        ),
    getItem('ទិន្នន័យបញ្ចូល', 'data-entry', <DatabaseOutlined />, [
        getItem(
            <Link href={route('data-entry.buyers.index')}>ព័ត៌មានអ្នកទិញ</Link>,
            'buyer-info',
            <ShoppingOutlined />
        ),
        getItem(
            <Link href={route('data-entry.sellers.index')}>ព័ត៌មានអ្នកលក់</Link>,
            'seller-info',
            <ShopOutlined />
        ),
        getItem(
            <Link href={route('data-entry.lands.index')}>ព័ត៌មានដី</Link>,
            'land-info',
            <HomeOutlined />
        ),
    ]),
    getItem('បង្កើតកិច្ចសន្យា', 'create-docs', <FileDoneOutlined />, [
        getItem(
            <Link href={route('deposit-contracts.index')}>លិខិតកក់ប្រាក់</Link>,
            'deposit-contracts',
            <FileProtectOutlined />
        ),
        getItem(
            <Link href={route('sale-contracts.index')}>លិខិតទិញ លក់</Link>,
            'sale-contracts',
            <ContainerOutlined />
        ),
    ]),
    getItem('របាយការណ៍', 'reports', <BarChartOutlined />, [
        getItem(
            <Link href={route('reports.document')}>របាយការណ៍កិច្ចសន្យា</Link>,
            'document-report',
            <FileTextOutlined />
        ),
        getItem(
            <Link href={route('reports.monthly')}>របាយការណ៍ប្រចាំខែ</Link>,
            'monthly-report',
            <LineChartOutlined />
        ),
        getItem(
            <Link href={route('reports.yearly')}>របាយការណ៍ប្រចាំឆ្នាំ</Link>,
            'yearly-report',
            <PieChartOutlined />
        ),
        getItem(
            <Link href={route('reports.payment-status')}>របាយការណ៍ចំនួនទឹកប្រាក់ទូទាត់ហើយនិងមិនទាន់ទូទាត់</Link>,
            'payment-status-report',
            <WalletOutlined />
        ),
    ]),
    getItem('គ្រប់គ្រងកម៉ីសិន', 'commission', <GiftOutlined />, [
        getItem(
            <Link href={route('commissions.pre-purchase')}>មុនទិញ</Link>,
            'pre-purchase-commission',
            <MoneyCollectOutlined />
        ),
        getItem(
            <Link href={route('commissions.post-purchase')}>ក្រោយទិញ</Link>,
            'post-purchase-commission',
            <CreditCardOutlined />
        ),
    ]),
        getItem('គ្រប់គ្រងអ្នកប្រើប្រាស់', 'user-management', <TeamOutlined />, [
            getItem(
                <Link href={route('users.management')}>អ្នកប្រើប្រាស់</Link>,
                'users',
                <UserOutlined />
            ),
            getItem(
                <Link href={route('roles.index')}>តួនាទី និង សិទ្ធិ</Link>,
                'roles-permissions',
                <SettingOutlined />
            ),
        ]),
        // Archive menu item - only visible to administrators
        
        getItem(
                <Link href={route('archive.index')}>ទិន្នន័យបានលុប</Link>,
                'archive',
                <InboxOutlined />
            )
    ];

    
    // Determine which menu item should be selected based on the current URL
    const getSelectedKeys = () => {
        if (url.startsWith('/dashboard')) return ['dashboard'];
        if (url.startsWith('/archive')) return ['archive'];
        if (url.startsWith('/user-management')) return ['users'];
        if (url.startsWith('/roles')) return ['roles-permissions'];
        if (url.startsWith('/data-entry/buyers')) return ['buyer-info'];
        if (url.startsWith('/data-entry/sellers')) return ['seller-info'];
        if (url.startsWith('/data-entry/lands')) return ['land-info'];
        if (url.startsWith('/data-entry')) return ['data-entry'];
        
        // Handle document routes with new URL structure
        if (url.startsWith('/deposit-contracts')) return ['deposit-contracts'];
        if (url.startsWith('/sale-contracts')) return ['sale-contracts'];
        
        // Handle report routes
        if (url.startsWith('/reports/document')) return ['document-report'];
        if (url.startsWith('/reports/monthly')) return ['monthly-report'];
        if (url.startsWith('/reports/yearly')) return ['yearly-report'];
        if (url.startsWith('/reports/payment-status')) return ['payment-status-report'];
        
        // Handle commission routes
        if (url.startsWith('/commissions/pre-purchase')) return ['pre-purchase-commission'];
        if (url.startsWith('/commissions/post-purchase')) return ['post-purchase-commission'];
        if (url.startsWith('/commissions')) return ['commission'];
        
        return ['dashboard'];
    };
    
    // Determine which parent menu should be open based on the selected keys
    const getOpenKeys = () => {
        const selectedKeys = getSelectedKeys();
        if (selectedKeys.includes('deposit-contracts') || selectedKeys.includes('sale-contracts')) {
            return ['create-docs'];
        }
        if (selectedKeys.includes('buyer-info') || selectedKeys.includes('seller-info') || selectedKeys.includes('land-info')) {
            return ['data-entry'];
        }
        if (selectedKeys.includes('document-report') || selectedKeys.includes('monthly-report') || 
            selectedKeys.includes('yearly-report') || selectedKeys.includes('payment-status-report')) {
            return ['reports'];
        }
        if (selectedKeys.includes('pre-purchase-commission') || selectedKeys.includes('post-purchase-commission')) {
            return ['commission'];
        }
        if (selectedKeys.includes('users') || selectedKeys.includes('roles-permissions')) {
            return ['user-management'];
        }
        return [];
    };
    
    // Update open keys when URL changes
    useEffect(() => {
        setOpenKeys(getOpenKeys());
    }, [url]);

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
                    width={260}
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
                        selectedKeys={getSelectedKeys()}
                        openKeys={openKeys}
                        onOpenChange={setOpenKeys}
                        items={items}
                        className="khmer-text"
                        style={{ fontSize: '16px' }}
                    />
                </Sider>
                <Layout style={{ marginLeft: collapsed ? 80 : 260, transition: 'all 0.2s' }}>
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
};

export default AdminLayout;
