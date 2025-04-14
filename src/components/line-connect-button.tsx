"use client";
import { useLine } from "@/providers/line";
import { FaLine } from "react-icons/fa";

export default function LineConnectButton() {
  const { login } = useLine();
  return (
    <button
      onClick={login}
      className="bg-[#06C755] text-white font-bold text-xl px-2 py-3 flex gap-2 items-center rounded-md shadow-xl"
    >
      <FaLine className="text-white" size={28} />
      <span className="text-sm">Login With Line</span>
    </button>
  );
}
