import React from "react";
import HeroCard from "./hero-card";

export default function HeroCardGroup() {
  return (
    <div className="flex gap-2 overflow-hidden">
      <HeroCard />
      <HeroCard />
      <HeroCard />
    </div>
  );
}
