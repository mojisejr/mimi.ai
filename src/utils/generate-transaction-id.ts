/**
 * Generates a unique transaction ID by combining two line IDs and current timestamp
 * @param lineId1 First line ID
 * @param lineId2 Second line ID
 * @returns A unique numeric transaction ID
 */
export const generateTransactionId = (
  lineId1: string,
  lineId2: string
): number => {
  // Get current timestamp
  const timestamp = new Date().getTime();

  // Combine line IDs and timestamp into a single string
  const combinedString = `${lineId1}${lineId2}${timestamp}`;

  // Convert to number using a simple hash function
  let hash = 0;
  for (let i = 0; i < combinedString.length; i++) {
    const char = combinedString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // Ensure positive number and remove decimal points
  return Math.abs(Math.floor(hash));
};
