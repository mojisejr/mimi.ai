"use client";
import { useState, useRef } from "react";
import QuestionSubmitButton from "./question-submit-button";
import VoiceInputButton from "./voice-input-button";

export default function QuestionSubmit() {
  const [count, setCount] = useState<number>(0);
  const questionRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div>
      <div className="flex gap-2 justify-between">
        <div className="form-control leading-tight flex flex-col flex-grow">
          <textarea
            ref={questionRef}
            onChange={(e) => {
              setCount(e.target.value.length);
            }}
            className="shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl w-full textarea  focus:outline-none resize-none leading-tight touch-manipulation text-[16px]"
            maxLength={180}
          />
          <div className="label label-text-alt self-end">{count}/180</div>
        </div>
        <QuestionSubmitButton />
      </div>
      <div className="flex justify-center mt-8">
        <VoiceInputButton />
      </div>
    </div>
  );
}
