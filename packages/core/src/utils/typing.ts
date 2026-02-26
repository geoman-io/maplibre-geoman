export const typedKeys = <T extends object>(obj: T) => Object.keys(obj) as Array<keyof T>;

export const typedValues = <T extends object>(obj: T): Array<T[keyof T]> => {
  return Object.values(obj) as Array<T[keyof T]>;
};

export const includesWithType = <T extends readonly string[]>(
  value: string,
  validValues: T,
): value is T[number] => validValues.includes(value as T[number]);
