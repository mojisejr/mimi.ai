import { toast, ToastOptions } from "react-toastify";
import { APP_CONFIG } from "@/app-config";

const defaultOptions: ToastOptions = {
  ...APP_CONFIG.toast,
  theme: "light",
};

export const toastService = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, { ...defaultOptions, ...options });
  },

  error: (message: string, options?: ToastOptions) => {
    toast.error(message, { ...defaultOptions, ...options });
  },

  warning: (message: string, options?: ToastOptions) => {
    toast.warning(message, { ...defaultOptions, ...options });
  },

  info: (message: string, options?: ToastOptions) => {
    toast.info(message, { ...defaultOptions, ...options });
  },

  dismiss: () => {
    toast.dismiss();
  },
};
