import React from "react";
// import Logo from "../logo";
import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="h-screen w-full flex justify-center items-center flex-col">
      {/* <Logo /> */}
      <figure className="w-56">
        <Image src="/logo-1.png" width={300} height={200} alt="logo" />
      </figure>
      <div className="flex items-center gap-2">
        <div className="loading loading-infinity"></div>
        <span>Loading..</span>
      </div>
    </div>
  );
}
