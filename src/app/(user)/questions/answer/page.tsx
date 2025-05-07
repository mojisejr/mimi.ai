"use client";
import {
  Suspense,
  useActionState,
  useEffect,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/logo";
import AnswerSection from "@/components/ui/answer-section";
import { deleteAnswerById } from "@/actions/delete-answer";
import { IDeleteAnswerType } from "@/interfaces/i-delete-answer";
import { useSearchParams } from "next/navigation";

let initState: IDeleteAnswerType = {
  success: false,
  error: null,
  message: null,
};

function AnswerPage() {
  const searchParam = useSearchParams();
  const answerId = searchParam.get("aid");
  const { back, replace } = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteResult, setDeleteResult] =
    useState<IDeleteAnswerType>(initState);

  useEffect(() => {
    if (deleteResult.success && deleteResult.message != null) {
      alert(deleteResult.message);
      replace("/questions");
      return;
    }

    if (!deleteResult.success && deleteResult.error != null) {
      alert(deleteResult.message);
      return;
    }
  }, [deleteResult]);

  const handleDeleteSubmit = (formData: FormData) => {
    if (!answerId) {
      alert("ไม่พบ answerId ");
      return;
    }

    console.log("answerId: ", answerId);
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
          <div className="mt-10 flex flex-col items-center gap-2 flex-1">
            <Logo />
            <div>รอสักครู่ 😊</div>
          </div>
        }
      >
        <AnswerSection />
      </Suspense>
      <section className="h-1/6 flex w-full justify-between items-center px-4">
        <button disabled={isPending} onClick={back} className="btn">
          👈 กลับไปถามต่อ
        </button>
        <form action={handleDeleteSubmit}>
          <button
            type="submit"
            disabled={isPending || !answerId}
            className="btn btn-error btn-bordered btn-outline"
          >
            {isPending ? "กำลังลบ..." : "ลบคำทำนาย"}
          </button>
        </form>
      </section>
    </>
  );
}

export default function AnswerPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="mt-10 flex flex-col items-center gap-2 flex-1">
          <Logo />
          <div>รอสักครู่ 😊</div>
        </div>
      }
    >
      <AnswerPage />
    </Suspense>
  );
}
