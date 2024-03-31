import { Router } from "express";
import { validateSchema } from "../middleware/schema-validation";
import { LoginUserSchema, SignupUserSchema } from "../utils/schemas";
import {
  userLoginController,
  userSignupController,
} from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post(
  "/signup",
  validateSchema(SignupUserSchema),
  userSignupController
);

authRouter.post("/login", validateSchema(LoginUserSchema), userLoginController);

export default authRouter;
