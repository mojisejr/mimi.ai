"use client";
import { useLine } from "@/providers/line";
import { useLanguage } from "@/providers/language";
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
  FaGlobe,
} from "react-icons/fa";

export default function MiniNavMenu() {
  const { logout, profile } = useLine();
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path ? "menu-item-active" : "";
  };

  const handleClick = () => {
    setIsOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === "th" ? "en" : "th");
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-square m-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        {t("common.menu")}
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
            <FaUser className="mr-2" /> {t("common.profile")}
          </Link>
        </li>
        <li>
          <Link
            href="/questions"
            className={isActive("/questions")}
            onClick={handleClick}
          >
            <FaQuestionCircle className="mr-2" /> {t("common.fortune")}
          </Link>
        </li>
        <li>
          <Link
            href={`/history`}
            className={isActive("/history")}
            onClick={handleClick}
          >
            <FaHistory className="mr-2" /> {t("common.predictionHistory")}
          </Link>
        </li>
        <li>
          <Link
            href="/payment"
            className={isActive("/payment")}
            onClick={handleClick}
          >
            <FaCreditCard className="mr-2" /> {t("common.addCredit")}
          </Link>
        </li>
        <li>
          <Link
            href={`/payment/history?id=${profile?.userId}`}
            className={isActive("/payment/history")}
            onClick={handleClick}
          >
            <FaMoneyBillWave className="mr-2" /> {t("common.paymentHistory")}
          </Link>
        </li>
        <li>
          <Link
            href={`/swap`}
            className={isActive("/swap")}
            onClick={handleClick}
          >
            <FaExchangeAlt className="mr-2" /> {t("common.swapCoins")}
          </Link>
        </li>
        {/* <li>
          <a onClick={handleClick}>
            <FaBook className="mr-2" /> {t("common.userGuide")}
          </a>
        </li> */}
        <li>
          <button onClick={toggleLanguage}>
            <FaGlobe className="mr-2" /> {language === "th" ? "English" : "ไทย"}
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              handleClick();
              logout();
            }}
          >
            <FaSignOutAlt className="mr-2" /> {t("common.logout")}
          </button>
        </li>
      </ul>
    </div>
  );
}
