// Ant Design Theme Configuration
// Based on the UI Design System for Land Purchase Tracking System

const antdTheme = {
  token: {
    // Colors
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    colorText: 'rgba(0, 0, 0, 0.85)',
    colorTextSecondary: 'rgba(0, 0, 0, 0.45)',
    colorBorder: '#d9d9d9',
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f0f2f5',
    
    // Typography
    fontFamily: "'Koh Santepheap', sans-serif",
    fontSize: 14,
    fontSizeSM: 12,
    fontSizeLG: 16,
    fontSizeXL: 20,
    
    // Spacing
    sizeXS: 8,
    sizeSM: 12,
    sizeMD: 16,
    sizeLG: 24,
    sizeXL: 32,
    
    // Border Radius
    borderRadius: 4,
    
    // Component specific
    controlHeight: 32,
    controlHeightSM: 24,
    controlHeightLG: 40,
  },
  components: {
    Button: {
      paddingInline: 15,
      defaultBg: '#ffffff',
      defaultColor: 'rgba(0, 0, 0, 0.85)',
      defaultBorderColor: '#d9d9d9',
    },
    Card: {
      padding: 16,
      paddingLG: 24,
    },
    Modal: {
      padding: 24,
      titleFontSize: 16,
    },
    Table: {
      headerBg: '#fafafa',
      rowHoverBg: '#fafafa',
    },
    Form: {
      labelHeight: 28,
      itemMarginBottom: 16,
    },
    Layout: {
      headerHeight: 64,
      siderWidth: 256,
    },
    Menu: {
      itemHeight: 40,
      subMenuItemHeight: 38,
    },
  },
};

export default antdTheme;
