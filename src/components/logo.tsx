import React from "react";

export default function Logo() {
  return (
    <div className="relative h-[200px] w-[200px]">
      <div className="absolute top-0 left-0 loading loading-ring bg-gradient-to-br from-primary to-accent w-[200px]"></div>
      <div className="absolute top-[25%] left-[25%] loading loading-infinity bg-gradient-to-br from-accent to-primary w-[100px]"></div>
    </div>
  );
}
