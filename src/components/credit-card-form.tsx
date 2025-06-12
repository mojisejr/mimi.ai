"use client";
import { useCreditCard } from "@/hooks/credit-card";
import { PackageInfo } from "@/interfaces/i-package";
import { useLine } from "@/providers/line";
import { useState } from "react";
import { PatternFormat } from "react-number-format";

type Props = {
  pack: PackageInfo;
  onClose: () => void;
};

type CardState = {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
};

export default function CreditCardForm({ pack, onClose }: Props) {
  const { profile } = useLine();
  const { createToken, isLoading } = useCreditCard();
  const [cardState, setCardState] = useState<CardState>({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardState({
      ...cardState,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (window.Omise) {
      const [expiryMonth, expiryYear] = cardState.expiry.split("/");
      await createToken(
        window.Omise,
        {
          pack,
          buyerId: profile?.userId!,
          method: "credit_card",
          description: JSON.stringify({
            userId: profile?.userId,
            name: profile?.displayName,
            description: `add credit: ${pack.creditAmount}`,
            time: new Date().getTime(),
            credit_amount: pack.creditAmount,
          }),
        },
        {
          number: cardState.number.replace(/\s/g, ""),
          name: cardState.name,
          expiration_month: parseInt(expiryMonth),
          expiration_year: parseInt(expiryYear),
          security_code: cardState.cvc,
        }
      );
    }
  };

  return (
    <div className="modal-box">
      <h2 className="text-2xl font-bold my-2">กรอกข้อมูลบัตรเครดิต/เดบิต</h2>
      <div className="flex flex-col gap-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">หมายเลขบัตร</span>
            </label>
            <PatternFormat
              name="number"
              className="input input-bordered w-full"
              format="#### #### #### ####"
              mask="_"
              value={cardState.number}
              onValueChange={(values) => {
                setCardState({
                  ...cardState,
                  number: values.formattedValue,
                });
              }}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">ชื่อบนบัตร</span>
            </label>
            <input
              type="text"
              name="name"
              className="input input-bordered w-full"
              value={cardState.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">วันหมดอายุ</span>
              </label>
              <PatternFormat
                name="expiry"
                className="input input-bordered w-full"
                format="##/##"
                mask="_"
                value={cardState.expiry}
                onValueChange={(values) => {
                  setCardState({
                    ...cardState,
                    expiry: values.formattedValue,
                  });
                }}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">CVV</span>
              </label>
              <PatternFormat
                name="cvc"
                className="input input-bordered w-full"
                format="###"
                mask="_"
                value={cardState.cvc}
                onValueChange={(values) => {
                  setCardState({
                    ...cardState,
                    cvc: values.formattedValue,
                  });
                }}
                required
              />
            </div>
          </div>
          <div className="modal-action">
            <button
              type="submit"
              className="btn text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-600 hover:via-purple-700 hover:to-purple-800"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex gap-2 justify-center">
                  <div className="loading-infinity loading-sm loading-primary"></div>
                  <span>กำลังประมวลผล...</span>
                </div>
              ) : (
                "ชำระเงิน"
              )}
            </button>
            <button type="button" className="btn" onClick={onClose}>
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
