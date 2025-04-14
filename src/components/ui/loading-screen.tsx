import React from "react";
import Logo from "../logo";

export default function LoadingScreen() {
  return (
    <div className="h-screen w-full flex justify-center items-center flex-col">
      <Logo />
      <span>mimi.ai</span>
    </div>
  );
}
