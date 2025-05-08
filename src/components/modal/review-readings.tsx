"use client";

import React, { useState, useTransition } from "react";
import AccuracyRatingSelector from "@/components/accuracy-rating-selector";
import { createReviewAction } from "@/actions/create-review";

type Props = {
  readingId: number;
  question: string;
  lineId: string;
  isOpen: boolean;
  onReviewed: () => void;
  onClose: () => void;
};

export default function ReviewDialog({
  readingId,
  question,
  lineId,
  isOpen,
  onReviewed,
  onClose,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [rating, setRating] = useState<number>(3);

  const handleSubmitReview = async (formData: FormData) => {
    if (!readingId) {
      alert("ไม่พบ readingId");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createReviewAction({
          question_answer_id: readingId,
          line_id: lineId,
          accurate_level: rating,
        });

        if (result.success) {
          alert("บันทึกการรีวิวสำเร็จ");
          onReviewed();
          onClose();
        } else {
          alert(result.message);
        }
      } catch (error) {
        alert("เกิดข้อผิดพลาดในการบันทึกการรีวิว");
      }
    });
  };

  return (
    <>
      {isOpen && readingId && (
        <dialog id="review_dialog" className="modal modal-open">
          <div className="modal-box">
            <h2 className="title-box">
              <span className="text-primary font-bold text-xl">
                ให้คะแนนความแม่นยำ
              </span>
              <br />
              <span className="">"{question}?"</span>
            </h2>

            <div className="py-4">
              <AccuracyRatingSelector
                value={rating}
                onChange={setRating}
                label="ความแม่นยำในการทำนาย"
              />
            </div>

            <div className="modal-action flex justify-between px-2">
              <form action={handleSubmitReview}>
                <button
                  disabled={isPending}
                  type="submit"
                  className="btn btn-sm btn-primary text-white flex items-center gap-1"
                >
                  {isPending ? (
                    <div className="loading loading-sm loading-infinity"></div>
                  ) : null}
                  {isPending ? <span>กำลังบันทึก..</span> : <span>บันทึก</span>}
                </button>
              </form>
              <button onClick={onClose} className="btn btn-sm">
                ยกเลิก
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
