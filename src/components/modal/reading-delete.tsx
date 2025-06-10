"use client";
import { deleteAnswerById } from "@/actions/delete-answer";
import { IDeleteReadingType } from "@/interfaces/i-delete-answer";
import React, { useEffect, useState, useTransition } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { APP_CONFIG } from "@/app-config";

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
      toast.success(deleteResult.message, APP_CONFIG.toast);
      onDeleted();
      onClose();
      return;
    }

    if (!deleteResult.success && deleteResult.error != null) {
      toast.error(deleteResult.message, APP_CONFIG.toast);
      return;
    }
  }, [deleteResult]);

  const handleDeleteReading = (formData: FormData) => {
    if (!readingId) {
      toast.error("ไม่สามารถลบข้อมูลได้", APP_CONFIG.toast);
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
