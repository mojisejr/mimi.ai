"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import QuestionSubmitButton from "./question-submit-button";
import VoiceInputButton from "./voice-input-button";
import { IAnswerResponseMessage } from "@/interfaces/i-answer";
import { askMimi } from "@/actions/ask-mimi";
import { useAudioInput } from "@/providers/audio-input";
import { useRouter } from "next/navigation";
import { useLine } from "@/providers/line";
import PointCounter from "./point-counter";
import { toast } from "react-toastify";
import { APP_CONFIG } from "@/app-config";
import { useLanguage } from "@/providers/language";

const initialState: IAnswerResponseMessage = {
  success: false,
  error: null,
  answerId: null,
  message: null,
};

type Props = {
  setAsking: (status: boolean, question: string) => void;
};

export default function QuestionSubmit({ setAsking }: Props) {
  const [count, setCount] = useState<number>(0);
  const [question, setQuestion] = useState<string>("");
  const [state, formAction, pending] = useActionState(askMimi, initialState);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const { transcribe } = useAudioInput();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { push } = useRouter();
  const { profile, getProfile } = useLine();
  const { t } = useLanguage();

  useEffect(() => {
    const userAgent = navigator.userAgent.toLocaleLowerCase();
    if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
      setIsIOS(true);
    } else {
      setIsIOS(false);
    }
  }, []);

  useEffect(() => {
    if (transcribe && transcribe?.length > 0) {
      setQuestion(transcribe);
      setCount(transcribe.length);
    }
  }, [transcribe]);

  useEffect(() => {
    if (pending) {
      setAsking(true, question);
    } else {
      setAsking(false, "");
    }
  }, [pending, question]);

  useEffect(() => {
    if (state.success && state.message != null) {
      setQuestion("");
      localStorage.setItem("answerData", JSON.stringify(state.message));
      push(`/questions/answer?aid=${state.answerId}`);
    }
    if (!state.success && state.message == null && state.error != null) {
      toast.error(state.error, APP_CONFIG.toast);
      setQuestion("");
      setAsking(false, "");
      return;
    }
  }, [state]);

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    const selectedQuestion = localStorage.getItem("selectedQuestion");
    if (selectedQuestion) {
      setQuestion(selectedQuestion);
      setCount(selectedQuestion.length);
      localStorage.removeItem("selectedQuestion");
    }
  }, []);

  const handleSubmit = (formData: FormData) => {
    formAction(formData);
  };

  return (
    <div>
      <PointCounter />
      <form className="flex gap-2 justify-between" action={handleSubmit}>
        <input type="hidden" name="userId" value={profile?.userId} />
        <input type="hidden" name="user" value={profile?.displayName} />
        <input
          type="hidden"
          name="currentPoint"
          value={profile?.currentPoint}
        />

        <div className="form-control leading-tight flex flex-col flex-grow placeholder:text-black">
          <textarea
            disabled={pending}
            ref={inputRef}
            name="question"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              setCount(e.target.value.length);
            }}
            className="shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl w-full textarea  focus:outline-none resize-none leading-tight touch-manipulation text-[16px]"
            maxLength={180}
          />
          <div className="label label-text-alt self-end">{count}/180</div>
        </div>
        <QuestionSubmitButton
          count={count}
          currentPoint={profile?.currentPoint as number}
        />
      </form>
      <div className="flex justify-center mt-8 flex-col items-center">
        <VoiceInputButton
          disabled={pending || (profile?.currentPoint as number) <= 0 || isIOS}
        />
        {isIOS ? (
          <span className="text-xs text-slate-400">
            {t("microphoneButton.IOS")}
          </span>
        ) : null}
      </div>
    </div>
  );
}
