export {};

declare global {
  interface Window {
    Omise: any;
    payment_dialog: {
      showModal: () => void;
    };
  }
}
