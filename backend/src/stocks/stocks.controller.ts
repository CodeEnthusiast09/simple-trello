import { Controller, Get, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StocksService, Stock } from './stocks.service';

interface MessageEvent {
  data: string | object;
  id?: string;
  type?: string;
  retry?: number;
}

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  // Regular HTTP endpoint - get current prices
  @Get()
  getCurrentPrices(): Stock[] {
    return this.stocksService.getCurrentPrices();
  }

  // SSE endpoint - stream live updates
  @Sse('stream')
  streamStockPrices(): Observable<MessageEvent> {
    return this.stocksService.streamStockUpdates().pipe(
      map((stocks) => ({
        data: stocks,
      })),
    );
  }
}
