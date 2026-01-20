import { useEffect, useState } from "react";

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export function useStockStream() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    const connect = () => {
      // Create SSE connection
      eventSource = new EventSource("http://localhost:3000/stocks/stream");

      eventSource.onopen = () => {
        console.log("✅ SSE Connection opened");
        setIsConnected(true);
        setError(null);
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setStocks(data);
        } catch (err) {
          console.error("Failed to parse stock data:", err);
        }
      };

      eventSource.onerror = (err) => {
        console.error("❌ SSE Connection error:", err);
        setIsConnected(false);
        setError("Connection lost. Reconnecting...");

        // EventSource automatically tries to reconnect
        // But we can close and recreate if needed
        eventSource?.close();

        // Retry after 3 seconds
        setTimeout(connect, 3000);
      };
    };

    // Initial connection
    connect();

    // Cleanup on unmount
    return () => {
      console.log("🔌 Closing SSE connection");
      eventSource?.close();
    };
  }, []);

  return { stocks, isConnected, error };
}
