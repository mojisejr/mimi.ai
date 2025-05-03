"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DOMPurify from "dompurify";
import { useLine } from "@/providers/line";
import LoadingScreen from "@/components/ui/loading-screen";

export default function PromptPayQRPage() {
  return (
    <div className="m-auto">
      <Suspense fallback={<LoadingScreen />}>
        <PromptPayQRDisplay />
      </Suspense>
    </div>
  );
}

function PromptPayQRDisplay() {
  const { profile } = useLine();
  const router = useRouter();
  const searchParam = useSearchParams();
  const qr = searchParam.get("qr");
  const order_id = searchParam.get("id");
  const pack_id = searchParam.get("packId");
  const [message, setMessage] = useState<string | null>(
    "แสกน qr code เพื่อชำระเงิน"
  );
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (success) {
      void router.replace(
        `/payment/success?=id${order_id}&uid=${profile?.userId}&status=successful&ptype="promptpay"`
      );
    }
  }, [success]);
  console.log({ order_id });

  useEffect(() => {
    checkPaymentStatus();
    const intervalId = setInterval(checkPaymentStatus, 3000);
    return () => clearInterval(intervalId);
  }, [order_id, router]);

  if (!qr) {
    return (
      <div className="m-auto">
        <div className="loading loading-lg loading-spinner"></div>
      </div>
    );
  }

  const checkPaymentStatus = async () => {
    try {
      const response = await fetch(
        `/api/omise/promptpay-charge-return?id=${order_id}&packId=${pack_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("webhook-response: ", data.status);

      if (data.status === "successful") {
        setSuccess(true);
        return;
      } else if (data.status === "pending") {
        setMessage("กำลังตรวจสอบการชำระเงิน กรุณารอสักครู่...");
        return;
      } else {
        setMessage("ชำระเงินไม่สำเร็จกรุณาลองใหม่อีกครั้ง");
        return;
      }
    } catch (error) {
      setMessage("ชำระเงินไม่สำเร็จกรุณาลองใหม่อีกครั้ง");
      return;
    }
  };

  const safe_qr = DOMPurify.sanitize(qr);

  return (
    <>
      {qr ? (
        <div className="flex flex-col justify-center items-center w-full h-full gap-4">
          <img src={safe_qr} alt="QR Code" className="w-[320px] h-[320px]" />
          <p className="p-2 bg-red-400 w-full">
            <span className="text-white">{message}</span>
          </p>
        </div>
      ) : null}
    </>
  );
}
