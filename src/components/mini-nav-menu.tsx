"use client";
import { useLine } from "@/providers/line";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaUser,
  FaQuestionCircle,
  FaHistory,
  FaCreditCard,
  FaMoneyBillWave,
  FaBook,
  FaSignOutAlt,
} from "react-icons/fa";

export default function MiniNavMenu() {
  const { logout, profile } = useLine();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? "menu-item-active" : "";
  };

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
          <Link href="/profile" className={isActive("/profile")}>
            <FaUser className="mr-2" /> โปรไฟล์
          </Link>
        </li>
        <li>
          <Link href="/questions" className={isActive("/questions")}>
            <FaQuestionCircle className="mr-2" /> ดูดวง
          </Link>
        </li>
        <li>
          <Link href={`/history`} className={isActive("/history")}>
            <FaHistory className="mr-2" /> ประวัติคำทำนาย
          </Link>
        </li>
        <li>
          <Link href="/payment" className={isActive("/payment")}>
            <FaCreditCard className="mr-2" /> เติมเครดิด
          </Link>
        </li>
        <li>
          <Link
            href={`/payment/history?id=${profile?.userId}`}
            className={isActive("/payment/history")}
          >
            <FaMoneyBillWave className="mr-2" /> ประวัติการชำระเงิน
          </Link>
        </li>
        <li>
          <a>
            <FaBook className="mr-2" /> คู่มือการใช้งาน
          </a>
        </li>
        <li>
          <button onClick={logout}>
            <FaSignOutAlt className="mr-2" /> ออกจากระบบ
          </button>
        </li>
      </ul>
    </div>
  );
}
