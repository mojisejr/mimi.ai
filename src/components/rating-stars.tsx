import React from "react";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";

type Props = {
  starNumber: number;
};

export default function RatingStars({ starNumber }: Props) {
  return (
    <div className="flex items-center justify-start text-yellow-500">
      {starNumber >= 1 ? <FaStar size={14} /> : <FaRegStar size={14} />}
      {starNumber >= 2 ? <FaStar size={14} /> : <FaRegStar size={14} />}
      {starNumber >= 3 ? <FaStar size={14} /> : <FaRegStar size={14} />}
      {starNumber >= 4 ? <FaStar size={14} /> : <FaRegStar size={14} />}
      {starNumber == 5 ? <FaStar size={14} /> : <FaRegStar size={14} />}
    </div>
  );
}
