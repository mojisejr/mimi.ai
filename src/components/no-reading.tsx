import { PiNotepadBold } from "react-icons/pi";
import React from "react";

export default function NoReadings() {
  return (
    <div className="h-5/6 mt-10 flex flex-col items-center justify-center gap-4 text-gray-500">
      <PiNotepadBold className="w-16 h-16 text-primary/50" />
      <p className="text-lg font-medium">ไม่พบประวัติการอ่าน</p>
    </div>
  );
}
