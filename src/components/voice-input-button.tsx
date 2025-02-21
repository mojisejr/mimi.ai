import React from "react";
import { FaMicrophone } from "react-icons/fa";

export default function VoiceInputButton() {
  return (
    <div className="relative w-[50px] h-[50px]">
      <button className="absolute btn btn-circle btn-accent z-10">
        <FaMicrophone size={24} />
        <div className="absolute loading loading-ring top-[-55%] left-[-55%] w-[96px] bg-accent -z-10"></div>
      </button>
    </div>
  );
}
