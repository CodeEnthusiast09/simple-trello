import { useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  ServerToClientEvents,
  ClientToServerEvents,
} from "@simple-trello/shared";

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const SOCKET_URL = "http://localhost:3000";

export function useSocket() {
  const socketRef = useRef<TypedSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  // Initialize socket connection
  useEffect(() => {
    // Create socket connection
    const socketInstance: TypedSocket = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: true,
    });

    socketRef.current = socketInstance;

    // Connection event handlers
    socketInstance.on("connect", () => {
      console.log("✅ Connected to WebSocket server");
      setIsConnected(true);

      // Get initial tasks when connected
      socketInstance.emit("getTasks", (tasks: Task[]) => {
        console.log("📋 Received initial tasks:", tasks);
        setTasks(tasks);
      });
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Disconnected from WebSocket server");
      setIsConnected(false);
    });

    // Task event listeners
    socketInstance.on("taskCreated", (task: Task) => {
      console.log("✨ Task created:", task);
      setTasks((prev) => [...prev, task]);
    });

    socketInstance.on("taskUpdated", (task: Task) => {
      console.log("📝 Task updated:", task);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    });

    socketInstance.on("taskDeleted", (taskId: string) => {
      console.log("🗑️ Task deleted:", taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    });

    // User presence listeners
    socketInstance.on("userJoined", (userId: string) => {
      console.log("👋 User joined:", userId);
      setOnlineUsers((prev) => [...prev, userId]);
    });

    socketInstance.on("userLeft", (userId: string) => {
      console.log("👋 User left:", userId);
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    socketInstance.on("onlineUsers", (userIds: string[]) => {
      console.log("👥 Online users:", userIds);
      setOnlineUsers(userIds);
    });

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
      socketRef.current = null;
    };
  }, []);

  // Task operations
  const createTask = useCallback((input: CreateTaskInput) => {
    if (!socketRef.current) return;

    socketRef.current.emit("createTask", input, (task: Task) => {
      console.log("✅ Task created successfully:", task);
    });
  }, []);

  const updateTask = useCallback((input: UpdateTaskInput) => {
    if (!socketRef.current) return;

    socketRef.current.emit("updateTask", input, (task: Task) => {
      console.log("✅ Task updated successfully:", task);
    });
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    if (!socketRef.current) return;

    socketRef.current.emit("deleteTask", { id: taskId }, (success: boolean) => {
      console.log("✅ Task deleted successfully:", success);
    });
  }, []);

  return {
    isConnected,
    tasks,
    onlineUsers,
    createTask,
    updateTask,
    deleteTask,
  };
}
