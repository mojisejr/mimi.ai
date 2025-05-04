"use client";
import { useLine } from "@/providers/line";
import React from "react";

export default function PointCounter() {
  const { profile, profileLoading } = useLine();

  if (profileLoading) {
    return (
      <span className="text-sm">
        คุณเหลืออีก{" "}
        <span className="badge badge-primary badge-sm">
          <div className="loading loading-infinity loading-xs"></div>
        </span>{" "}
        คำถาม
      </span>
    );
  }
  return (
    <span className="text-sm">
      คุณเหลืออีก{" "}
      <span className="badge badge-primary badge-sm">
        {profile?.currentPoint}
      </span>{" "}
      คำถาม
    </span>
  );
}
