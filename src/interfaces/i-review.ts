export interface IReview {
  review_id: number;
  question_answer_id: number;
  line_id: string;
  liked?: number;
  accurate_level: number;
  created_at: number;
  review_period: number;
}
