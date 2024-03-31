import { db } from "../utils/db";

export const getUserById = async (userId: string) => {
  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getMe = async (userId: string) => {
  try {
    const user = await db.user.findUnique({where: {id: userId}})
    return user
  } catch(err: any) {
    console.log(err)
    throw new Error(err)
  }
}
