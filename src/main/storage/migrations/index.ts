import { MIGRATION_001_INIT } from './001_init';

export interface Migration {
  id: string;
  sql: string;
}

/** Порядок в массиве = порядок применения. Никогда не менять id уже выпущенной миграции. */
export const MIGRATIONS: Migration[] = [MIGRATION_001_INIT];
