"use client";
import HistoryCard from "@/components/history-card";
import AnswerDeleteDialog from "@/components/modal/reading-delete";
import ReviewDialog from "@/components/modal/review-readings";
import NoReadings from "@/components/no-reading";
import { useLine } from "@/providers/line";
import { getReadingsByUserId } from "@/actions/get-readings";
import { Reading } from "@/interfaces/i-readings";
import React, { useEffect, useState } from "react";

export default function QuestionHistory() {
  const { profile } = useLine();
  const [isLoadReading, setIsLoadReading] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [isReviewed, setIsReviewed] = useState<boolean>(false);
  const [selectedForDelete, setSelectedForDelete] = useState<{
    lineId: string;
    question: string;
    readingId: number;
  } | null>(null);
  const [selectedForReview, setSelectedForReview] = useState<{
    lineId: string;
    question: string;
    readingId: number;
  } | null>(null);
  const [readings, setReading] = useState<Reading[]>([]);

  const handleSelectedDelete = (
    lineId: string,
    question: string,
    readingId: number
  ) => {
    setSelectedForDelete({ lineId, question, readingId });
    setIsDeleteOpen(true);
    setIsDeleted(false);
  };

  const handleSelectedReview = (
    lineId: string,
    question: string,
    readingId: number
  ) => {
    setSelectedForReview({ lineId, question, readingId });
    setIsReviewOpen(true);
    setIsReviewed(false);
  };

  const handleGetReading = () => {
    if (!profile?.userId) return;
    setIsLoadReading(true);
    getReadingsByUserId(profile.userId)
      .then((readings) => {
        setReading(readings);
        setIsLoadReading(false);
      })
      .catch(() => {
        setReading([]);
        setIsLoadReading(false);
      })
      .finally(() => setIsLoadReading(false));
  };

  useEffect(() => {
    handleGetReading();
  }, []);

  useEffect(() => {
    if (isDeleted || isReviewed) {
      handleGetReading();
    }
  }, [isDeleted, isReviewed]);

  if (!profile?.userId) {
    return <NoReadings />;
  }

  if (readings.length <= 0) {
    return (
      <>
        {isLoadReading ? (
          <NoReadings message="กำลังโหลดข้อมูล.." />
        ) : (
          <NoReadings />
        )}
        ;
      </>
    );
  }

  return (
    <div className="h-5/6 pt-[h-1/6] gap-6 px-2 pb-6 overflow-y-scroll">
      {readings.map((reading) => (
        <HistoryCard
          key={reading.id}
          lineId={profile?.userId}
          reading={reading}
          deleteDialog={handleSelectedDelete}
          reviewDialog={handleSelectedReview}
        />
      ))}
      {selectedForDelete != null && (
        <AnswerDeleteDialog
          readingId={selectedForDelete.readingId}
          question={selectedForDelete.question}
          lineId={selectedForDelete.lineId}
          isOpen={isDeleteOpen}
          onDeleted={() => setIsDeleted(true)}
          onClose={() => setIsDeleteOpen(false)}
        />
      )}
      {selectedForReview != null && (
        <ReviewDialog
          readingId={selectedForReview.readingId}
          question={selectedForReview.question}
          lineId={selectedForReview.lineId}
          isOpen={isReviewOpen}
          onReviewed={() => setIsReviewed(true)}
          onClose={() => setIsReviewOpen(false)}
        />
      )}
    </div>
  );
}
