"use client";
import { useLanguage } from "@/providers/language";
import { useLine } from "@/providers/line";
import React from "react";

export default function PointCounter() {
  const { profile, profileLoading } = useLine();
  const { t } = useLanguage();

  if (profileLoading) {
    return (
      <span className="text-sm">
        {t("pointCounter.questionLeft1") + " "}
        <span className="badge badge-primary badge-sm">
          <div className="loading loading-infinity loading-xs"></div>
        </span>{" "}
        {t("pointCounter.questionLeft2")}
      </span>
    );
  }
  return (
    <span className="text-sm">
      {t("pointCounter.questionLeft1") + " "}
      <span className="badge badge-primary badge-sm">
        {profile?.currentPoint}
      </span>{" "}
      {t("pointCounter.questionLeft2")}
    </span>
  );
}
