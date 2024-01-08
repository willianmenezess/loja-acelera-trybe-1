import { toast } from 'react-toastify';

export function showMessage(message) {
  toast(message, {
    position: 'top-center',
    autoClose: false,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark',
  });
}
