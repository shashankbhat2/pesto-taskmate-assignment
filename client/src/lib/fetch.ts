import { StatusType, TaskType } from "@/type";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = await fetch(`${BASE_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("Login failed");
  return response.json();
};

export const signup = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await fetch(`${BASE_API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, email, password }),
  });
  if (!response.ok) {
    console.log(response)
    if (response.status === 400) {
      throw new Error("Email already exists");
    } else {
      throw new Error("Signup failed");
    }
  }

  return response.json();
};

export const fetchAuthenticatedUser = async () => {
  const response = await fetch(`${BASE_API_URL}/user/me`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Me failed");
  return response.json();
};

export const fetchPaginatedUserTasks = async ({
  page,
  pageSize,
  searchTerm,
  filter = "all",
}: {
  page: number;
  pageSize: number;
  searchTerm: string;
  filter?: StatusType | "all";
}) => {
  const response = await fetch(
    `${BASE_API_URL}/tasks/all?page=${page}&pageSize=${pageSize}&searchTerm=${searchTerm}&filter=${filter}`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Tasks failed");
  return response.json();
};

export const fetchUserTaskStats = async (pageSize: number) => {
  const response = await fetch(
    `${BASE_API_URL}/tasks/count?pageSize=${pageSize}`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Tasks failed");
  return response.json();
};

export const logout = async () => {
  const response = await fetch(`${BASE_API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Logout failed");
  return response.json();
};

export const updateTaskStatus = async ({
  taskId,
  status,
}: {
  taskId: string;
  status: string;
}) => {
  const response = await fetch(`${BASE_API_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error("Update task status failed");
  return response.json();
};

export const getNotesByTaskId = async (taskId: string | null) => {
  if (taskId === null) {
    return;
  }
  const response = await fetch(`${BASE_API_URL}/tasks/${taskId}/notes`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Get notes by task id failed");
  return response.json();
};

export const addNewNote = async ({
  content,
  taskId,
}: {
  content: string;
  taskId: string;
}) => {
  const response = await fetch(`${BASE_API_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ content, taskId }),
  });
  if (!response.ok) throw new Error("Add new note failed");
  return response.json();
};

export const deleteNote = async (noteId: string) => {
  const response = await fetch(`${BASE_API_URL}/notes/${noteId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Delete note failed");
  return response.json();
};

export const updateTask = async ({
  taskId,
  title,
  dueDate,
  reminderTime,
}: any) => {
  const response = await fetch(`${BASE_API_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ title, dueDate, reminderTime }),
  });
  if (!response.ok) throw new Error("Update task status failed");
  return response.json();
};

export const addNewTask = async ({
  title,
  dueDate,
  reminderTime,
}: {
  title: string;
  dueDate: string;
  reminderTime: string;
}) => {
  const response = await fetch(`${BASE_API_URL}/tasks/new`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ title, dueDate, reminderTime }),
  });
  if (!response.ok) throw new Error("Add new task failed");
  return response.json();
};

export const deleteTask = async (taskId: string) => {
  const response = await fetch(`${BASE_API_URL}/tasks/${taskId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Delete task failed");
  return response.json();
};

export const getTaskById = async (taskId: string | null) => {
  if (taskId === null) {
    return;
  } else {
    const response = await fetch(`${BASE_API_URL}/tasks/${taskId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Get task by id failed");
    return response.json();
  }
};
