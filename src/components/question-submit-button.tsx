import { useFormStatus } from "react-dom";
import { BiSolidMagicWand } from "react-icons/bi";

export default function QuestionSubmitButton({
  count,
  currentPoint,
}: {
  count: number;
  currentPoint: number;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending || count <= 0 || currentPoint <= 0}
      type="submit"
      className="btn btn-circle btn-primary shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
    >
      <BiSolidMagicWand size={24} />
    </button>
  );
}
