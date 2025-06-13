// import { PiNotepadBold } from "react-icons/pi";
import Image from "next/image";

type Props = {
  message?: string;
};

export default function NoReadings({ message }: Props) {
  return (
    <div className="h-5/6 mt-10 flex flex-col items-center justify-center gap-4 text-gray-500">
      {/* <PiNotepadBold className="w-16 h-16 text-primary/50" /> */}
      <figure className="max-w-48">
        <Image src="/logo-1.png" width={300} height={200} alt="logo" />
      </figure>
      <p className="text-lg font-medium">
        {!message ? "ไม่พบประวัติการอ่าน" : message}{" "}
      </p>
    </div>
  );
}
