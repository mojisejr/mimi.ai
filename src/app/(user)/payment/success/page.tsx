"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";
import LoadingScreen from "@/components/ui/loading-screen";

export default function SuccessPage() {
  return (
    <div className="m-auto">
      <Suspense fallback={<LoadingScreen />}>
        <ResultCard />
      </Suspense>
    </div>
  );
}

function ResultCard() {
  const searchParams = useSearchParams();
  // const id = searchParams.get("uid");
  const status = searchParams.get("status");
  const type = searchParams.get("ptype");
  const { back } = useRouter();

  return (
    <div className="success-card flex flex-col gap-6 items-center max-w-xs">
      <div>
        <h1 className="font-bold text-xl">
          {status && status === "successful"
            ? "ชำระเงินสำเร็จ !"
            : "ชำระเงินไม่สำเร็จ !"}
        </h1>
        <h2 className="font-bold text-sm ">
          ชำระผ่าน: <span className="text-amber-600">{type}</span>
        </h2>
        {status && status === "successful" ? (
          <span className="text-sm font-thin">
            ตรวจสอบ credit ของคุณ และตรวจสอบประวัติการชำระเงินได้ที่เมนู
            ประวัติการชำระเงิน
          </span>
        ) : (
          <span>ชำระเงินไม่สำเร็จกรุณาติดต่อแม่หมอเพื่อตรวจสอบการชำระเงิน</span>
        )}
      </div>

      <div className="text-green-500">
        <FaCheckCircle size={120} />
      </div>
      <button onClick={back} className="btn btn-primary w-full">
        กลับ
      </button>
    </div>
  );
}
