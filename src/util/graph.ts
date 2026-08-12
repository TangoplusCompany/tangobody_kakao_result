export function removeOutliersIQR(arr: number[], multiplier: number = 1.5): number[] {
  if (arr.length === 0) return arr;

  const sorted = [...arr].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;

  const lowerBound = q1 - multiplier * iqr;
  const upperBound = q3 + multiplier * iqr;

  return arr.filter((v) => v >= lowerBound && v <= upperBound);
}