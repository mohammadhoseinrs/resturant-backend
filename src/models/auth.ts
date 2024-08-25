import { ResultSetHeader, RowDataPacket } from "mysql2";
import { TypeRegister } from "../types";
import db from "./../configs/db";
export const registerUser = async ({
  username,
  password,
  email,
  role,
}: TypeRegister) => {
  try {
    const query =
      "INSERT INTO users (username,email,role,password) VALUES (? , ? ,? , ?)";
    const [data] = await db.query<ResultSetHeader>(query, [
      username,
      email,
      role,
      password,
    ]);

    const selectQuery = "SELECT * FROM users WHERE id = ?";
    const [user] = await db.query<RowDataPacket[]>(selectQuery, [
      data.insertId,
    ]);
    
    return user[0];
  } catch (err) {
    console.log(err);
  }
};

export const getUserByEmail = async (
  email: string
): Promise<TypeRegister | null> => {
  try {
    const query = "SELECT * FROM users WHERE email LIKE ?";
    const [data] = await db.query<RowDataPacket[]>(query, email);
    if (data.length === 0) {
      return null;
    }
    return data[0] as TypeRegister;
  } catch (err) {
    console.log(err);
    throw new Error("Could not fetch user. Please try again later.");
  }
};
