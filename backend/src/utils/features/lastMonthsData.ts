import { Document } from "mongoose";

interface MyDocument extends Document {
  createdAt: Date;
}

type FuncProps = {
  length: number;
  docArr: MyDocument[];
  today: Date;
};

export const lastMonthsData = ({ length, docArr, today }: FuncProps) => {
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
