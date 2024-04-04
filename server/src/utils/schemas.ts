import { z } from "zod";

export const SignupUserSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Not a valid email"),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters")
      .max(14, "Password must be less than 14 characters"),
  }),
});

export const LoginUserSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Not a valid email"),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters")
      .max(14, "Password must be less than 14 characters"),
  }),
});

export const CreateTaskSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Title is required" }),
    status: z.enum(["TODO", "DOING", "DONE"]).optional(),
    dueDate: z.string().optional().or(z.literal(null)),
    reminderTime: z.string().optional().or(z.literal(null)),
  }),
});

export const GetPaginatedUserTasksSchema = z.object({
  query: z.object({
    page: z.string(),
    pageSize: z.string(),
  }),
});

export const UpdateTaskSchema = z.object({
  params: z.object({ taskId: z.string() }),
  body: z.object({
    title: z.string().optional(),
    status: z.enum(["TODO", "DOING", "DONE"]).optional(),
    dueDate: z.string().optional().or(z.literal(null)).optional(),
    reminderTime: z.string().optional().or(z.literal(null)).optional(),
  }),
});

export const DeleteTaskSchema = z.object({
  params: z.object({ taskId: z.string() }),
});

export type SignupUserSchemaType = z.infer<typeof SignupUserSchema>;
export type LoginUserSchemaType = z.infer<typeof LoginUserSchema>;
