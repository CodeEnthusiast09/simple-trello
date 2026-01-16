import { z } from "zod";
export declare const TaskSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["todo", "in-progress", "done"]>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    status: "todo" | "in-progress" | "done";
    createdAt: Date;
    updatedAt: Date;
    description?: string | undefined;
}, {
    id: string;
    title: string;
    status: "todo" | "in-progress" | "done";
    createdAt: Date;
    updatedAt: Date;
    description?: string | undefined;
}>;
export type Task = z.infer<typeof TaskSchema>;
export declare const CreateTaskInputSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["todo", "in-progress", "done"]>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    status: "todo" | "in-progress" | "done";
    description?: string | undefined;
}, {
    title: string;
    description?: string | undefined;
    status?: "todo" | "in-progress" | "done" | undefined;
}>;
export declare const UpdateTaskInputSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["todo", "in-progress", "done"]>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    title?: string | undefined;
    description?: string | undefined;
    status?: "todo" | "in-progress" | "done" | undefined;
}, {
    id: string;
    title?: string | undefined;
    description?: string | undefined;
    status?: "todo" | "in-progress" | "done" | undefined;
}>;
export declare const DeleteTaskInputSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export type CreateTaskInput = z.infer<typeof CreateTaskInputSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskInputSchema>;
export type DeleteTaskInput = z.infer<typeof DeleteTaskInputSchema>;
export interface ServerToClientEvents {
    taskCreated: (task: Task) => void;
    taskUpdated: (task: Task) => void;
    taskDeleted: (taskId: string) => void;
    userJoined: (userId: string) => void;
    userLeft: (userId: string) => void;
    onlineUsers: (userIds: string[]) => void;
}
export interface ClientToServerEvents {
    createTask: (data: CreateTaskInput, callback: (task: Task) => void) => void;
    updateTask: (data: UpdateTaskInput, callback: (task: Task) => void) => void;
    deleteTask: (data: DeleteTaskInput, callback: (success: boolean) => void) => void;
    getTasks: (callback: (tasks: Task[]) => void) => void;
}
