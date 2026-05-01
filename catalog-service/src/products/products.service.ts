import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private products: Product[] = [
    { id: 1, name: 'Laptop', price: 1200, stock: 10 },
    { id: 2, name: 'Mouse', price: 25, stock: 50 },
    { id: 3, name: 'Keyboard', price: 100, stock: 100 },
  ];
  private nextId = 4;

  create(createProductDto: CreateProductDto): Product {
    const newProduct: Product = {
      id: this.nextId++,
      ...createProductDto,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: number): Product {
    const product = this.products.find(p => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto): Product {
    const product = this.findOne(id);
    Object.assign(product, updateProductDto);
    return product;
  }

  remove(id: number): void {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    this.products.splice(productIndex, 1);
  }
}
