import { Response, Request } from "express";
import { db } from "../utils/db";

export const addNoteToTask = async (req: Request, res: Response) => {
  const { content, taskId } = req.body;
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newNote = await db.note.create({
      data: { content: content, taskId: taskId },
    });

    res.status(200).json({ message: "Task deleted", note: newNote });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteNoteFromTask = async (req: Request, res: Response) => {
  const { noteId } = req.params;
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const note = await db.note.findUnique({ where: { id: noteId } });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    await db.note.delete({ where: { id: noteId } });
    res.status(200).json({ message: `Note ${noteId} deleted` });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
