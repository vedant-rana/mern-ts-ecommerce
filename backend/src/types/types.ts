import { NextFunction, Response, Request } from "express";

export interface NewUserRequestBody {
  name: string;
  email: string;
  photo: string;
  gender: string;
  role: string;
  dob: Date;
  _id: string;
}

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export interface NewProductRequestBody {
  name: string;
  price: number;
  stock: number;
  category: string;
}
