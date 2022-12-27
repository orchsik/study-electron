import { toast, ToastOptions } from 'react-toastify';

const notify = (content: string, options?: ToastOptions) => {
  toast(content, {
    ...(options || {}),
    type: 'default',
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

export { notify };
