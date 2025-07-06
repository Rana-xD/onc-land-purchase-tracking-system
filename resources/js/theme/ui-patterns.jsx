// UI Patterns and Common Components
// Based on the UI Design System for Land Purchase Tracking System
import React from 'react';
import { Spin, Empty, Alert, message, Modal, Form } from 'antd';
import { CheckCircleFilled, ExclamationCircleFilled } from '@ant-design/icons';

// 1. Loading States
export const CenteredSpin = ({ size = 'large', tip = 'កំពុងផ្ទុក...' }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 'var(--spacing-xl)',
    height: '100%' 
  }}>
    <Spin size={size} tip={tip} />
  </div>
);

// 2. Empty States
export const EmptyState = ({ 
  description = 'មិនមានទិន្នន័យ', 
  image = Empty.PRESENTED_IMAGE_DEFAULT,
  actionButton = null 
}) => (
  <Empty
    image={image}
    description={description}
    style={{ margin: 'var(--spacing-lg) 0' }}
  >
    {actionButton}
  </Empty>
);

// 3. Error Handling
export const showErrorMessage = (content, duration = 5) => {
  message.error({
    content,
    duration,
    style: { marginTop: 'var(--spacing-lg)' }
  });
};

export const ErrorAlert = ({ message, description, type = 'error', showIcon = true }) => (
  <Alert
    message={message}
    description={description}
    type={type}
    showIcon={showIcon}
    style={{ marginBottom: 'var(--spacing-md)' }}
  />
);

// 4. Success Feedback
export const showSuccessMessage = (content, duration = 2) => {
  message.success({
    content,
    duration,
    style: { marginTop: 'var(--spacing-lg)' }
  });
};

// 5. Confirmations
export const showConfirmation = ({
  title = 'តើអ្នកប្រាកដទេ?',
  content = 'សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយវិញបានទេ។',
  okText = 'យល់ព្រម',
  cancelText = 'បោះបង់',
  onOk,
  onCancel,
  okButtonProps = { danger: true }
}) => {
  Modal.confirm({
    title,
    content,
    okText,
    cancelText,
    icon: <ExclamationCircleFilled />,
    okButtonProps,
    onOk,
    onCancel,
    autoFocusButton: 'cancel',
    maskClosable: false,
  });
};

// 6. Form Validation
export const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

export const formRules = {
  required: (message = 'ត្រូវការបំពេញ') => ({
    required: true,
    message,
  }),
  email: {
    type: 'email',
    message: 'អ៊ីមែលមិនត្រឹមត្រូវ',
  },
  phone: {
    pattern: /^[0-9]{9,10}$/,
    message: 'លេខទូរស័ព្ទមិនត្រឹមត្រូវ',
  },
};

// 7. Navigation Patterns
export const BreadcrumbConfig = {
  separator: '/',
  style: { margin: '16px 0' },
};

// Common Khmer UI Terms
export const KhmerUITerms = {
  save: 'រក្សាទុក',
  cancel: 'បោះបង់',
  delete: 'លុប',
  edit: 'កែប្រែ',
  add: 'បន្ថែម',
  search: 'ស្វែងរក',
  filter: 'ត្រងចោល',
  export: 'នាំចេញ',
  print: 'បោះពុម្ព',
  close: 'បិទ',
};

// Date/Time Format
export const DateTimeFormats = {
  date: 'DD/MM/YYYY',
  time: 'HH:mm',
  dateTime: 'DD/MM/YYYY HH:mm',
};

// Number Format
export const formatCurrency = (value) => {
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatPercentage = (value) => {
  return `${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;
};

export default {
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
};
