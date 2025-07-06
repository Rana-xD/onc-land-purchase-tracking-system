// Theme index file - exports all theme-related components and utilities
import ThemeProvider from './ThemeProvider';
import antdTheme from './antd-theme';
import uiPatterns from './ui-patterns';

// Re-export individual UI pattern components and utilities for easier imports
export const {
  CenteredSpin,
  EmptyState,
  showErrorMessage,
  ErrorAlert,
  showSuccessMessage,
  showConfirmation,
  formItemLayout,
  formRules,
  BreadcrumbConfig,
  KhmerUITerms,
  DateTimeFormats,
  formatCurrency,
  formatPercentage,
} = uiPatterns;

// Export theme objects and components
export { ThemeProvider, antdTheme, uiPatterns };

// Default export for convenience
export default {
  ThemeProvider,
  antdTheme,
  uiPatterns,
};
