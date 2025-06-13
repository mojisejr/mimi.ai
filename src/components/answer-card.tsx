"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useImageCache } from "@/hooks/use-image-cache";
import { useLanguage } from "@/providers/language";

interface Props {
  name: string;
  flipped: boolean;
  image: string;
  onClick: () => void;
}

export default function AnswerCard({ name, image, flipped, onClick }: Props) {
  const { t } = useLanguage();
  const { imageUrl, isLoading } = useImageCache(name, image);

  return (
    <motion.div
      initial={{ rotateY: 360 }}
      className="relative max-w-[150px] h-48  cursor-pointer"
      onClick={onClick}
      animate={{ rotateY: flipped ? 360 : 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Front Side */}
      <motion.div
        className={`absolute inset-0 flex items-center justify-center bg-white shadow-xl rounded-xl ${
          flipped ? "opacity-100" : "opacity-0"
        }`}
      >
        {isLoading ? (
          <div className="flex flex-col">
            <div className="loading-infinity  loading loading-lg  bg-gradient-to-br from-accent to-primary"></div>
            <span className="text-xs">{t("answer.cardLoading")}</span>
          </div>
        ) : (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
      </motion.div>

      {/* Back Side */}
      <motion.div
        className={`absolute inset-0 flex items-center justify-center shadow-xl rounded-xl 
            ${flipped ? "opacity-0" : "opacity-100"}
            border-[1px] border-opacity-30 border-amber-300`}
        style={{
          perspective: "1000px",
          background: `
                  radial-gradient(circle at top left, rgba(255, 255, 255, 0.4) 10%, transparent 50%),
                  linear-gradient(to bottom right, rgba(255, 200, 100, 0.9), rgba(255, 150, 50, 0.8)),
                  radial-gradient(circle at center, rgba(255, 255, 255, 0.2), transparent 50%)
                `,
          boxShadow:
            "inset 0px 4px 10px rgba(255, 255, 255, 0.3), 0px 10px 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div className="absolute inset-0 bg-white opacity-20 blur-xl rounded-md"></div>
        <div className="relative h-[200px] w-[200px]">
          <div className="absolute top-[25%] left-[20%] loading loading-ring bg-gradient-to-br from-primary to-accent w-[80px]"></div>
          <div className="absolute top-[25%] left-[20%] loading loading-infinity bg-gradient-to-br from-accent to-primary w-[80px]"></div>
        </div>
        {/* <div className="relative h-[50px] w-[50px]">
          {isLoading && (
            <div className="absolute loading loading-infinity bg-gradient-to-br from-accent to-primary w-[50px]"></div>
          )}
        </div> */}
        {/* <div className="absolute bottom-2 text-xs">mimi.ai</div> */}
        <div className="absolute bottom-2">
          <figure className="max-w-14">
            <Image src="/logo-1.png" width={300} height={200} alt="logo" />
          </figure>
        </div>
      </motion.div>
    </motion.div>
  );
}
