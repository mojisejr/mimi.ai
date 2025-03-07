"use server";
import { IAnswer, IAnswerResponseMessage } from "@/interfaces/i-answer";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function askMimi(
  prevState: IAnswerResponseMessage,
  data: FormData
): Promise<IAnswerResponseMessage> {
  const question = data.get("question");
  const cookieStore = await cookies();
  let answers;

  const response = await axios.post(
    // "https://n8n.jaothui.com/webhook-test/bdd6d968-f536-4103-9ce4-59eafaad0568",
    process.env.N8N_URL!,
    {
      output: question,
    }
  );

  answers = response.data as IAnswer[];

  if (answers.length <= 0) {
    return {
      success: false,
      error: "แม่หมออาจจะเบลอๆ ลองใหม่นะคะ.. 😢",
      message: null,
    };
  }

  //   return {
  //     success: true,
  //     error: null,
  //     message: answers![0] as IAnswer,
  //   };

  cookieStore.set({
    name: "answer",
    value: JSON.stringify(answers[0]),
    path: "/",
  });

  revalidatePath("/questions");
  return {
    success: true,
    error: null,
    message: answers[0],
  };

  // redirect("/answer");
}
