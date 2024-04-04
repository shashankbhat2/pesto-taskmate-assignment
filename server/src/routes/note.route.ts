import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { addNoteToTask, deleteNoteFromTask } from "../controllers/note.controller";

const noteRouter = Router();

noteRouter.post("/", authMiddleware, addNoteToTask)
noteRouter.delete("/:noteId", authMiddleware, deleteNoteFromTask)

export default noteRouter;
