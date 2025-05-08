"use client";
import { useLine } from "@/providers/line";
import Link from "next/link";

export default function MiniNavMenu() {
  const { logout, profile } = useLine();

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-square m-1">
        เมนู
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
      >
        <li>
          <Link href="/questions">ดูดวง</Link>
        </li>
        <li>
          <Link href={`/history`}>ประวัติคำทำนาย</Link>
        </li>
        <li>
          <Link href="/payment">เติมเครดิด</Link>
        </li>
        <li>
          <Link href={`/payment/history?id=${profile?.userId}`}>
            ประวัติการชำระเงิน
          </Link>
        </li>
        <li>
          <a>คู่มือการใช้งาน</a>
        </li>
        <li>
          <button onClick={logout}>ออกจากระบบ</button>
        </li>
      </ul>
    </div>
  );
}
