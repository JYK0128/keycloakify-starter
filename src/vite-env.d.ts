/// <reference types="vite/client" />
/// <reference types="./index.d.ts" />

/* Env 타입 */
type ImportMetaEnv = object;
interface ImportMeta {
  readonly env: ImportMetaEnv
}

/* LITERAL 타입 */
type ToPascal<S extends string> =
    S extends `${infer First}_${infer Rest}`
      ? `${Capitalize<Lowercase<First>>}${ToPascal<Rest>}`
      : Capitalize<Lowercase<S>>;
type ToHandler<S extends string> =
      S extends `${infer First}_${infer Rest}`
        ? `on${Capitalize<Lowercase<First>>}${ToPascal<Rest>}`
        : `on${Capitalize<Lowercase<S>>}`;

/* Helper 타입 */
type Primitive = string | number | boolean;
type Literal<T> = T extends string ? string extends T ? never : T : never;
type Tuple<T> = T extends [] ? [] : T extends [infer First, ...infer Rest] ? [First, ...Tuple<Rest>] : never;
type Nullish<T> = T | undefined | null;
type Nullable<T> = T | null;
type Optional<T> = T | undefined;
type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
};
type ValueOf<T, R extends keyof T = keyof T> = {
  [K in keyof T]: T[K]
}[R];
type KeyOf<T, V = unknown> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[Extract<keyof T, string>];
type Mandatory<T, K extends keyof T = keyof T>
= Required<Pick<T, K>> & Omit<T, K>;

/* Object 변형 타입 */
type Entry<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T];
type Pair<T, U = 'id', V = undefined> = {
  [K in keyof T]: { [key in U]: K } &
    (V extends undefined
      ? { value: Nullable<ValueOf<T, K>> }
      : V)
}[keyof T];

/* Action 변형 타입 */
type Action<T> = {
  [K in keyof T]: T[K] extends never ?
    { action: K, payload?: undefined }
    : { action: K, payload: T[K] }
}[keyof T];
type ActionFn<T> = {
  [K in keyof T as ToHandler<K>]: T[K] extends never
    ? (payload?: undefined) => void
    : (payload?: T[K]) => void
};
type ActionResolver<T> = (action: Action<T>) => () => void;

/* Props 추론 타입 */
type HandlerProps<T> = {
  [K in keyof T as K extends `on${Capitalize<string>}` ? K : never]: Optional<T[K]>
};
type ValueProps<T> = {
  [K in keyof T as K extends `on${Capitalize<string>}` | 'children' ? never : K]?: Optional<T[K]>
};
type ExecutionHandlers<T extends unknown[]> = {
  callback: (...params: T) => void
  fallback: (err: unknown) => void
  cleanup: () => void
};
