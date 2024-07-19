import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from './routes/user.route.js';
import authRoutes from "./routes/auth.route.js";
import cookieParser from 'cookie-parser';


const app = express();
app.use(express.json()); // this is going to allow json as the input of the backend.
dotenv.config();


mongoose
  .connect(process.env.MONGOOSE)
  .then(() => console.log("Database is connected"))
  .catch((err) => {
    console.log(err);
  });

app.use(cookieParser())
  app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

app.get("/", (req, res) => {
  res.send("Hello World");
  
});

app.use('/api/user/', userRoutes);
app.use('/api/auth', authRoutes)


app.use((err, req, res, next)=>{
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success : false,
    statusCode,
    message
  });
});