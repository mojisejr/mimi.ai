"use client";
import { useCreditCard } from "@/hooks/credit-card";
import { PackageInfo } from "@/interfaces/i-package";
import { useLine } from "@/providers/line";
import { useState } from "react";

type Props = {
  pack: PackageInfo;
  onClose: () => void;
};

export default function CreditCardForm({ pack, onClose }: Props) {
  const { profile } = useLine();
  const { createToken, isLoading } = useCreditCard();
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiration_month: 0,
    expiration_year: 0,
    security_code: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (window.Omise) {
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
        cardData
      );
    }
  };

  return (
    <div className="modal-box">
      <h2 className="text-2xl font-bold my-2">กรอกข้อมูลบัตรเครดิต/เดบิต</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">หมายเลขบัตร</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            value={cardData.number}
            onChange={(e) =>
              setCardData({ ...cardData, number: e.target.value })
            }
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">ชื่อบนบัตร</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            value={cardData.name}
            onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">เดือนหมดอายุ</span>
            </label>
            <input
              type="number"
              className="input input-bordered"
              value={cardData.expiration_month}
              onChange={(e) =>
                setCardData({
                  ...cardData,
                  expiration_month: parseInt(e.target.value),
                })
              }
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">ปีหมดอายุ</span>
            </label>
            <input
              type="number"
              className="input input-bordered"
              value={cardData.expiration_year}
              onChange={(e) =>
                setCardData({
                  ...cardData,
                  expiration_year: parseInt(e.target.value),
                })
              }
              required
            />
          </div>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">CVV</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            value={cardData.security_code}
            onChange={(e) =>
              setCardData({ ...cardData, security_code: e.target.value })
            }
            required
          />
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
  );
}
