export type PageIngReq = {
  limit: number;
  page: number;
};

export interface ListResParent<T> {
  records: T;
  total: number;
}
