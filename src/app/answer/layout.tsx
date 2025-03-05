import MiniNav from "@/components/mini-nav";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="flex h-screen justify-center flex-col items-center">
      <nav className="h-1/6 flex w-full">
        <MiniNav />
      </nav>
      {children}
    </div>
  );
}
