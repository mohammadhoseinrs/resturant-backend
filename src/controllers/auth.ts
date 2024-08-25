import { Request, Response } from "express";
import { getUserByEmail, registerUser } from "../models/auth";
import { TypeRegister } from "../types";
import {
  generateAccessToken,
  generateRefreshToken,
  hashingPassword,
} from "../utils/auth";
import refreshTokens from "../utils/tokenStore";

export const register = async (
  req: Request<{}, {}, TypeRegister>,
  res: Response
): Promise<Response> => {
  try {
    const { username, password, email, role } = req.body;
    if (!username || !password || !email) {
      return res.status(401).json({
        message: "Please fill all of the field",
      });
    }
    const isUserAvailable = await getUserByEmail(email);
    if (isUserAvailable) {
      return res.status(402).json({
        message: "You have an account,Please login",
      });
    }

    const hashPssword = await hashingPassword(password);
    const user = await registerUser({
      username,
      password: hashPssword,
      email,
      role,
    });

    if (!user) {
      return res.status(404).json({
        message: "the user is not available",
      });
    }

    const accessToken = generateAccessToken(user.email);
    const refreshToken = generateRefreshToken(user.email);
    console.log({ accessToken, refreshToken });

    refreshTokens[refreshToken] = username;
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
    return res.status(200).json({ user, accessToken });
  } catch (err) {
    return res.status(500).json(err);
  }
};
