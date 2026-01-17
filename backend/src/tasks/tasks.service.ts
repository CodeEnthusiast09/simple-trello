import { Injectable } from '@nestjs/common';
import {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  CreateTaskInputSchema,
  UpdateTaskInputSchema,
  DeleteTaskInputSchema,
} from '@simple-trello/shared';
import { randomUUID } from 'crypto';

@Injectable()
export class TasksService {
  // In-memory storage (we'll use a database later if needed)
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  createTask(input: CreateTaskInput): Task {
    // Validate input using Zod
    const validated = CreateTaskInputSchema.parse(input);

    const newTask: Task = {
      id: randomUUID(),
      title: validated.title,
      description: validated.description,
      status: validated.status || 'todo',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.tasks.push(newTask);
    return newTask;
  }

  updateTask(input: UpdateTaskInput): Task | null {
    // Validate input using Zod
    const validated = UpdateTaskInputSchema.parse(input);

    const taskIndex = this.tasks.findIndex((t) => t.id === validated.id);

    if (taskIndex === -1) {
      return null;
    }

    const existingTask = this.tasks[taskIndex];

    const updatedTask: Task = {
      ...existingTask,
      title: validated.title ?? existingTask.title,
      description: validated.description ?? existingTask.description,
      status: validated.status ?? existingTask.status,
      updatedAt: new Date(),
    };

    this.tasks[taskIndex] = updatedTask;
    return updatedTask;
  }

  deleteTask(id: string): boolean {
    // Validate input using Zod
    DeleteTaskInputSchema.parse({ id });

    const taskIndex = this.tasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      return false;
    }

    this.tasks.splice(taskIndex, 1);
    return true;
  }
}
