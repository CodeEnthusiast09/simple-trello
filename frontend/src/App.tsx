import { useState } from "react";
import { TaskBoard } from "./components/task-board";
import { StockTicker } from "./components/stock-ticker";
import "./App.css";
import { StoreDemo } from "./components/store-demo";

type View = "tasks" | "stocks" | "zustand";

function App() {
  const [view, setView] = useState<View>("zustand");

  return (
    <div>
      {/* Navigation */}
      <div
        style={{
          padding: "10px 20px",
          backgroundColor: "#333",
          color: "white",
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          onClick={() => setView("tasks")}
          style={{
            padding: "10px 20px",
            backgroundColor: view === "tasks" ? "#4CAF50" : "#555",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          📋 Task Board (WebSockets)
        </button>
        <button
          onClick={() => setView("stocks")}
          style={{
            padding: "10px 20px",
            backgroundColor: view === "stocks" ? "#4CAF50" : "#555",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          📈 Stock Ticker (SSE)
        </button>
        <button
          onClick={() => setView("zustand")}
          style={{
            padding: "10px 20px",
            backgroundColor: view === "zustand" ? "#4CAF50" : "#555",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          🐻 Zustand Demo
        </button>
      </div>

      {/* Content */}
      {view === "tasks" && <TaskBoard />}
      {view === "stocks" && <StockTicker />}
      {view === "zustand" && <StoreDemo />}
    </div>
  );
}

export default App;
