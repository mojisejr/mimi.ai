"use client";
import { ChargeApiResponse } from "@/app/api/omise/promptpay/route";
import { PackageInfo } from "@/interfaces/i-package";
import { PaymentData } from "@/interfaces/i-payment-data";
import { useLine } from "@/providers/line";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const usePromptPay = () => {
  const router = useRouter();
  const { isLoggedIn } = useLine();
  const [isLoading, setLoading] = useState<boolean>(false);

  const createSource = async (
    omise: any,
    paymentData: PaymentData,
    currency: "THB" | "USD" = "THB"
  ) => {
    setLoading(true);
    if (!isLoggedIn) {
      alert("คุณต้องทำการ loggin ก่อน");
      setLoading(false);
      return;
    }
    omise.createSource(
      "promptpay",
      {
        amount: paymentData.pack.priceNumber,
        currency,
      },
      async (statusCode: number, response: any) => {
        if (statusCode === 200) {
          try {
            await promptPayCharge({
              sourceId: response.id,
              buyerId: paymentData.buyerId,
              description: paymentData.description,
              pack: paymentData.pack as PackageInfo,
            });
            setLoading(false);
            return;
          } catch (error) {
            console.log(error);
            alert("เกิดข้อผิดพลาดในการชำระเงิน: " + response.message);
            setLoading(false);
            return;
          }
        } else {
          alert("เกิดข้อผิดพลาดในการชำระเงิน: " + response.message);
          setLoading(false);
          return;
        }
      }
    );
  };

  const path =
    process.env.NODE_ENV == "production"
      ? "https://mimi-ai.vercel.app/api/omise/promptpay"
      : "http://localhost:3000/api/omise/promptpay";

  const promptPayCharge = async ({
    sourceId,
    buyerId,
    pack,
    description,
  }: {
    sourceId: string;
    buyerId: string;
    pack: PackageInfo;
    description: string;
  }) => {
    const response = await axios.post(
      path,
      {
        id: sourceId,
        buyerId,
        pack,
        description,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const data = response.data as ChargeApiResponse;
    console.log("charge data: ", data);
    if (data.success) {
      const qrImage = data.charge?.source?.scannable_code.image;
      const order_id = data.charge?.id;
      router.replace(
        `/payment/promptpay-qr-code?id=${order_id}&qr=${qrImage?.download_uri}&packId=${pack.id}`
      );
    }
  };

  return {
    isLoading,
    createSource,
    promptPayCharge,
  };
};
