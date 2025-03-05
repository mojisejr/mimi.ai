import { useFormStatus } from "react-dom";
import { BiSolidMagicWand } from "react-icons/bi";

export default function QuestionSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      type="submit"
      className="btn btn-circle btn-primary shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
    >
      <BiSolidMagicWand size={24} />
    </button>
  );
}
