import express from "express";
import userRouter from "./routes/user.route";
import authRouter from "./routes/auth.route";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import taskRouter from "./routes/task.route";
import cors from "cors";
import noteRouter from "./routes/note.route";
import nodemailer from "nodemailer";
import cron from "node-cron";
import { getTasksWithReminderController } from "./controllers/task.controller";

const app = express();
const PORT = process.env.PORT || 4000;

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
};

var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAIL_TRAP_USER,
    pass: process.env.MAIL_TRAP_PASS,
  },
});

cron.schedule('* * * * *', async () => {
  console.log('Checking for tasks to remind...');

  const now = new Date();
  const tasks = await getTasksWithReminderController();

  tasks.forEach(task => {
    if(task.reminderTime){
      const taskTime = task.reminderTime;
    
      if (taskTime.getHours() === now.getHours() && taskTime.getMinutes() === now.getMinutes()) {
        const mailOptions = {
          from: 'yourEmail@gmail.com',
          to: task.userEmail,
          subject: 'Reminder for your task',
          text: `Hi, just a reminder to complete your task: ${task.title}.`
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending reminder email:', error);
          } else {
            console.log('Reminder email sent:', info.response);
          }
        });
      }
  
    }
  });
});

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(morgan("combined"));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Taskmate API" }).status(200);
});

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/tasks", taskRouter);
app.use("/notes", noteRouter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
