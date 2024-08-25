import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRouter from './routers/auth'
dotenv.config();
const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/auth',authRouter)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("something broke!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is connected to port ${process.env.PORT}`);
});
