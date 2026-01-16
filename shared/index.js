"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteTaskInputSchema = exports.UpdateTaskInputSchema = exports.CreateTaskInputSchema = exports.TaskSchema = void 0;
const zod_1 = require("zod");
exports.TaskSchema = zod_1.z.object({
    id: zod_1.z.string(),
    title: zod_1.z.string().min(1, "Title is required"),
    description: zod_1.z.string().optional(),
    status: zod_1.z.enum(["todo", "in-progress", "done"]),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.CreateTaskInputSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    status: zod_1.z.enum(["todo", "in-progress", "done"]).default("todo"),
});
exports.UpdateTaskInputSchema = zod_1.z.object({
    id: zod_1.z.string(),
    title: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional(),
    status: zod_1.z.enum(["todo", "in-progress", "done"]).optional(),
});
exports.DeleteTaskInputSchema = zod_1.z.object({
    id: zod_1.z.string(),
});
//# sourceMappingURL=index.js.map