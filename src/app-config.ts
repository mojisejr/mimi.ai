export const TOAST_CONFIG = {
  autoClose: 3000,
  position: "top-right",
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
} as const;

// สามารถเพิ่ม config อื่นๆ ได้ในอนาคต
export const APP_CONFIG = {
  toast: TOAST_CONFIG,
} as const;
