"use server";
import { IAnswer, IAnswerResponseMessage } from "@/interfaces/i-answer";
import { saveReading, subtractPointToUser } from "@/services/torso";
import axios from "axios";
import { cleanInput } from "@/utils/clean-input";

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
      answerId: null,
      message: null,
    };
  }

  const cleanedQuestion = cleanInput(question as string);

  if (!cleanedQuestion || cleanedQuestion.trim() === "") {
    return {
      success: false,
      error: "กรุณาป้อนคำถาม ไม่สามารถส่งคำถามที่เป็นช่องว่างได้",
      answerId: null,
      message: null,
    };
  }

  const response = await axios.post(process.env.N8N_URL!, {
    userId: userId,
    user: user,
    output: cleanedQuestion,
  });

  answers = response.data as IAnswer;

  if (!answers) {
    return {
      success: false,
      answerId: null,
      error: "แม่หมออาจจะเบลอๆ ลองใหม่นะคะ.. 😢",
      message: null,
    };
  }

  if (answers && answers.cards.length <= 0) {
    return {
      success: false,
      error: answers.header,
      answerId: null,
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
      answerId: null,
      message: null,
    };
  }

  //save
  const saveResult = await saveReading({
    lineId: userId as string,
    question: cleanedQuestion,
    answer: {
      ...answers,
    },
  });

  console.log("save result: ", saveResult);

  if (!saveResult.success) {
    return {
      success: false,
      error: "ไม่สามารถเซฟคำตอบได้ตามปกติ",
      answerId: null,
      message: null,
    };
  }

  return {
    success: true,
    error: null,
    answerId: saveResult.answerId,
    message: answers,
  };
}
