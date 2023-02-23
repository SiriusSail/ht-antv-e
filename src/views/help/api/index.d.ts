export type IicindflowPage = {
  limit: number;
  page: number;
  domainCode?: string;
};

export type recordsItem = {
  rowId: string;
  flowType: string;
  status: number;
  code: string;
  name: string;
  topic: string;
  domain: string;
  version: string;
  startDate: string;
  flowStatus: number;
  flowLevel: string;
  hasHistoryVersion: true;
};
export type IicindflowPageRespone = {
  records: recordsItem[];
  total: 63;
};
