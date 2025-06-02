"use client";
import { useLine } from "@/providers/line";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FaUser,
  FaQuestionCircle,
  FaHistory,
  FaCreditCard,
  FaMoneyBillWave,
  FaBook,
  FaSignOutAlt,
  FaExchangeAlt,
} from "react-icons/fa";

export default function MiniNavMenu() {
  const { logout, profile } = useLine();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path ? "menu-item-active" : "";
  };

  const handleClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-square m-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        เมนู
      </div>
      <ul
        tabIndex={0}
        className={`dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <li>
          <Link
            href="/profile"
            className={isActive("/profile")}
            onClick={handleClick}
          >
            <FaUser className="mr-2" /> โปรไฟล์
          </Link>
        </li>
        <li>
          <Link
            href="/questions"
            className={isActive("/questions")}
            onClick={handleClick}
          >
            <FaQuestionCircle className="mr-2" /> ดูดวง
          </Link>
        </li>
        <li>
          <Link
            href={`/history`}
            className={isActive("/history")}
            onClick={handleClick}
          >
            <FaHistory className="mr-2" /> ประวัติคำทำนาย
          </Link>
        </li>
        <li>
          <Link
            href="/payment"
            className={isActive("/payment")}
            onClick={handleClick}
          >
            <FaCreditCard className="mr-2" /> เติมเครดิด
          </Link>
        </li>
        <li>
          <Link
            href={`/payment/history?id=${profile?.userId}`}
            className={isActive("/payment/history")}
            onClick={handleClick}
          >
            <FaMoneyBillWave className="mr-2" /> ประวัติการชำระเงิน
          </Link>
        </li>
        <li>
          <Link
            href={`/swap`}
            className={isActive("/swap")}
            onClick={handleClick}
          >
            <FaExchangeAlt className="mr-2" /> แลกเปลี่ยน coins
          </Link>
        </li>
        <li>
          <a onClick={handleClick}>
            <FaBook className="mr-2" /> คู่มือการใช้งาน
          </a>
        </li>
        <li>
          <button
            onClick={() => {
              handleClick();
              logout();
            }}
          >
            <FaSignOutAlt className="mr-2" /> ออกจากระบบ
          </button>
        </li>
      </ul>
    </div>
  );
}
