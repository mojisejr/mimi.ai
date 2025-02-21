"use client";
import HeroQuestion from "@/components/hero-question";
import MiniNav from "@/components/mini-nav";
import QuestionSubmit from "@/components/question-submit";
import { useLine } from "@/providers/line";
import { redirect } from "next/navigation";
import React from "react";

export default function QuestionPage() {
  const { isLoggedIn } = useLine();

  if (!isLoggedIn) {
    return redirect("/");
  }

  return (
    <div className="relative h-screen w-full max-w-xl overflow-hidden">
      <section className="h-3/6 overflow-scroll flex items-center">
        <HeroQuestion />
      </section>
      <section className="h-2/6 w-full">
        <div className="px-6">
          <QuestionSubmit />
        </div>
      </section>
    </div>
  );
}
