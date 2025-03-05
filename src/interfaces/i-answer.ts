export interface IAnswerResponseMessage {
  success: boolean;
  error: string | null;
  message: IAnswer | null;
}

export interface IAnswer {
  header: string;
  cards: string[];
  reading: string;
  suggest: string;
  final: string;
  end: string;
  notice: string;
}
