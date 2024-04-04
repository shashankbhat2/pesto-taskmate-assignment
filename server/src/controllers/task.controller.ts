import { Response, Request } from "express";
import { db } from "../utils/db";
import { TaskStatus } from "@prisma/client";
import { convertTimeStringToDate } from "../utils";

export const getTasksWithReminderController = async () => {
  try {
    const tasks = await db.task.findMany({
      where: { reminderTime: { not: null } },
      include: { user: true }, 
    });
    const tasksWithUserEmail = tasks.map((task) => {
      return {
        ...task,
        userEmail: task.user.email,
      };
    });

    return tasksWithUserEmail;
  } catch (error: any) {
    console.log(error);
    return [];
  }
};

export const createNewTaskController = async (req: Request, res: Response) => {
  const { title, dueDate, reminderTime, status } = req.body;
  try {
    if (!req.user) {
      return res.json({ message: "Unauthorized" });
    }
    const userId = req.user.id;
    const taskDueDate = dueDate ? new Date(dueDate) : new Date();
    const taskReminderTime = reminderTime
      ? convertTimeStringToDate(reminderTime, dueDate)
      : null;
    const createdTask = await db.task.create({
      data: {
        title: title,
        dueDate: taskDueDate,
        reminderTime: taskReminderTime,
        status: status,
        userId: userId,
      },
    });

    res.status(201).json(createdTask);
  } catch (error: any) {
    console.log(error);
    res.json({ message: "Something went wrong" }).status(500);
  }
};

export const getPaginatedUserTasksController = async (
  req: Request,
  res: Response
) => {
  const page: number = parseInt(req.query.page as string) || 1;
  const pageSize: number = parseInt(req.query.pageSize as string) || 5;
  const searchTerm: string = (req.query.searchTerm as string) || "";
  const filter: TaskStatus | "all" =
    (req.query.filter as TaskStatus | "all") || "all";

  try {
    if (!req.user) {
      return res.json({ message: "Unauthorized" });
    }
    const skip = (page - 1) * pageSize;
    const userId = req.user.id;
    const tasks = await db.task.findMany({
      skip,
      take: pageSize,
      where: {
        userId: userId,
        ...(searchTerm && {
          title: { contains: searchTerm, mode: "insensitive" },
        }),
        ...(filter !== "all" && {
          status: filter,
        }),
      },
      orderBy: { dueDate: "asc" },
    });
    res.json({ tasks: tasks }).status(200);
  } catch (error: any) {
    console.log(error);
    res.json({ message: "Something went wrong" }).status(500);
  }
};

export const getTotalTasksByUserController = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.json({ message: "Unauthorized" });
    }

    const userId: string = req.user.id;
    const pageSize: number = parseInt(req.query.pageSize as string) || 5;
    const totalTasks: number = await db.task.count({
      where: { userId: userId },
    });
    const totalPages: number = Math.ceil(totalTasks / pageSize);

    res.json({ totalPages: totalPages }).status(200);
  } catch (error: any) {
    console.log(error);
    res.json({ message: "Something went wrong" }).status(500);
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  try {
    if (!req.user) {
      return res.json({ message: "Unauthorized" });
    }

    const task = await db.task.findUnique({ where: { id: taskId } });

    if (!task || task.userId !== req.user.id) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
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

    const taskNewDueDate = dueDate ? new Date(dueDate) : new Date();
    const taskNewReminderTime = reminderTime
      ? convertTimeStringToDate(reminderTime, dueDate)
      : null;

    const updatedTask = await db.task.update({
      where: { id: taskId },
      data: {
        title: title || task.title,
        dueDate: taskNewDueDate || task.dueDate,
        reminderTime: taskNewReminderTime || task.reminderTime,
        status: status || task.status,
      },
    });

    res
      .status(200)
      .json({ message: "Sucessfully updated task", taskId: updatedTask.id });
  } catch (error: any) {
    console.error(error);
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
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getAllNotesByTaskId = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const task = await db.task.findUnique({ where: { id: taskId } });

    if (!task || task.userId !== req.user.id) {
      return res.status(404).json({ message: "Task not found" });
    }

    const notes = await db.note.findMany({ where: { taskId: taskId } });

    res.status(200).json(notes);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
