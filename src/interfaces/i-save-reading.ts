import { IAnswer } from "./i-answer";

export interface ISaveReading {
  line_id: string;
  question: string;
  answer: IAnswer;
}
