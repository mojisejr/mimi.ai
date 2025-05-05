"use server";
import { IAnswer, IAnswerResponseMessage } from "@/interfaces/i-answer";
import { subtractPointToUser } from "@/services/torso-db";
import axios from "axios";

export async function askMimi(
  prevState: IAnswerResponseMessage,
  data: FormData
): Promise<IAnswerResponseMessage> {
  const question = data.get("question");
  const userId = data.get("userId");
  const user = data.get("user");
  const currentPoint = data.get("currentPoint");
  let answers;

  if (parseInt(currentPoint as string) <= 0) {
    return {
      success: false,
      error: "คุณไม่มีแต้มสำหรับการถามคำถามแล้ว, กรุณาเติม credit",
      message: null,
    };
  }

  const response = await axios.post(process.env.N8N_URL!, {
    userId: userId,
    user: user,
    output: question,
  });

  answers = response.data as IAnswer;

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

  const result = await subtractPointToUser(
    userId as string,
    parseInt(currentPoint as string),
    1
  );

  if (!result) {
    return {
      success: false,
      error: "คุณไม่มีแต้มสำหรับการถามคำถามแล้ว",
      message: null,
    };
  }

  return {
    success: true,
    error: null,
    message: answers,
  };
}
