import { IAnswer } from "./i-answer";

export interface ISaveReading {
  lineId: string;
  question: string;
  answer: IAnswer;
}
