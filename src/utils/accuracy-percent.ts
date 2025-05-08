export function getPercentageFromScore(score: number) {
  const percentMap = [0, 30, 50, 80, 100];

  if (typeof score !== "number" || score < 0 || score > 5) {
    throw new Error("Score must be a number between 0 and 5");
  }

  if (score == 0) {
    return 0;
  }

  return percentMap[score - 1];
}
