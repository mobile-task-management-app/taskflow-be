import {
  PG_FILTER_METADATA,
  PG_METADATA,
  PGFilterMetaData,
  PGMetaData,
  PGQueryValue,
} from '../queries/pg.query';

export function buildPGFilterCondition(condition: any) {
  const conditionList: string[] = ['1=1'];
  const args: any[] = [];

  Object.entries(condition).forEach(([k, v]) => {
    // 1. Initial check: ignore undefined, null, or empty strings
    if (v === undefined || v === null || v === '') return;
    const metaData: PGFilterMetaData = Reflect.getMetadata(
      PG_FILTER_METADATA,
      condition,
      k,
    );
    if (!metaData) {
      return;
    }
    const column = metaData.column || k;
    let finalValue: any;
    let operator: string = '='; // Default operator

    // 2. Check if it's a PGQueryValue object
    if (
      typeof v === 'object' &&
      v !== null &&
      'operator' in v &&
      'value' in v
    ) {
      const query = v as PGQueryValue;

      // Skip if the internal value is empty
      if (
        query.value === undefined ||
        query.value === null ||
        query.value === ''
      )
        return;

      finalValue = query.value;
      operator = query.operator;
    } else {
      finalValue = v;
    }

    // 4. Build the condition
    args.push(finalValue);
    if (metaData.isArrayField) {
      conditionList.push(`$${args.length} ${operator} ANY(${column})`);
    } else {
      conditionList.push(`${column} ${operator} $${args.length}`);
    }
  });

  return [conditionList.join(' AND '), args];
}

export function buildUpdateSetClause(data: any, startAt = 1) {
  const setClause: string[] = [];
  const args: any[] = [];
  Object.entries(data).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      const metaData: PGMetaData =
        Reflect.getMetadata(PG_METADATA, data, k) || {};
      args.push(v);
      setClause.push(
        `${metaData.column || k} = $${args.length + (startAt - 1)}`,
      );
    }
  });

  return [setClause.join(', '), args];
}
