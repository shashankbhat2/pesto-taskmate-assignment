import { Response, Request } from "express";
import { db } from "../utils/db";

export const createNewTaskController = async (req: Request, res: Response) => {
  const { title, dueDate, reminderTime, status } = req.body;
  try {
    if (!req.user) {
      return res.json({ message: "Unauthorized" });
    }
    const userId = req.user.id;
    const taskDueDate = dueDate ? dueDate : new Date();
    const createdTask = await db.task.create({
      data: {
        title: title,
        dueDate: taskDueDate,
        reminderTime: reminderTime,
        status: status,
        userId: userId,
      },
    });

    res.status(201).json(createdTask);
  } catch (error) {
    console.log(error);
    res.json({ message: "Something went wrong" }).status(500);
  }
};

export const getPaginatedUserTasksController = async (
  req: Request,
  res: Response
) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 5;

  try {
    if (!req.user) {
      return res.json({ message: "Unauthorized" });
    }
    const skip = (page - 1) * pageSize;
    const userId = req.user.id;
    const tasks = await db.task.findMany({
      skip,
      take: pageSize,
      where: { userId: userId },
      orderBy: { dueDate: "asc" },
    });
    res.json({ tasks: tasks }).status(200);
  } catch (error) {
    console.log(error);
    res.json({ message: "Something went wrong" }).status(500);
  }
};

export const updateTaskController = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const { title, dueDate, reminderTime, status } = req.body;

  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const task = await db.task.findUnique({
      where: { id: taskId },
    });

    if (!task || task.userId !== req.user.id) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updatedTask = await db.task.update({
      where: { id: taskId },
      data: {
        title: title || task.title,
        dueDate: dueDate || task.dueDate,
        reminderTime: reminderTime || task.reminderTime,
        status: status || task.status,
      },
    });

    res
      .status(200)
      .json({ message: "Sucessfully updated task", taskId: updatedTask.id });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteTaskController = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const task = await db.task.findUnique({
      where: { id: taskId },
    });

    if (!task || task.userId !== req.user.id) {
      return res.status(404).json({ message: "Task not found" });
    }

    await db.task.delete({
      where: { id: taskId },
    });

    res.status(200).json({ message: "Task deleted", taskId: taskId });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
