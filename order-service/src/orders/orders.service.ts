import { Injectable, Inject, OnModuleInit, HttpException, HttpStatus } from '@nestjs/common';
import type { ClientGrpc, ClientKafka } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { lastValueFrom } from 'rxjs';

interface StockService {
  checkAndReserve(data: { productId: number; quantity: number }): any;
}

@Injectable()
export class OrdersService implements OnModuleInit {
  private stockService: StockService;
  private orders: any[] = [];
  private nextId = 1;

  constructor(
    @Inject('STOCK_PACKAGE') private clientGrpc: ClientGrpc,
    @Inject('KAFKA_SERVICE') private clientKafka: ClientKafka,
  ) {}

  onModuleInit() {
    this.stockService = this.clientGrpc.getService<StockService>('StockService');
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    // 1. Call stock-service to check and reserve
    let stockResponse;
    try {
      stockResponse = await lastValueFrom(this.stockService.checkAndReserve({
        productId: createOrderDto.productId,
        quantity: createOrderDto.quantity,
      }));
    } catch (error) {
      throw new HttpException('Failed to contact stock service', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 2. If insufficient stock, throw 400 or 409
    if (!stockResponse.available) {
      throw new HttpException(stockResponse.message, HttpStatus.CONFLICT);
    }

    // 3. Register the order
    const order = {
      id: this.nextId++,
      ...createOrderDto,
      status: 'CREATED',
    };
    this.orders.push(order);

    // 4. Publish Kafka event
    this.clientKafka.emit('order.created', order);

    return order;
  }

  findAll() {
    return this.orders;
  }

  findOne(id: number) {
    return this.orders.find(o => o.id === id);
  }
}
