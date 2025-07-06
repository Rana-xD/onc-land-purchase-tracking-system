import React from 'react';
import { ConfigProvider } from 'antd';
import antdTheme from './antd-theme';

/**
 * ThemeProvider component that applies the global Ant Design theme configuration
 * to all child components based on the Land Purchase Tracking System design system.
 */
export default function ThemeProvider({ children }) {
  return (
    <ConfigProvider theme={antdTheme}>
      {children}
    </ConfigProvider>
  );
}
