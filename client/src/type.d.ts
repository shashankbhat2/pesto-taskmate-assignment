export interface User {
  id: string;
  email: string;
  name: string;
}
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  loginMutation: UseMutationResult<
    any,
    unknown,
    Parameters<typeof login>,
    unknown
  >;
  logout: () => void;
  signupMutation: UseMutationResult<
    any,
    unknown,
    Parameters<typeof signup>,
    unknown
  >;
}

export enum StatusType {
  TODO = "TODO",
  DOING = "DOING",
  DONE = "DONE",
}

export interface TaskType {
  id: string;
  title: string;
  status: StatusType;
  dueDate: string;
  reminderTime: Date | undefined;
}

export interface NoteType{
  id: string;
  content: string;
}


export interface PaginationProps {
  setCurrentPage: (currentPage: number | ((prev: number) => number)) => void;
  visiblePageNumbers: Array<number>;
  currentPage: number;
  totalPages: number;
  isStatsLoading: boolean;
}
