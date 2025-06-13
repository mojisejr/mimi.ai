"use client";
import { useLine } from "@/providers/line";
import MiniNavMenu from "./mini-nav-menu";
import Image from "next/image";

export default function MiniNav() {
  const { profile } = useLine();

  return (
    <div className="w-full flex justify-between pr-6 pl-6 items-center">
      <div className="flex justify-start gap-1 items-center">
        <div>
          {/* <h1 className="text-md font-bold">MiMiVibe.ai</h1> */}
          <figure className="max-w-20">
            <Image src="/logo-1.png" width={300} height={200} alt="logo" />
          </figure>
          <h3 className="text-xs">
            สวัสดีค่ะ ! 👋 คุณ
            {!profile?.displayName
              ? "กำลังเข้ามา.."
              : ` ${profile?.displayName}`}
          </h3>
        </div>
      </div>
      <MiniNavMenu />
    </div>
  );
}
