import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { validateSchema } from "../middleware/schema-validation.middleware";
import {
  CreateTaskSchema,
  DeleteTaskSchema,
  GetPaginatedUserTasksSchema,
  UpdateTaskSchema,
} from "../utils/schemas";
import {
  createNewTaskController,
  deleteTaskController,
  getAllNotesByTaskId,
  getPaginatedUserTasksController,
  getTaskById,
  getTotalTasksByUserController,
  updateTaskController,
} from "../controllers/task.controller";

const taskRouter = Router();
taskRouter.get("/count", authMiddleware, getTotalTasksByUserController);
taskRouter.get("/:taskId/notes", authMiddleware, getAllNotesByTaskId)
taskRouter.post(
  "/new",
  authMiddleware,
  validateSchema(CreateTaskSchema),
  createNewTaskController
);
taskRouter.get(
  "/all",
  authMiddleware,
  validateSchema(GetPaginatedUserTasksSchema),
  getPaginatedUserTasksController
);
taskRouter.put(
  "/:taskId",
  authMiddleware,
  validateSchema(UpdateTaskSchema),
  updateTaskController
);
taskRouter.delete(
  "/:taskId",
  authMiddleware,
  validateSchema(DeleteTaskSchema),
  deleteTaskController
);
taskRouter.get("/:taskId", authMiddleware, getTaskById)
export default taskRouter;
