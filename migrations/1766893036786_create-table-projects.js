/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const up = (pgm) => {
  // 1. Create the custom ENUM type
  pgm.sql(`
    CREATE TYPE "project_status" AS ENUM (
      'NOT_YET', 
      'IN_PROGRESS', 
      'DONE'
    );
  `);

  // 2. Create the projects table
  pgm.sql(`
    CREATE TABLE "projects" (
      "id" SERIAL PRIMARY KEY,
      "name" VARCHAR(255) NOT NULL,
      "description" TEXT,
      "owner_id" INTEGER NOT NULL,
      "status" "project_status" NOT NULL DEFAULT 'NOT_YET',
      "start_date" TIMESTAMP,
      "end_date" TIMESTAMP,
      "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const down = (pgm) => {
  // Drop table first because it depends on the type
  pgm.sql(`DROP TABLE IF EXISTS "projects";`);
  // Then drop the type
  pgm.sql(`DROP TYPE IF EXISTS "project_status";`);
};
