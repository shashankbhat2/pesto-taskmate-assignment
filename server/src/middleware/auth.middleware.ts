import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getUserById } from "../controllers/user.controller";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies["auth_token"]; // Assuming your token is stored in a cookie named 'auth_token'
  console.log("Token:", token);
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as {
      user: { id: string };
    };
    const user = await getUserById(decodedToken.user.id);

    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    (req as Request).user = user;
    next();
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(401).json({ error: "Invalid token" });
  }
}
