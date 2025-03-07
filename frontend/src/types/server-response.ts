export type HTTPServerResponse<T> = {
    code: number;
    message: string;
    data: T;
    [key: string]: any;
};
