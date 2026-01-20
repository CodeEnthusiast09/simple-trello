import { useStockStream } from "../hooks/useStockStream";
import type { Stock } from "../hooks/useStockStream";

export function StockTicker() {
  const { stocks, isConnected, error } = useStockStream();

  return (
    <div style={{ padding: "20px", fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: "30px" }}>
        <h1>📈 Live Stock Ticker (SSE Demo)</h1>
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
          {error && <div style={{ color: "orange" }}>⚠️ {error}</div>}
        </div>
      </div>

      {/* Stock List */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {stocks.map((stock) => (
          <StockCard key={stock.symbol} stock={stock} />
        ))}
      </div>

      {stocks.length === 0 && isConnected && (
        <div style={{ textAlign: "center", color: "#999", padding: "40px" }}>
          Waiting for stock data...
        </div>
      )}
    </div>
  );
}

// Stock Card Component
interface StockCardProps {
  stock: Stock;
}

function StockCard({ stock }: StockCardProps) {
  const isPositive = stock.change >= 0;

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        border: `2px solid ${isPositive ? "#4CAF50" : "#f44336"}`,
      }}
    >
      {/* Symbol & Name */}
      <div style={{ marginBottom: "10px" }}>
        <h2 style={{ margin: "0 0 5px 0", fontSize: "24px" }}>
          {stock.symbol}
        </h2>
        <div style={{ fontSize: "14px", color: "#666" }}>{stock.name}</div>
      </div>

      {/* Price */}
      <div
        style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "10px" }}
      >
        ${stock.price.toFixed(2)}
      </div>

      {/* Change */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "18px",
          color: isPositive ? "#4CAF50" : "#f44336",
          fontWeight: "bold",
        }}
      >
        <span>{isPositive ? "▲" : "▼"}</span>
        <span>
          {isPositive ? "+" : ""}
          {stock.change.toFixed(2)}
        </span>
        <span>
          ({isPositive ? "+" : ""}
          {stock.changePercent.toFixed(2)}%)
        </span>
      </div>

      {/* Update indicator */}
      <div
        style={{
          marginTop: "10px",
          fontSize: "11px",
          color: "#999",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#00ff00",
            display: "inline-block",
          }}
        />
        <span>Live • Updates every second</span>
      </div>
    </div>
  );
}
