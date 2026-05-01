import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { HttpService } from '@nestjs/axios';
import { Product } from './models/product.model';
import { Order } from './models/order.model';
import { lastValueFrom } from 'rxjs';

@Resolver()
export class QueryResolver {
  constructor(private httpService: HttpService) {}

  @Query(() => [Product])
  async products(): Promise<Product[]> {
    const response = await lastValueFrom(this.httpService.get<Product[]>('http://localhost:3000/products'));
    return response.data;
  }

  @Query(() => [Order])
  async orders(): Promise<Order[]> {
    const response = await lastValueFrom(this.httpService.get<Order[]>('http://localhost:3001/orders'));
    return response.data;
  }

  @Query(() => Order, { nullable: true })
  async orderById(@Args('id', { type: () => ID }) id: string): Promise<Order> {
    const response = await lastValueFrom(this.httpService.get<Order>(`http://localhost:3001/orders/${id}`));
    return response.data;
  }
}
