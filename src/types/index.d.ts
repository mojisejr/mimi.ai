import Omise from "./omise/omise";

declare global {
  interface Window {
    Omise: any;
    payment_dialog: {
      showModal: () => void;
    };
  }
}
