export interface BaseResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timeStamp: string;
  meta?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}
