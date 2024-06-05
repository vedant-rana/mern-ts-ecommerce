import axios from "axios";
import { UserResponse } from "../../../types/apiTypes";

export const getUser = async (id: string) => {
  try {
    const { data }: { data: UserResponse } = await axios.get(
      `${import.meta.env.VITE_SERVER}/api/v1/users/${id}`
    );
    return data;
  } catch (err) {
    throw err;
  }
};
