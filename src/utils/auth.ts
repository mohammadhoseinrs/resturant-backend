import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";

export const hashingPassword = async (password: string) => {
  const hashedPassowrd = await hash(password, 10);
  return hashedPassowrd;
};

export const comparePassword = async (pass: string, hashPass: string) => {
  const comparePassword = await compare(pass, hashPass);
  return comparePassword;
};

export const generateAccessToken = (email: string) => {
  try {
    const accessToken = jwt.sign(
      { email },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "15m",
      }
    );

    return accessToken;
  } catch (err) {
    console.log(err);
  }
};

export const generateRefreshToken = (email: string) => {
  const refreshToken = jwt.sign(
    { email },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "15m",
    }
  );
  return refreshToken;
};
