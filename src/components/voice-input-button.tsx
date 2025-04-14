"use client";
import { useAudioInput } from "@/providers/audio-input";
import React, { useEffect } from "react";
import { BiPause } from "react-icons/bi";
import { FaMicrophone } from "react-icons/fa";

type Props = {
  disabled: boolean;
};

export default function VoiceInputButton({ disabled = false }: Props) {
  const { toggleRecording, isRecording, stopRecording } = useAudioInput();

  useEffect(() => {
    stopRecording();
  }, [disabled]);

  return (
    <div className="relative w-[50px] h-[50px]">
      {isRecording && !disabled ? (
        <button
          disabled={disabled}
          onClick={toggleRecording}
          className="absolute btn btn-circle btn-accent z-10"
        >
          <BiPause size={32} />
          <div className="absolute loading loading-ring top-[-55%] left-[-55%] w-[96px] bg-accent -z-10"></div>
        </button>
      ) : (
        <button
          disabled={disabled}
          onClick={toggleRecording}
          className="absolute btn btn-circle btn-primary z-10"
        >
          <FaMicrophone size={24} />
          <div className="absolute loading loading-ring top-[-55%] left-[-55%] w-[96px] bg-primary -z-10"></div>
        </button>
      )}
    </div>
  );
}
