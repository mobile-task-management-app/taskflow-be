export enum TaskStatus {
  TODO = 'TODO', // Changed from NOT_YET to match Postgres
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED', // Added to match the migration
}
