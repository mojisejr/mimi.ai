"use client";
import { deleteAnswerById } from "@/actions/delete-answer";
import { IDeleteReadingType } from "@/interfaces/i-delete-answer";
import React, { useEffect, useState, useTransition } from "react";
import { FaRegTrashAlt } from "react-icons/fa";

type Props = {
  lineId: string;
  question: string;
  readingId: number;
  isOpen: boolean;
  onDeleted: () => void;
  onClose: () => void;
};

const initState: IDeleteReadingType = {
  success: false,
  message: null,
  error: null,
};

export default function ReadingDeleteDialog({
  lineId,
  readingId,
  question,
  isOpen,
  onDeleted,
  onClose,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [deleteResult, setDeleteResult] =
    useState<IDeleteReadingType>(initState);

  useEffect(() => {
    if (deleteResult.success && deleteResult.message != null) {
      alert(deleteResult.message);
      onDeleted();
      onClose();
      return;
    }

    if (!deleteResult.success && deleteResult.error != null) {
      alert(deleteResult.message);
      return;
    }
  }, [deleteResult]);

  const handleDeleteReading = (formData: FormData) => {
    if (!readingId) {
      alert("ไม่สามารถลบข้อมูลได้");
      return;
    }

    formData.append("answerId", readingId.toString());

    startTransition(async () => {
      const result = await deleteAnswerById(formData);
      setDeleteResult(result);
    });
  };

  return (
    <>
      {isOpen && readingId && lineId && (
        <dialog id="reading_delete_dialog" className="modal modal-open">
          <div className="modal-box">
            <h2 className="title-box ">
              <span className="text-error font-bold text-xl">
                คุณต้องการลบคำทำนาย
              </span>
              <br />
              <span className="">"{question}?"</span>
            </h2>
            <div className="modal-action flex justify-between px-2">
              <form action={handleDeleteReading}>
                <button
                  disabled={isPending}
                  type="submit"
                  className="btn btn-sm btn-error text-white flex items-center gap-1"
                >
                  {isPending ? (
                    <div className="loading loading-sm loading-infinity"></div>
                  ) : (
                    <FaRegTrashAlt />
                  )}
                  {isPending ? <span>กำลังลบ..</span> : <span>ลบ</span>}
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
