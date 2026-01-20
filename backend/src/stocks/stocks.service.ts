import { Injectable } from '@nestjs/common';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

@Injectable()
export class StocksService {
  private stocks: Map<string, Stock> = new Map();

  constructor() {
    // Initialize with some stocks
    this.initializeStocks();
  }

  private initializeStocks() {
    const initialStocks: Stock[] = [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 178.5,
        change: 0,
        changePercent: 0,
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        price: 140.25,
        change: 0,
        changePercent: 0,
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corp.',
        price: 380.75,
        change: 0,
        changePercent: 0,
      },
      {
        symbol: 'AMZN',
        name: 'Amazon.com Inc.',
        price: 155.3,
        change: 0,
        changePercent: 0,
      },
      {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        price: 242.8,
        change: 0,
        changePercent: 0,
      },
      {
        symbol: 'META',
        name: 'Meta Platforms',
        price: 485.2,
        change: 0,
        changePercent: 0,
      },
    ];

    initialStocks.forEach((stock) => {
      this.stocks.set(stock.symbol, stock);
    });
  }

  // Generate random price updates
  private updateStockPrice(stock: Stock): Stock {
    const oldPrice = stock.price;

    // Random change between -2% and +2%
    const changePercent = (Math.random() - 0.5) * 4;
    const change = oldPrice * (changePercent / 100);
    const newPrice = parseFloat((oldPrice + change).toFixed(2));

    return {
      ...stock,
      price: newPrice,
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
    };
  }

  // Stream stock updates every second
  streamStockUpdates(): Observable<Stock[]> {
    return interval(1000).pipe(
      map(() => {
        // Update all stocks
        const updatedStocks: Stock[] = [];

        this.stocks.forEach((stock, symbol) => {
          const updated = this.updateStockPrice(stock);
          this.stocks.set(symbol, updated);
          updatedStocks.push(updated);
        });

        return updatedStocks;
      }),
    );
  }

  // Get current stock prices (for initial load)
  getCurrentPrices(): Stock[] {
    return Array.from(this.stocks.values());
  }
}
