"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import QuestionSubmitButton from "./question-submit-button";
import VoiceInputButton from "./voice-input-button";
import { IAnswerResponseMessage } from "@/interfaces/i-answer";
import { askMimi } from "@/actions/ask-mimi";
import { useAudioInput } from "@/providers/audio-input";
import { useRouter } from "next/navigation";

const initialState: IAnswerResponseMessage = {
  success: false,
  error: null,
  message: null,
};

type Props = {
  setAsking: (status: boolean, question: string) => void;
};

export default function QuestionSubmit({ setAsking }: Props) {
  const [count, setCount] = useState<number>(0);
  const [state, formAction, pending] = useActionState(askMimi, initialState);
  const { transcribe } = useAudioInput();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { push } = useRouter();

  useEffect(() => {
    if (transcribe && transcribe?.length > 0) {
      inputRef.current!.value = transcribe;
      setCount(transcribe.length);
    }
  }, [transcribe]);

  useEffect(() => {
    if (pending) {
      setAsking(true, inputRef.current!.value);
    }
  }, [pending]);

  useEffect(() => {
    if (state.success && state.message != null) {
      inputRef.current!.value = "";
      push(`/questions/answer?ans=${JSON.stringify(state.message)}`);
    }
    if (!state.success && state.message == null && state.error != null) {
      alert(
        "เอ๊ะ คุณอาจจะถามแม่หมอในคำถามที่ไม่เกี่ยวกับการดู ดวงหรือเปล่านะ ลองถามใหม่นะค๊ะ ✨"
      );
      inputRef.current!.value = "";
      return;
    }
  }, [state]);

  const handleSubmit = (formData: FormData) => {
    formAction(formData);
  };

  return (
    <div>
      <form className="flex gap-2 justify-between" action={handleSubmit}>
        <div className="form-control leading-tight flex flex-col flex-grow placeholder:text-black">
          <textarea
            disabled={pending}
            ref={inputRef}
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
        <VoiceInputButton disabled={pending} />
      </div>
    </div>
  );
}
