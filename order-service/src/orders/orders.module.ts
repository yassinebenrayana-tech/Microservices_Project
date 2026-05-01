import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'STOCK_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'stock',
          protoPath: join(__dirname, '../stock.proto'),
          url: 'localhost:50051',
        },
      },
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'order',
            brokers: ['localhost:9092'],
          },
          producerOnlyMode: true,
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
