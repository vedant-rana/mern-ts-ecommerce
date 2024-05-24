export const lastMonthsData = ({ length, docArr, today }) => {
    const data = new Array(length).fill(0);
    docArr.forEach((order) => {
        const creationDate = order.createdAt;
        const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthDiff > monthDiff) {
            data[length - monthDiff - 1] += 1;
        }
    });
    return data;
};
