"use client";
import { ChargeApiResponse } from "@/app/api/omise/credit-card/route";
import { PackageInfo } from "@/interfaces/i-package";
import { PaymentData } from "@/interfaces/i-payment-data";
import { useLine } from "@/providers/line";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { APP_CONFIG } from "@/app-config";

export const useCreditCard = () => {
  const router = useRouter();
  const { isLoggedIn } = useLine();
  const [isLoading, setLoading] = useState<boolean>(false);

  const createToken = async (
    omise: any,
    paymentData: PaymentData,
    cardData: {
      number: string;
      name: string;
      expiration_month: number;
      expiration_year: number;
      security_code: string;
    }
  ) => {
    setLoading(true);
    if (!isLoggedIn) {
      toast.error("คุณต้องทำการ login ก่อน", APP_CONFIG.toast);
      setLoading(false);
      return;
    }

    omise.createToken(
      "card",
      cardData,
      async (statusCode: number, response: any) => {
        if (statusCode === 200) {
          try {
            await creditCardCharge({
              token: response.id,
              buyerId: paymentData.buyerId,
              description: paymentData.description,
              pack: paymentData.pack as PackageInfo,
            });
            setLoading(false);
            return;
          } catch (error) {
            console.log(error);
            toast.error(
              "เกิดข้อผิดพลาดในการชำระเงิน: " + response.message,
              APP_CONFIG.toast
            );
            setLoading(false);
            return;
          }
        } else {
          toast.error(
            "เกิดข้อผิดพลาดในการชำระเงิน: " + response.message,
            APP_CONFIG.toast
          );
          setLoading(false);
          return;
        }
      }
    );
  };

  const path =
    process.env.NODE_ENV == "production"
      ? "https://mimi-ai.vercel.app/api/omise/credit-card"
      : "http://localhost:3000/api/omise/credit-card";

  const creditCardCharge = async ({
    token,
    buyerId,
    pack,
    description,
  }: {
    token: string;
    buyerId: string;
    pack: PackageInfo;
    description: string;
  }) => {
    const response = await axios.post(
      path,
      {
        token,
        buyerId,
        pack,
        description,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const data = response.data as ChargeApiResponse;
    if (data.success) {
      router.replace(
        `/payment/success?id=${data.charge?.id}&uid=${buyerId}&status=${data.charge?.status}&ptype=credit_card`
      );
    }
  };

  return {
    isLoading,
    createToken,
    creditCardCharge,
  };
};
