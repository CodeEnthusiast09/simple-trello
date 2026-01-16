import { z } from "zod";

// ============================================
// Task Schema & Types
// ============================================

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "done"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Task = z.infer<typeof TaskSchema>;

// ============================================
// WebSocket Event Schemas
// ============================================

// Client -> Server events
export const CreateTaskInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "done"]).default("todo"),
});

export const UpdateTaskInputSchema = z.object({
  id: z.string(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "done"]).optional(),
});

export const DeleteTaskInputSchema = z.object({
  id: z.string(),
});

// Infer types
export type CreateTaskInput = z.infer<typeof CreateTaskInputSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskInputSchema>;
export type DeleteTaskInput = z.infer<typeof DeleteTaskInputSchema>;

// ============================================
// Server -> Client events
// ============================================

export interface ServerToClientEvents {
  taskCreated: (task: Task) => void;
  taskUpdated: (task: Task) => void;
  taskDeleted: (taskId: string) => void;
  userJoined: (userId: string) => void;
  userLeft: (userId: string) => void;
  onlineUsers: (userIds: string[]) => void;
}

// ============================================
// Client -> Server events
// ============================================

export interface ClientToServerEvents {
  createTask: (data: CreateTaskInput, callback: (task: Task) => void) => void;
  updateTask: (data: UpdateTaskInput, callback: (task: Task) => void) => void;
  deleteTask: (
    data: DeleteTaskInput,
    callback: (success: boolean) => void,
  ) => void;
  getTasks: (callback: (tasks: Task[]) => void) => void;
}
