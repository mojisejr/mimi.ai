import { IReview } from "./i-review";

export interface Reading {
  id: number;
  question: string;
  header: string;
  cards: any[];
  reading: string;
  suggest: any[];
  final: any[];
  end: string;
  notice: string;
  isReviewed: number;
  createdAt: string;
  review?: IReview;
}
