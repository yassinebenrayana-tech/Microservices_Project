import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices';

interface StockRequest {
  productId: number;
  quantity: number;
}

interface StockResponse {
  available: boolean;
  message: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod('StockService', 'CheckAndReserve')
  checkAndReserve(data: StockRequest): StockResponse {
    return this.appService.checkAndReserve(data.productId, data.quantity);
  }
}
