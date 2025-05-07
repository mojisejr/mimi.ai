import HistoryCard from "@/components/history-card";
import NoReadings from "@/components/no-reading";
import { getReading } from "@/services/torso-db";
import React from "react";

type SearchParams = {
  searchParams: Promise<{
    uid: string;
  }>;
};

export default async function QuestionHistory({ searchParams }: SearchParams) {
  const { uid } = await searchParams;

  if (!uid) {
    return <NoReadings />;
  }

  const readings = await getReading(uid);

  if (readings.length <= 0) {
    return <NoReadings />;
  }

  return (
    <div className="h-5/6 flex flex-col gap-6">
      {readings.map((reading) => (
        <HistoryCard key={reading.id} reading={reading} />
      ))}
    </div>
  );
}
