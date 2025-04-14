"use client";
import { PackageInfo } from "@/interfaces/i-package";
import { PaymentData } from "@/interfaces/i-payment-data";
import { useLine } from "@/providers/line";
import { useState, useEffect } from "react";

type Props = {
  pack: Partial<PackageInfo>;
  onPaymentSuccess: (result: boolean) => void;
};

export default function PaymentModal({ pack, onPaymentSuccess }: Props) {
  const { profile } = useLine();
  const [omiseLoaded, setOmiseLoaded] = useState<boolean>(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.omise.co/omise.js";
    script.onload = () => setOmiseLoaded(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (omiseLoaded && window.Omise) {
      window.Omise.setPublickey(process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY);
    }
  }, [omiseLoaded]);

  const handlePayment = async (
    paymentMethod: "promptpay" | "mobile_banking" | "truemoney" = "promptpay"
  ) => {
    if (!omiseLoaded) {
      alert("กำลังเริ่มต้นระบบชำระเงิน กรุณารอสักครู่");
      return;
    }

    const paymentData: PaymentData = {
      method: paymentMethod,
      buyerId: profile?.userId!,
      pack,
      description: `เติม ${pack.creditAmount} point`,
    };

    await createPaymentMethodSource(paymentData);
  };

  const createPaymentMethodSource = async (
    paymentData: PaymentData,
    currency: "THB" | "USD" = "THB"
  ) => {
    switch (paymentData.method) {
      case "promptpay": {
        window.Omise.createSource(
          paymentData.method,
          {
            amount: paymentData.pack.priceNumber,
            currency,
          },
          async (statusCode: number, response: any) => {
            if (statusCode === 200) {
              try {
                console.log("response from create source: ", response);
                onPaymentSuccess(true);
              } catch (error) {
                console.log(error);
              }
            } else {
              alert(
                "เกิดข้อผิดพลาดในการสร้าง token เพื่อชำระเงิน" +
                  response.message
              );
            }
          }
        );
      }
      case "mobile_banking": {
        break;
      }
      case "truemoney": {
        break;
      }
      default: {
        break;
      }
    }
  };

  return (
    <dialog id="payment_modal" className="modal">
      <div className="modal-box">
        <button
          onClick={() => handlePayment("promptpay")}
          className="btn btn-primary"
        >
          Promptpay
        </button>
        <button
          onClick={() => handlePayment("mobile_banking")}
          className="btn btn-primary"
        >
          Mobile Banking
        </button>
        <button
          onClick={() => handlePayment("truemoney")}
          className="btn btn-primary"
        >
          Truemoney
        </button>
      </div>
    </dialog>
  );
}
