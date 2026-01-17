import { useState } from "react";
import { useSocket } from "../hooks/useSocket";
import type { Task } from "@simple-trello/shared";

export function TaskBoard() {
  const {
    isConnected,
    tasks,
    onlineUsers,
    createTask,
    updateTask,
    deleteTask,
  } = useSocket();

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTaskTitle.trim()) return;

    createTask({
      title: newTaskTitle,
      description: newTaskDescription || undefined,
      status: "todo",
    });

    setNewTaskTitle("");
    setNewTaskDescription("");
  };

  const handleStatusChange = (task: Task, newStatus: Task["status"]) => {
    updateTask({
      id: task.id,
      status: newStatus,
    });
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask(taskId);
    }
  };

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: "30px" }}>
        <h1>🚀 Simple Trello</h1>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <div>
            Status:{" "}
            <span
              style={{
                color: isConnected ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
            </span>
          </div>
          <div>
            👥 Online Users: <strong>{onlineUsers.length}</strong>
          </div>
          <div>
            📋 Total Tasks: <strong>{tasks.length}</strong>
          </div>
        </div>
      </div>

      {/* Create Task Form */}
      <div
        style={{
          marginBottom: "30px",
          padding: "20px",
          border: "2px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h2>➕ Create New Task</h2>
        <form onSubmit={handleCreateTask}>
          <div style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Task title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <textarea
              placeholder="Task description (optional)..."
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              rows={3}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "14px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontFamily: "system-ui, sans-serif",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!isConnected || !newTaskTitle.trim()}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: isConnected ? "#4CAF50" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isConnected ? "pointer" : "not-allowed",
            }}
          >
            Create Task
          </button>
        </form>
      </div>

      {/* Task Columns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "20px",
        }}
      >
        {/* TODO Column */}
        <TaskColumn
          title="📝 To Do"
          status="todo"
          tasks={getTasksByStatus("todo")}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteTask}
        />

        {/* IN PROGRESS Column */}
        <TaskColumn
          title="🔨 In Progress"
          status="in-progress"
          tasks={getTasksByStatus("in-progress")}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteTask}
        />

        {/* DONE Column */}
        <TaskColumn
          title="✅ Done"
          status="done"
          tasks={getTasksByStatus("done")}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteTask}
        />
      </div>
    </div>
  );
}

// Task Column Component
interface TaskColumnProps {
  title: string;
  status: Task["status"];
  tasks: Task[];
  onStatusChange: (task: Task, newStatus: Task["status"]) => void;
  onDelete: (taskId: string) => void;
}

function TaskColumn({
  title,
  // status,
  tasks,
  onStatusChange,
  onDelete,
}: TaskColumnProps) {
  return (
    <div
      style={{
        backgroundColor: "#f5f5f5",
        padding: "15px",
        borderRadius: "8px",
        minHeight: "400px",
      }}
    >
      <h3 style={{ marginTop: 0 }}>
        {title} ({tasks.length})
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        ))}
        {tasks.length === 0 && (
          <div style={{ textAlign: "center", color: "#999", padding: "20px" }}>
            No tasks yet
          </div>
        )}
      </div>
    </div>
  );
}

// Task Card Component
interface TaskCardProps {
  task: Task;
  onStatusChange: (task: Task, newStatus: Task["status"]) => void;
  onDelete: (taskId: string) => void;
}

function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps) {
  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "15px",
        borderRadius: "6px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <h4 style={{ margin: "0 0 8px 0" }}>{task.title}</h4>
      {task.description && (
        <p style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#666" }}>
          {task.description}
        </p>
      )}

      <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
        <select
          value={task.status}
          onChange={(e) =>
            onStatusChange(task, e.target.value as Task["status"])
          }
          style={{
            padding: "5px",
            fontSize: "12px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button
          onClick={() => onDelete(task.id)}
          style={{
            padding: "5px 10px",
            fontSize: "12px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          🗑️ Delete
        </button>
      </div>

      <div style={{ fontSize: "11px", color: "#999" }}>
        Created: {new Date(task.createdAt).toLocaleString()}
      </div>
    </div>
  );
}
