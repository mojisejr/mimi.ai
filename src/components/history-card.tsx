import React from "react";
import StackedCards from "./stacked-cards";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdOutlineReviews } from "react-icons/md";
import { PiReadCvLogoBold } from "react-icons/pi";

interface Reading {
  id: number;
  question: string;
  header: string;
  cards: any[];
  reading: string;
  suggest: any[];
  final: any[];
  end: string;
  notice: string;
  is_reviewed: number;
  created_at: string;
}

interface HistoryCardProps {
  reading: Reading;
}

export default function HistoryCard({ reading }: HistoryCardProps) {
  const { question, cards, final, created_at, is_reviewed } = reading;

  return (
    <div className="flex min-w-[280px] max-w-[335px] shadow-sm rounded-xl  border-primary flex-col overflow-hidden">
      <div className="flex gap-2">
        <div className="flex items-center p-2">
          <StackedCards cards={cards} />
        </div>
        <div className="p-4 gap-[4px] flex-col flex">
          <h2 className="font-semibold text-primary">{question}?</h2>
          <div className="flex gap-1">
            <div className="badge badge-xs text-[9px] badge-accent">
              {new Date(parseInt(created_at) * 1000).toLocaleDateString()}
            </div>
            <div
              className={`badge badge-xs text-[9px] ${
                is_reviewed > 0 ? "badge-primary" : null
              }`}
            >
              na
            </div>
            <div
              className={`badge badge-xs text-[9px] ${
                is_reviewed > 0 ? "badge-warning" : null
              }`}
            >
              {is_reviewed > 0 ? "reviewed" : "no-review"}
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
          <button className="btn btn-xs btn-error text-white flex items-center gap-1">
            <FaRegTrashAlt />
            <span>ลบ</span>
          </button>
        </div>
        <div className="flex gap-1">
          <button className="btn btn-xs btn-primary flex gap-1 items-center">
            <MdOutlineReviews />
            <span>รีวิว</span>
          </button>
          <button className="btn btn-xs btn-primary flex gap-1 items-center">
            <PiReadCvLogoBold />
            <span>อ่าน</span>
          </button>
        </div>
      </div>
    </div>
  );
}
