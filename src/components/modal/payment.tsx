"use client";
import { usePromptPay } from "@/hooks/promptpay";
import { PackageInfo } from "@/interfaces/i-package";
import { useLine } from "@/providers/line";
import { loadScript } from "@/utils/script-loader";
import { useState, useEffect } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  pack: Partial<PackageInfo>;
};

export default function PaymentModal({ pack, onClose, isOpen }: Props) {
  const { profile, isLoggedIn } = useLine();
  const [omiseLoaded, setOmiseLoaded] = useState<boolean>(false);
  const [omise, setOmise] = useState<any>();
  const { createSource, isLoading } = usePromptPay();

  useEffect(() => {
    setOmiseLoaded(false);
    loadScript("https://cdn.omise.co/omise.js").then((e) => {
      setOmise(window.Omise);
      // omise.setPublicKey(process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY!);
      setOmiseLoaded(true);
    });
  }, [omiseLoaded]);

  useEffect(() => {
    if (omise != undefined) {
      omise.setPublicKey(process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY!);
    }
  }, [omise]);

  const handleStartPromptpayFlow = () => {
    createSource(omise, {
      pack,
      buyerId: profile?.userId!,
      method: "promptpay",
      description: JSON.stringify({
        userId: profile?.userId,
        name: profile?.displayName,
        description: `add credit: ${pack.creditAmount}`,
        time: new Date().getTime(),
        credit_amount: pack.creditAmount,
      }),
    });
  };

  return (
    <>
      {isOpen && isLoggedIn && (
        <dialog id="payment_dialog" className="modal modal-open">
          <div className="modal-box">
            <h2 className="text-2xl font-bold my-2">เลือกช่องทางการชำระเงิน</h2>
            <div className="w-full gap-2 grid grid-cols-1">
              <button
                onClick={handleStartPromptpayFlow}
                className="btn  text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800"
              >
                Promptpay
              </button>
              <button className="btn  text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800">
                True Money QR
              </button>
              <button className="btn  text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:via-green-700 hover:to-green-800">
                Mobile Banking
              </button>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={onClose}>
                ยกเลิก
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
