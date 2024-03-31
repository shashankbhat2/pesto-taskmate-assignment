import express from "express";
import userRouter from "./routes/user.route";
import authRouter from "./routes/auth.route";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import taskRouter from "./routes/task.route";

const app = express();
const PORT = process.env.PORT || 4000;


app.use(cookieParser());
app.use(morgan("combined"))

app.use(express.json());

app.get("/", (req, res) => {
  res.json({message: "Welcome to Taskmate API"}).status(200)
});

app.use("/user", userRouter)
app.use("/auth", authRouter)
app.use("/tasks", taskRouter)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
