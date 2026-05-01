import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // Simple local memory stock
  private stockMap = new Map<number, number>();

  constructor() {
    // Initializing some dummy stock
    this.stockMap.set(1, 10); // Product ID 1 has 10 units
    this.stockMap.set(2, 50); // Product ID 2 has 50 units
    this.stockMap.set(3, 100); // Product ID 3 has 100 units
  }

  checkAndReserve(productId: number | string, quantity: number) {
    const id = Number(productId);
    const currentStock = this.stockMap.get(id) || 0;

    if (currentStock >= quantity) {
      this.stockMap.set(id, currentStock - quantity);
      return { available: true, message: 'Stock successfully reserved' };
    }

    return { available: false, message: 'Insufficient stock' };
  }
}
