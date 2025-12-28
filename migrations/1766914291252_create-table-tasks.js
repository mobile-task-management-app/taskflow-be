/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const up = (pgm) => {
  // 1. Create remaining Enums
  pgm.sql(`
    CREATE TYPE task_status AS ENUM ('TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED');
    CREATE TYPE task_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
  `);

  // 2. Create Tasks Table with category_ids as Integer Array
  pgm.sql(`
    CREATE TABLE tasks (
      id SERIAL PRIMARY KEY,
      project_id INTEGER NOT NULL,
      title VARCHAR(255) NOT NULL,
      status task_status NOT NULL DEFAULT 'TODO',
      priority task_priority NOT NULL DEFAULT 'MEDIUM',
      
      -- Updated: Numeric array for category references
      category_ids INTEGER[] DEFAULT '{}',
      
      -- JSONB for nested attachments
      attachments JSONB NOT NULL DEFAULT '[]',
      
      description TEXT,
      start_date TIMESTAMP WITH TIME ZONE,
      end_date TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Optimized GIN Indexes
  pgm.sql(`
    CREATE INDEX idx_tasks_attachments_gin ON tasks USING GIN (attachments);
    CREATE INDEX idx_tasks_category_ids_gin ON tasks USING GIN (category_ids);
    CREATE INDEX idx_tasks_project_id ON tasks(project_id);
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const down = (pgm) => {
  pgm.sql(`DROP TABLE IF EXISTS tasks;`);
  pgm.sql(`DROP TYPE IF EXISTS task_status;`);
  pgm.sql(`DROP TYPE IF EXISTS task_priority;`);
};
