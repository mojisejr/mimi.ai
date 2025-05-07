export interface IAnswerResponseMessage {
  success: boolean;
  answerId: number | null;
  error: string | null;
  message: IAnswer | null;
}

export interface IAnswer {
  header: string;
  cards: Card[];
  reading: string;
  suggest: string[];
  final: string[];
  end: string;
  notice: string;
}

export interface Card {
  name: string;
  imageUrl: string;
}
