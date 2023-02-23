import { PageIngReq, ListResParent } from "./common";
export type ListReq = PageIng & { name: string };
export type DataItem = {
  choose: number;
  createBy: string;
  description: string;
  gmtCreate: string;
  gmtModified: string;
  id: number;
  isDeleted: number;
  modifiedBy: string;
  name: string;
  rowId: string;
  status: number;
  thumbnail: string;
};
export type ListRes = ListResParent<DataItem[]>;
export type InfoRes = {
  card_content: any;
  id: number;
  name: string;
  row_id: string;
};
