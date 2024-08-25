import { Request, Response } from "express";
import { getUserByEmail, registerUser } from "../models/auth";
import { TypeRegister } from "../types";
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  hashingPassword,
} from "../utils/auth";
import refreshTokens from "../utils/tokenStore";
import path from "path";

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

    refreshTokens[refreshToken] = username;
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
    return res.status(200).json({ user, accessToken });
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        message: "You don't have an account",
      });
    }
    const isPasswordOk = await comparePassword(password, user.password);
    if (!isPasswordOk) {
      return res.status(400).json({
        message: "The password is not correct",
      });
    }
    const accessToken = generateAccessToken(user.email);
    const refreshToken = generateRefreshToken(user.email);
    refreshTokens[refreshToken] = email;

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
    return res.status(200).json({ user, accessToken });
  } catch (err) {
    return res.status(500).json(err);
  }
};
