export type RecommendationType = {
  id: number;
  createBy: string;
  gmtCreate: string;
  modifiedBy: string;
  gmtModified: string;
  isDeleted: number;
  rowId: string;
  contributeType: number;
  refId: string;
  refName: string;
};

export type KnowledgeType = {};

export type DevType = {
  id: number;
  createBy: string;
  gmtCreate: string;
  modifiedBy: string;
  gmtModified: string;
  isDeleted: number;
  rowId: string;
  contributeType: number;
  refId: string;
  refName: string;
};

export interface ListType<T> {
  records: T;
  total: number;
}

export type ListParams = {
  limit: number;
  page: number;
};

export type TopType = {
  id: number;
  createUsername: string;
  createBy: string;
  gmtCreate: string;
  modifiedBy: string;
  gmtModified: string;
  isDeleted: number;
  rowId: string;
  summaryPoints: number;
  devPoints: number;
  recommendationPoints: number;
  knowledgePoints: number;
  isCurrentUser: true;
  rank?: number; //排行
};

export type TopListParams = 0 | 1 | 2 | 3;
