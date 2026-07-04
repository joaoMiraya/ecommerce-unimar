import type { IProductRepository } from '../repositories/product.repository';
import { ProductEntity } from '../entities/product.entity';
import type { UserEntity } from '../../user/entities/user.entity';
import { ProductFiltersRequestDto } from 'src/application/dtos/product/product-filters.dto';
import { PaginatedResult } from 'src/application/dtos/paginated-result.dto';

export class ProductDomainService {
  constructor(private readonly productRepository: IProductRepository) {}

  createProduct(
    name: string,
    description: string,
    price: number,
    stock: number,
    seller: UserEntity,
  ): ProductEntity {
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

  async deactivateProduct(productId: string, userId: string): Promise<void> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }

    if (product.seller.id != userId) {
      throw new Error('Users only can delete your own products');
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

  async searchBy(
    filters: ProductFiltersRequestDto,
  ): Promise<PaginatedResult<ProductEntity>> {
    return this.productRepository.findBy(filters);
  }
}
