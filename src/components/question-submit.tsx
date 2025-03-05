"use client";
import { useActionState, useEffect, useState } from "react";
import QuestionSubmitButton from "./question-submit-button";
import VoiceInputButton from "./voice-input-button";
import { IAnswerResponseMessage } from "@/interfaces/i-answer";
import { askMimi } from "@/actions/ask-mimi";
import { redirect } from "next/navigation";

const initialState: IAnswerResponseMessage = {
  success: false,
  error: null,
  message: null,
};

export default function QuestionSubmit() {
  const [count, setCount] = useState<number>(0);
  const [state, formAction, pending] = useActionState(askMimi, initialState);

  useEffect(() => {}, [state]);

  return (
    <div>
      <form className="flex gap-2 justify-between" action={formAction}>
        <div className="form-control leading-tight flex flex-col flex-grow">
          <textarea
            disabled={pending}
            name="question"
            onChange={(e) => {
              setCount(e.target.value.length);
            }}
            className="shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl w-full textarea  focus:outline-none resize-none leading-tight touch-manipulation text-[16px]"
            maxLength={180}
          />
          <div className="label label-text-alt self-end">{count}/180</div>
        </div>
        <QuestionSubmitButton />
      </form>
      <div className="flex justify-center mt-8">
        <VoiceInputButton />
      </div>
    </div>
  );
}
