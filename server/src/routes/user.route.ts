import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getMe } from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/me", authMiddleware, getMe);

export default userRouter;
