import { db } from "../utils/db";
import { LoginUserSchemaType, SignupUserSchemaType } from "../utils/schemas";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const userSignupController = async (
  req: SignupUserSchemaType,
  res: Response
) => {
  const { name, email, password } = req.body;
  try {
    let user = await db.user.findUnique({ where: { email } });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    });

    res
      .cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({ message: "User registered successfully" });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const userLoginController = async (req: LoginUserSchemaType, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await db.user.findUnique({ where: { email } });
    console.log(email)
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    });

    return res
      .cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(201) 
      .json({ message: "User logged in successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const userLogoutController = async (req: Request, res: Response) => {
  try {
    res.clearCookie("auth_token").json({ message: "Logged out successfully" });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
