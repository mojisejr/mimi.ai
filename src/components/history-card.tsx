import { FaRegTrashAlt } from "react-icons/fa";
import { MdOutlineReviews } from "react-icons/md";
import { PiReadCvLogoBold } from "react-icons/pi";
import { Reading } from "@/interfaces/i-readings";
import RatingStars from "./rating-stars";
import { getPercentageFromScore } from "@/utils/accuracy-percent";
import { redirect } from "next/navigation";

interface HistoryCardProps {
  reading: Reading;
  lineId: string;
  deleteDialog: (lineId: string, question: string, answerId: number) => void;
  reviewDialog: (lineId: string, question: string, answerId: number) => void;
}

export default function HistoryCard({
  reading,
  lineId,
  deleteDialog,
  reviewDialog,
}: HistoryCardProps) {
  const { id, question, cards, final, createdAt } = reading;
  const review = reading && reading.review ? reading.review : null;

  const handleRedirectToReadningPage = () => {
    localStorage.setItem("answerData", JSON.stringify(reading));

    redirect(`/questions/answer?aid=${id}`);
  };

  return (
    <div className="flex min-w-[330px] shadow-xl rounded-xl border-primary flex-col overflow-hidden">
      <div className="flex gap-2">
        {/* <div className="flex items-center p-2">
          <StackedCards cards={cards} />
        </div> */}
        <div className="p-6 gap-[4px] flex-col flex">
          <h2 className="font-semibold text-primary">{question}?</h2>
          <div className="flex gap-1 items-center">
            <div className="badge badge-sm text-[9px] badge-accent">
              {new Date(parseInt(createdAt) * 1000).toLocaleDateString()}
            </div>

            <div
              className={`badge badge-sm text-[9px] ${
                review?.accurateLevel ? "badge-warning" : null
              }`}
            >
              {review?.accurateLevel ? "reviewed" : "no-review"}
            </div>
            <div className="flex items-center text-medium gap-[2px]">
              <RatingStars starNumber={review?.accurateLevel ?? 0} />
              <span>{getPercentageFromScore(review?.accurateLevel ?? 0)}%</span>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold">คำแนะนำ</h3>
            <ul className="text-xs">
              {final.map((item, index) => (
                <li key={index}>
                  {index + 1}. {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex justify-between px-2 py-1 items-center bg-slate-100">
        <div>
          <button
            onClick={() => deleteDialog(lineId, question, id)}
            className="btn btn-xs btn-error text-white flex items-center gap-1"
          >
            <FaRegTrashAlt />
            <span>ลบ</span>
          </button>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => reviewDialog(lineId, question, id)}
            className="btn btn-xs btn-primary flex gap-1 items-center"
            disabled={review?.accurateLevel != null}
          >
            <MdOutlineReviews />
            <span>รีวิว</span>
          </button>
          <form action={handleRedirectToReadningPage}>
            <button
              type="submit"
              // href={`/questions/answer?aid=${id}`}
              className="btn btn-xs btn-primary flex gap-1 items-center"
            >
              <PiReadCvLogoBold />
              <span>อ่าน</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
