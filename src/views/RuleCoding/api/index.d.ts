export type GetIicindCodeRequest = {
  pid?: string;
  code?: string;
  enName?: string;
  cnName?: string;
  level?: number;
  limit: number;
  page: number;
};

export type GetIicindCodItem = {
  cnName: string;
  code: string;
  codePath: string;
  enName: string;
  id: number;
  isDeleted: number;
  level: number;
  pid: string;
  rowId: string;
};

export type GetIicindCodeResponse = {
  records: GetIicindCodItem[];
  total: number;
};

export type AddIicindCodeRequest = {
  pid?: string;
  code: string;
  cnName: string;
  enName: string;
  rowId?: string;
};

export type GetIicindCodeInfo = {
  cnName: string;
  code: string;
  codePath: string;
  createBy: string;
  enName: string;
  gmtCreate: string;
  gmtModified: string;
  id: 0;
  isDeleted: 0;
  level: 0;
  modifiedBy: string;
  namePath: string;
  pid: string;
  rowId: string;
};
