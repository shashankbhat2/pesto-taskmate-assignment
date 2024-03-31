import { db } from "../utils/db";
import { LoginUserSchemaType, SignupUserSchemaType } from "../utils/schemas";
import bctypt from "bcrypt";
import { Response } from "express";
import jwt from "jsonwebtoken";

export const userSignupController = async (
  req: SignupUserSchemaType,
  res: Response
) => {
  const { name, email, password } = req.body;
  try {
    let user = await db.user.findUnique({ where: { email } });
    if (user) {
      return res.json({ message: "User already exists" }).status(400);
    }

    const salt = await bctypt.genSalt(10);
    const hashedPassword = await bctypt.hash(password, salt);
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

export const userLoginController = async (
  req: LoginUserSchemaType,
  res: Response
) => {
  const { email, password } = req.body;
  try {
    let user = await db.user.findUnique({ where: { email } });
    if (!user) {
      res.json({ message: "Invalid credentials" }).status(400);
    }

    const isMatch = bctypt.compare(password, user?.password!);
    if (!isMatch) {
      res.json({ message: "Invalid credentials" }).status(400);
    }

    const payload = {
      user: {
        id: user?.id,
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
      .json({ message: "User loggedin successfully" });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
