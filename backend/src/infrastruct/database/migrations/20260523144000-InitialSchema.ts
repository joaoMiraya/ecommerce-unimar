import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema20260523144000 implements MigrationInterface {
  name = 'InitialSchema20260523144000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query(
      `CREATE TYPE "order_status_enum" AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED')`,
    );

    await queryRunner.query(
      `CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar(120) NOT NULL,
        "email" varchar NOT NULL,
        "password" varchar NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now()
      )`,
    );

    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_users_email" ON "users" ("email")`,
    );

    await queryRunner.query(
      `CREATE TABLE "products" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar(255) NOT NULL,
        "description" text NOT NULL,
        "price" numeric(10,2) NOT NULL,
        "stock" int NOT NULL DEFAULT 0,
        "isActive" boolean NOT NULL DEFAULT true,
        "seller_id" uuid,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "FK_products_seller" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE SET NULL
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE "orders" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "buyer_id" uuid,
        "totalPrice" numeric(12,2) NOT NULL,
        "status" "order_status_enum" NOT NULL DEFAULT 'PENDING',
        "shippingAddress" text,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "FK_orders_buyer" FOREIGN KEY ("buyer_id") REFERENCES "users"("id") ON DELETE SET NULL
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE "order_products" (
        "order_id" uuid NOT NULL,
        "product_id" uuid NOT NULL,
        CONSTRAINT "PK_order_products" PRIMARY KEY ("order_id", "product_id"),
        CONSTRAINT "FK_order_products_order" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_order_products_product" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE
      )`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_order_products_order" ON "order_products" ("order_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_order_products_product" ON "order_products" ("product_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_order_products_product"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_order_products_order"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "order_products"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "orders"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "products"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_email"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "order_status_enum"`);
  }
}
