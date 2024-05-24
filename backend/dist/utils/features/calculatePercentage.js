export const calculatePercentage = (currentMonth, lastMonth) => {
    if (lastMonth === 0)
        return currentMonth * 100;
    const percentage = (currentMonth / lastMonth) * 100;
    return Number(percentage.toFixed(0));
};
