"use client";
import { Suspense, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/logo";
import AnswerSection from "@/components/ui/answer-section";
import { deleteAnswerById } from "@/actions/delete-answer";
import { IDeleteReadingType } from "@/interfaces/i-delete-answer";
import { useSearchParams } from "next/navigation";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { APP_CONFIG } from "@/app-config";

let initState: IDeleteReadingType = {
  success: false,
  error: null,
  message: null,
};

export default function AnswerPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="h-4/6 pt-[h-1/6] flex flex-col items-center gap-2 flex-1">
          <Logo />
          <div>รอสักครู่ 😊</div>
        </div>
      }
    >
      <AnswerPage />
    </Suspense>
  );
}

function AnswerPage() {
  const searchParam = useSearchParams();
  const answerId = searchParam.get("aid");
  const { back, replace } = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteResult, setDeleteResult] =
    useState<IDeleteReadingType>(initState);

  useEffect(() => {
    if (deleteResult.success && deleteResult.message != null) {
      toast.success(deleteResult.message, APP_CONFIG.toast);
      replace("/questions");
      return;
    }

    if (!deleteResult.success && deleteResult.error != null) {
      toast.error(deleteResult.message, APP_CONFIG.toast);
      return;
    }
  }, [deleteResult]);

  const handleDeleteSubmit = (formData: FormData) => {
    if (!answerId) {
      toast.error("ไม่พบ answerId ", APP_CONFIG.toast);
      return;
    }

    startTransition(async () => {
      formData.append("answerId", answerId);
      const result = await deleteAnswerById(formData);
      setDeleteResult(result);
    });
  };

  return (
    <>
      <Suspense
        fallback={
          <div className="h-4/6 pt-[h-1/6] flex flex-col items-center gap-2 flex-1">
            <Logo />
            <div>รอสักครู่ 😊</div>
          </div>
        }
      >
        <AnswerSection />
      </Suspense>
      <section className="h-1/6 flex w-full justify-between items-center px-4">
        <button disabled={isPending} onClick={back} className="btn btn-primary">
          👈 กลับไปถามต่อ
        </button>
        <form action={handleDeleteSubmit}>
          <button
            disabled={isPending || !answerId}
            type="submit"
            className="btn btn-error text-white flex items-center gap-1"
          >
            {isPending ? (
              <div className="loading loading-sm loading-infinity"></div>
            ) : (
              <FaRegTrashAlt />
            )}
            {isPending ? <span>กำลังลบ..</span> : <span>ลบ</span>}
          </button>
        </form>
      </section>
    </>
  );
}
