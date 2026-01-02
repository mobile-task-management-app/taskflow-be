export enum PGOperator {
  EQUALS = '=',
  NOT_EQUALS = '<>',
  GT = '>',
  LT = '<',
  GTE = '>=',
  LTE = '<=',
  LIKE = 'LIKE', // Useful for text search
}

export interface PGQueryValue<T = any> {
  value: T;
  operator: PGOperator;
}

export interface PGFilterMetaData {
  column?: string;
  isArrayField?: boolean;
}

export const PG_FILTER_METADATA = Symbol('PG_FILTER_METADATA');
export function PGFilterMetaData(metadata: PGFilterMetaData) {
  return (target: any, propertyKey: string) => {
    if (!metadata.column) {
      metadata.column = propertyKey;
    }
    Reflect.defineMetadata(PG_FILTER_METADATA, metadata, target, propertyKey);
  };
}

export interface PGMetaData {
  column?: string;
}
export const PG_METADATA = Symbol('PG_METADATA');

export function PGMetaData(metadata: PGMetaData) {
  return (target: any, propertyKey: string) => {
    if (!metadata.column) {
      metadata.column = propertyKey;
    }
    Reflect.defineMetadata(PG_METADATA, metadata, target, propertyKey);
  };
}
