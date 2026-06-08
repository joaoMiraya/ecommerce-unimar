import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMissingColumnsToLoginSessions20260608100000
  implements MigrationInterface
{
  name = 'AddMissingColumnsToLoginSessions20260608100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "login_sessions"
        ADD COLUMN IF NOT EXISTS "issuedAt" timestamp NOT NULL DEFAULT now(),
        ADD COLUMN IF NOT EXISTS "expiresAt" timestamp NOT NULL DEFAULT now(),
        ADD COLUMN IF NOT EXISTS "lastUsedAt" timestamp`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "login_sessions"
        DROP COLUMN IF EXISTS "lastUsedAt",
        DROP COLUMN IF EXISTS "expiresAt",
        DROP COLUMN IF EXISTS "issuedAt"`,
    );
  }
}
