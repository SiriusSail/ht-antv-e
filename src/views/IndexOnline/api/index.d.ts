export type RecommendRquest = {
  description: string;
  flowId: string;
};
export type DomainItem = {
  domainName: string;
  domainValue: string;
  total: string;
};
export type GetDomainTotal = {
  domians: DomainItem[];
  total: string;
};

// api接口
export type RequestParam = {
  description: string;
  name: string;
  type: string;
};

export type ResponseResult = {
  description: string;
  name: string;
  type: string;
};
export type ApiRsponse = {
  url: string;
  desciption: string;
  requestParams: RequestParam[];
  responseResult: ResponseResult[];
};

//计算
export type ExecuteItem = {
  level: string;
  module: string;
  msg: string;
  time: string;
};
export type ExecuteResone = {
  logStr: ExecuteItem[];
};
