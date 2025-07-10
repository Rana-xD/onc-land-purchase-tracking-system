import { message } from 'antd';

// Create a custom message utility that can be used throughout the application
const messageUtil = {
  success: (content, duration = 3, onClose) => {
    message.success({
      content,
      duration,
      onClose,
    });
  },
  error: (content, duration = 3, onClose) => {
    message.error({
      content,
      duration,
      onClose,
    });
  },
  info: (content, duration = 3, onClose) => {
    message.info({
      content,
      duration,
      onClose,
    });
  },
  warning: (content, duration = 3, onClose) => {
    message.warning({
      content,
      duration,
      onClose,
    });
  },
  loading: (content, duration = 0, onClose) => {
    return message.loading({
      content,
      duration,
      onClose,
    });
  },
};

export default messageUtil;
