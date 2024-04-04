import { Router } from "express";
import { validateSchema } from "../middleware/schema-validation.middleware";
import { LoginUserSchema, SignupUserSchema } from "../utils/schemas";
import {
  userLoginController,
  userLogoutController,
  userSignupController,
} from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post(
  "/signup",
  validateSchema(SignupUserSchema),
  userSignupController
);

authRouter.post("/login", validateSchema(LoginUserSchema), userLoginController);
authRouter.post("/logout", userLogoutController)


export default authRouter;
