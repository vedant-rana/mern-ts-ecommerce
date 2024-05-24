export const calculatePercentage = (
  currentMonth: number,
  lastMonth: number
) => {
  if (lastMonth === 0) return currentMonth * 100;
  const percentage = (currentMonth / lastMonth) * 100;
  return Number(percentage.toFixed(0));
};
