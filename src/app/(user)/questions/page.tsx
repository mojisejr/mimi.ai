"use client";
import HeroQuestion from "@/components/hero-question";
import TypingText from "@/components/typing-text/text";
import QuestionSubmit from "@/components/question-submit";
import React, { useState } from "react";
import DailyLoginDialog from "@/components/daily-login-dialog";
import { useLine } from "@/providers/line";
import { useLanguage } from "@/providers/language";

export default function QuestionPage() {
  const [asking, setAsking] = useState<{ status: boolean; question: string }>({
    status: false,
    question: "",
  });
  const { profile } = useLine();
  const { t } = useLanguage();

  const handleAskingState = (status: boolean, question: string) => {
    setAsking({ status, question });
  };

  return (
    <div className="relative h-screen w-full max-w-xl overflow-hidden">
      <section className="h-3/6 overflow-scroll flex items-center">
        {asking.status ? (
          <div className="px-10 flex justify-center w-full flex-col  items-center">
            <div className="leading-tight self-start">
              <div>{t("askingQuestion.yourQuestionIs")}</div>
              <div>{asking.question} ?</div>
            </div>
            <TypingText
              texts={[
                t("askingQuestion.typingText1"),
                t("askingQuestion.typingText2"),
              ]}
              duration={1.5}
              repeatDelay={1.3}
            />
          </div>
        ) : (
          <HeroQuestion />
        )}
      </section>
      <section className="h-2/6 w-full">
        <div className="px-6">
          <QuestionSubmit setAsking={handleAskingState} />
        </div>
      </section>

      {/* Daily Login Dialog */}
      {profile?.userId && <DailyLoginDialog lineId={profile.userId} />}
    </div>
  );
}
