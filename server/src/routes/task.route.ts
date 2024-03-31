import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { validateSchema } from "../middleware/schema-validation";
import { CreateTaskSchema, DeleteTaskSchema, GetPaginatedUserTasksSchema, UpdateTaskSchema } from "../utils/schemas";
import { createNewTaskController, deleteTaskController, getPaginatedUserTasksController, updateTaskController } from "../controllers/task.controller";

const taskRouter = Router();

taskRouter.post("/", authMiddleware, validateSchema(CreateTaskSchema), createNewTaskController)
taskRouter.get("/all", authMiddleware, validateSchema(GetPaginatedUserTasksSchema), getPaginatedUserTasksController)
taskRouter.put("/:taskId", authMiddleware, validateSchema(UpdateTaskSchema), updateTaskController)
taskRouter.delete("/:taskId", authMiddleware, validateSchema(DeleteTaskSchema), deleteTaskController)

export default taskRouter;