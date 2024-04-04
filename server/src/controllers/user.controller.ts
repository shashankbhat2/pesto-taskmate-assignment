import { db } from "../utils/db";
import { Response, Request } from "express";

export const getUserById = async (userId: string) => {
  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.json({ message: "Unauthorized" });
    }
    const user = await db.user.findUnique({ where: { id: req.user.id } });
    res.status(201).json({ user });
  } catch (err: any) {
    console.log(err);
    throw new Error(err);
  }
};
