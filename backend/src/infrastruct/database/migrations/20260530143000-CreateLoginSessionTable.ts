import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLoginSessionTable20260530143000 implements MigrationInterface {
  name = 'CreateLoginSessionTable20260530143000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "login_sessions" (
        "id"                    uuid      PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId"                uuid      NOT NULL,
        "accessToken"           varchar   NOT NULL,
        "issuedAt"              timestamp NOT NULL,
        "accessTokenExpiresAt"  timestamp NOT NULL,
        "refreshTokenValue"     text      NOT NULL,
        "refreshTokenExpiresAt" timestamp NOT NULL,
        "refreshTokenCreatedAt" timestamp NOT NULL,
        "lastUsedAt"            timestamp,
        "ipAddress"             varchar(15),
        "userAgent"             varchar(500),
        "isActive"              boolean   NOT NULL DEFAULT true,
        "createdAt"             timestamp NOT NULL DEFAULT now(),
        "updatedAt"             timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "FK_login_sessions_user"
          FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )`,
    );

    // Índices para performance
    await queryRunner.query(
      `CREATE INDEX "IDX_login_sessions_userId_isActive" ON "login_sessions" ("userId", "isActive")`,
    );

    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_login_sessions_refreshTokenValue" ON "login_sessions" ("refreshTokenValue")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_login_sessions_accessTokenExpiresAt" ON "login_sessions" ("accessTokenExpiresAt")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_login_sessions_refreshTokenExpiresAt" ON "login_sessions" ("refreshTokenExpiresAt")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_login_sessions_refreshTokenExpiresAt"`,
    );

    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_login_sessions_accessTokenExpiresAt"`,
    );

    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_login_sessions_refreshTokenValue"`,
    );

    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_login_sessions_userId_isActive"`,
    );

    await queryRunner.query(`DROP TABLE IF EXISTS "login_sessions"`);
  }
}
