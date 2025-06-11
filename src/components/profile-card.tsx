import Image from "next/image";
import { IUser } from "@/interfaces/i-user-info";

type Props = {
  user: IUser;
  image: string;
};

const calculateProgress = (
  exp: number,
  nextExpRequired: number,
  currentExpRequired: number
): number => {
  const currentExp = exp - currentExpRequired;
  const totalExpForLevel = nextExpRequired - currentExpRequired;
  const progress = (currentExp / totalExpForLevel) * 100;
  return Math.min(Math.max(progress, 0), 100); // จำกัดค่าอยู่ระหว่าง 0-100
};

export default function ProfileCard({ user, image }: Props) {
  const progress = calculateProgress(
    user.exp,
    user.nextExpRequired,
    user.currentExpRequired
  );

  return (
    <div className="max-w-[350px] bg-gradient-to-br rounded-xl shadow-xl p-4 grid grid-cols-3 place-items-center">
      <figure className="relative w-16 h-16 overflow-hidden rounded-full col-span-3 object-cover">
        {image && <Image src={image} fill alt="display-img" />}
      </figure>
      <div className="col-span-3 py-2">
        <span className="">คุณ {user.name}</span>
      </div>
      <div className="col-span-3 w-full">
        <div className="flex items-center gap-1">
          <span className="text-sm">Level: </span>
          <div className="badge badge-primary">{user.level}</div>
        </div>
        <div className="w-full leading-snug">
          <div className="flex items-center gap-1">
            <progress
              className="progress w-full progress-error"
              value={progress}
              max={100}
            ></progress>
            <span className="text-xs">{Math.round(progress)}%</span>
          </div>
          <div className="text-xs text-right">
            {user.exp - user.currentExpRequired} /{" "}
            {user.nextExpRequired - user.currentExpRequired} EXP
          </div>
        </div>
      </div>

      <div className="col-span-1 flex-col items-center flex pt-2">
        <div className="text-xs">Coins</div>
        <div>{user.coins}</div>
      </div>
      <div className="col-span-1"></div>
      <div className="col-span-1 flex-col items-center flex">
        <div className="text-xs">Points</div>
        <div>{user.point}</div>
      </div>
    </div>
  );
}
