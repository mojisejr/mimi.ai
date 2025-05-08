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
  is_reviewed: number;
  created_at: string;
  review?: IReview;
}
