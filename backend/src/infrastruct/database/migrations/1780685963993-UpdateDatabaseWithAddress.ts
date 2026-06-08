import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDatabaseWithAddress1780685963993
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "address" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "city" varchar(120) NOT NULL,
        "street" varchar NOT NULL,
        "number" varchar NOT NULL,
        "neighborhood" varchar NOT NULL,
        "zipCode" varchar NOT NULL,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "FK_address_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_address_userId" ON "address" ("userId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_address_userId"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "address"`);
  }
}
