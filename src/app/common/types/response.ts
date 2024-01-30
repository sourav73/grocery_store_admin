export interface SingleObjectOutput<T> {
    message?: string;
    data: T;
}

export interface ListOutput<T> {
    message?: string;
    data: T[];
}