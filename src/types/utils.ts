export type WithPrefixedKeys<T, P extends string> = {
  [K in keyof T as `${P}${Extract<K, string>}`]: T[K];
};
