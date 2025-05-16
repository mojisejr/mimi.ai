import { getPaymentHistory } from "@/services/torso";
import React from "react";
import dayjs from "dayjs";

type searchParams = Promise<{ id: string }>;

export default async function PaymentHistoryPage({
  searchParams,
}: {
  searchParams: searchParams;
}) {
  const { id } = await searchParams;
  const result = await getPaymentHistory(id as string);

  return (
    <div className="h-5/6 w-full px-4">
      <h1 className="font-semibold text-primary">ประวัติการชำระเงิน</h1>
      <table className="table table-xs max-h-screen overflow-y-scroll">
        <thead>
          <tr>
            <th>วันที่ชำระ</th>
            <th>แพ็คเกจ</th>
            <td>credit</td>
          </tr>
        </thead>
        <tbody>
          {result.map((r, index) => (
            <tr key={index}>
              <td>
                {dayjs((r.created_at as number) * 1000).format(
                  "DD/MM/YYYY-HH:mm:ss"
                )}
              </td>
              <td>{r.title as string}</td>
              <td>{r.credit_amount as number}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
