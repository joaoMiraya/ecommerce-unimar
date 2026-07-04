import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixOrderProductsSchema20260704200000 implements MigrationInterface {
  name = 'FixOrderProductsSchema20260704200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_products"
        ADD COLUMN IF NOT EXISTS "id" uuid DEFAULT uuid_generate_v4(),
        ADD COLUMN IF NOT EXISTS "quantity" int NOT NULL DEFAULT 1,
        ADD COLUMN IF NOT EXISTS "unitPrice" numeric(10,2) NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS "createdAt" timestamp NOT NULL DEFAULT now(),
        ADD COLUMN IF NOT EXISTS "updatedAt" timestamp NOT NULL DEFAULT now()`,
    );

    await queryRunner.query(
      `ALTER TABLE "order_products"
        ALTER COLUMN "id" SET NOT NULL`,
    );

    await queryRunner.query(
      `DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'PK_order_products'
            AND conrelid = '"order_products"'::regclass
        ) THEN
          ALTER TABLE "order_products" DROP CONSTRAINT "PK_order_products";
        END IF;
      END $$`,
    );

    await queryRunner.query(
      `DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'PK_order_products_id'
            AND conrelid = '"order_products"'::regclass
        ) THEN
          ALTER TABLE "order_products"
            ADD CONSTRAINT "PK_order_products_id" PRIMARY KEY ("id");
        END IF;
      END $$`,
    );

    await queryRunner.query(
      `DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'UQ_order_products_order_product'
            AND conrelid = '"order_products"'::regclass
        ) THEN
          ALTER TABLE "order_products"
            ADD CONSTRAINT "UQ_order_products_order_product" UNIQUE ("order_id", "product_id");
        END IF;
      END $$`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'UQ_order_products_order_product'
            AND conrelid = '"order_products"'::regclass
        ) THEN
          ALTER TABLE "order_products" DROP CONSTRAINT "UQ_order_products_order_product";
        END IF;
      END $$`,
    );

    await queryRunner.query(
      `DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'PK_order_products_id'
            AND conrelid = '"order_products"'::regclass
        ) THEN
          ALTER TABLE "order_products" DROP CONSTRAINT "PK_order_products_id";
        END IF;
      END $$`,
    );

    await queryRunner.query(
      `DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'PK_order_products'
            AND conrelid = '"order_products"'::regclass
        ) THEN
          ALTER TABLE "order_products"
            ADD CONSTRAINT "PK_order_products" PRIMARY KEY ("order_id", "product_id");
        END IF;
      END $$`,
    );

    await queryRunner.query(
      `ALTER TABLE "order_products"
        DROP COLUMN IF EXISTS "updatedAt",
        DROP COLUMN IF EXISTS "createdAt",
        DROP COLUMN IF EXISTS "unitPrice",
        DROP COLUMN IF EXISTS "quantity",
        DROP COLUMN IF EXISTS "id"`,
    );
  }
}
