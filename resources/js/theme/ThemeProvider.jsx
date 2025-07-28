import React from 'react';
import { ConfigProvider, App, message } from 'antd';
import antdTheme from './antd-theme';

/**
 * ThemeProvider component that applies the global Ant Design theme configuration
 * to all child components based on the Land Purchase Tracking System design system.
 */
export default function ThemeProvider({ children }) {
  // Configure message component globally
  React.useEffect(() => {
    message.config({
      top: 100,
      duration: 3,
      maxCount: 3,
    });
  }, []);

  return (
    <ConfigProvider theme={antdTheme}>
      <App>
        {children}
      </App>
    </ConfigProvider>
  );
}
