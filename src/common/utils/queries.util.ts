import { PGOperator, PGQueryValue } from '../queries/pg.query';

export const parseRangeInput = (
  input: string,
): PGQueryValue<Date> | undefined => {
  if (!input) return undefined;
  const prefix = input.charAt(0);
  const rawValue = input.slice(1);
  const unixTimestamp = Number(rawValue);
  if (isNaN(unixTimestamp)) return undefined;

  const date = new Date(unixTimestamp * 1000);

  if (prefix === '+') {
    return { value: date, operator: PGOperator.GTE };
  } else if (prefix === '-') {
    return { value: date, operator: PGOperator.LTE };
  }

  // Fallback if no prefix is provided (default to Equals)
  return { value: new Date(Number(input) * 1000), operator: PGOperator.EQUALS };
};
