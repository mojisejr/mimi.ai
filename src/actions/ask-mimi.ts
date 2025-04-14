"use server";
import { IAnswer, IAnswerResponseMessage } from "@/interfaces/i-answer";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { useLine } from "@/providers/line";

export async function askMimi(
  prevState: IAnswerResponseMessage,
  data: FormData
): Promise<IAnswerResponseMessage> {
  const question = data.get("question");
  const userId = data.get("userId");
  const user = data.get("user");
  let answers;

  const response = await axios.post(process.env.N8N_URL!, {
    userId: userId,
    user: user,
    output: question,
  });

  answers = response.data as IAnswer;

  // console.log(answers);

  if (!answers) {
    return {
      success: false,
      error: "แม่หมออาจจะเบลอๆ ลองใหม่นะคะ.. 😢",
      message: null,
    };
  }

  if (answers && answers.cards.length <= 0) {
    return {
      success: false,
      error: answers.header,
      message: null,
    };
  }

  revalidatePath("/questions");
  return {
    success: true,
    error: null,
    message: answers,
  };
}
