import { toast, ToastOptions, TypeOptions } from 'react-toastify';

const notify = ({
  content,
  type,
  options,
}: {
  content: string;
  type?: TypeOptions;
  options?: ToastOptions;
}) => {
  toast(content, {
    ...(options || {}),
    type: type || 'default',
    position: 'top-right',
    autoClose: 3_000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  });
};

export default notify;
