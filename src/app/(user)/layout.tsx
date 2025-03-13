"use client";
import MiniNav from "@/components/mini-nav";
import { AudioInputProvider } from "@/providers/audio-input";
import { useLine } from "@/providers/line";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  const { replace } = useRouter();
  const { isLoggedIn } = useLine();

  useEffect(() => {
    if (!isLoggedIn) {
      replace("/");
    }
  }, [isLoggedIn]);

  return (
    <div className="flex h-screen justify-center flex-col items-center">
      <nav className="h-1/6 flex w-full">
        <MiniNav />
      </nav>
      <AudioInputProvider>{children}</AudioInputProvider>
    </div>
  );
}
