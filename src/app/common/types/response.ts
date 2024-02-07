export interface SingleObjectOutput<T> {
  message?: string;
  count?: number;
  data: T;
}

export interface ListOutput<T> {
  message?: string;
  data: T[];
}
