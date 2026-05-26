import { Injectable } from '@nestjs/common';
import type { IProductRepository } from '../repositories/product.repository';
import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class ProductDomainService {
  constructor(private readonly productRepository: IProductRepository) {}

  async createProduct(
    name: string,
    description: string,
    price: number,
    stock: number,
    seller: any,
  ): Promise<ProductEntity> {
    if (!name || name.trim().length === 0) {
      throw new Error('Product name is required');
    }

    if (price < 0) {
      throw new Error('Price cannot be negative');
    }

    if (stock < 0) {
      throw new Error('Stock cannot be negative');
    }

    const product = new ProductEntity({
      name: name.trim(),
      description: description || '',
      price,
      stock,
      seller,
      isActive: true,
    });

    return product;
  }

  async updateProductPrice(
    productId: string,
    newPrice: number,
  ): Promise<ProductEntity> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }

    if (!product.isActive) {
      throw new Error('Cannot update inactive product');
    }

    product.updatePrice(newPrice);
    return product;
  }

  async updateProductStock(
    productId: string,
    quantity: number,
  ): Promise<ProductEntity> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }

    product.updateStock(quantity);
    return product;
  }

  async decreaseStock(productId: string, quantity: number): Promise<void> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }

    product.decreaseStock(quantity);
    await this.productRepository.save(product);
  }

  async increaseStock(productId: string, quantity: number): Promise<void> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }

    product.increaseStock(quantity);
    await this.productRepository.save(product);
  }

  async deactivateProduct(productId: string): Promise<void> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }

    product.deactivate();
    await this.productRepository.save(product);
  }

  async getAvailableProducts(): Promise<ProductEntity[]> {
    return this.productRepository.findActive();
  }

  async getSellerProducts(sellerId: string): Promise<ProductEntity[]> {
    return this.productRepository.findBySellerId(sellerId);
  }

  async searchByPriceRange(
    minPrice: number,
    maxPrice: number,
  ): Promise<ProductEntity[]> {
    return this.productRepository.findByPriceRange(minPrice, maxPrice);
  }
}
