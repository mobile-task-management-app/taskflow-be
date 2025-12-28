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
