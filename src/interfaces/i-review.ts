export interface IReview {
  reviewId: number;
  questionAnswerId: number;
  lineId: string;
  liked?: number;
  accurateLevel: number;
  createdAt: number;
  reviewPeriod: number;
}
