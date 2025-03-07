"use client";
import MiniNav from "@/components/mini-nav";
import { useLine } from "@/providers/line";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  const { isLoggedIn } = useLine();

  if (!isLoggedIn) {
    return redirect("/");
  }

  return (
    <div className="flex h-screen justify-center flex-col items-center">
      <nav className="h-1/6 flex w-full">
        <MiniNav />
      </nav>
      {children}
    </div>
  );
}
