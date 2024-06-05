import { IUser } from "./types";

export interface UserReducerInitialState {
  user: IUser | null;
  loading: boolean;
}
