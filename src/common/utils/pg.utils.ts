import { instanceToPlain } from 'class-transformer';

import { PGQueryValue } from '../queries/pg.query';

export function buildPGFilterCondition(condition: any) {
  const filter = instanceToPlain(condition, {
    excludeExtraneousValues: true,
  });

  const conditionList: string[] = ['1=1'];
  const args: any[] = [];

  Object.entries(filter).forEach(([k, v]) => {
    // 1. Initial check: ignore undefined, null, or empty strings
    if (v === undefined || v === null || v === '') return;

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
    conditionList.push(`${k} ${operator} $${args.length}`);
  });

  return [conditionList.join(' AND '), args];
}

export function buildUpdateSetClause(data: any, startAt = 1) {
  const dataUpdate = instanceToPlain(data, {
    excludeExtraneousValues: true,
  });

  const setClause: string[] = [];
  const args: any[] = [];

  Object.entries(dataUpdate).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      args.push(v);
      setClause.push(`${k} = $${args.length + (startAt - 1)}`);
    }
  });

  return [setClause.join(', '), args];
}
