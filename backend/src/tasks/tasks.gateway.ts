import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  // ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TasksService } from './tasks.service';
import {
  CreateTaskInput,
  UpdateTaskInput,
  DeleteTaskInput,
  ServerToClientEvents,
  ClientToServerEvents,
} from '@simple-trello/shared';
import { Logger } from '@nestjs/common';

// Type-safe Socket.IO server and socket
type TypedServer = Server<ClientToServerEvents, ServerToClientEvents>;
type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
export class TasksGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: TypedServer; // Socket.io server instance
  logger = new Logger('TasksGateway');

  private connectedUsers: Set<string> = new Set(); // Track who's online

  constructor(private readonly tasksService: TasksService) {}

  handleConnection(client: TypedSocket): void {
    const userId: string = client.id;
    this.connectedUsers.add(userId);

    this.logger.log(`Client connected: ${userId}`);
    this.logger.log(`Total users online: ${this.connectedUsers.size}`);

    this.server.emit('userJoined', userId);
    client.emit('onlineUsers', Array.from(this.connectedUsers));
  }

  handleDisconnect(client: TypedSocket): void {
    const userId: string = client.id;
    this.connectedUsers.delete(userId);

    this.logger.log(`Client disconnected: ${userId}`);
    this.logger.log(`Total users online: ${this.connectedUsers.size}`);

    this.server.emit('userLeft', userId);
  }

  @SubscribeMessage('getTasks')
  handleGetTasks(): ReturnType<typeof this.tasksService.getAllTasks> {
    return this.tasksService.getAllTasks();
  }

  @SubscribeMessage('createTask')
  handleCreateTask(
    @MessageBody() data: CreateTaskInput,
  ): ReturnType<typeof this.tasksService.createTask> {
    try {
      const newTask = this.tasksService.createTask(data);
      this.server.emit('taskCreated', newTask);
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  @SubscribeMessage('updateTask')
  handleUpdateTask(
    @MessageBody() data: UpdateTaskInput,
  ): ReturnType<typeof this.tasksService.updateTask> {
    try {
      const updatedTask = this.tasksService.updateTask(data);

      if (!updatedTask) {
        throw new Error('Task not found');
      }

      this.server.emit('taskUpdated', updatedTask);
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  @SubscribeMessage('deleteTask')
  handleDeleteTask(@MessageBody() data: DeleteTaskInput): boolean {
    try {
      const success = this.tasksService.deleteTask(data.id);

      if (!success) {
        throw new Error('Task not found');
      }

      this.server.emit('taskDeleted', data.id);
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
}
