import request, { $request } from "@/utils/request";
import * as Element from "element-plus";
import axiosApiHooks from "@/hooks/axiosApiHooks/index";
import sysdict from "@/publicApi/sysdict";
import type {
  RecommendRquest,
  GetDomainTotal,
  ApiRsponse,
  ExecuteResone,
} from "./index.d";

const { ElMessage } = Element;

export type tableResult = {
  code: string;
  createBy: string;
  domain: string;
  flowLevel: string;
  flowStatus: number;
  flowType: number;
  gmtCreate: string;
  gmtModified: string;
  hasHistoryVersion: boolean;
  id: number;
  modifiedBy: string;
  name: string;
  rowId: string;
  startDate: string;
  topic: string;
  version: string;
  operation?: boolean;
  index: number | string;
  historyVersion: tableResult[];
  showChildren?: boolean;
};
type ResultList = {
  current: number;
  hitCount: boolean;
  optimizeCountSql: boolean;
  orders: any[];
  pages: number;
  records: tableResult[];
  searchCount: boolean;
  size: number;
  total: number;
};

export type Definition = {
  analyticalMethod: string;
  analyticalType: string;
  code: string;
  dataEngineer: string;
  dataFrom: string;
  dataManager: string;
  defContent: string;
  depart: string;
  domain: string;
  fetchType: string;
  formula: string;
  gradation: string[];
  id: number;
  name: string;
  onlineStage: string;
  owner: string;
  rowId: string;
  scriptStr: string;
  topic: string;
  warnRule: string;
};

export type Solidify = {
  createBy: string;
  cron: string;
  cycleType: number;
  day: string;
  gmtCreate: string;
  gmtModified: string;
  healthStatus: number;
  id: number;
  lastSyncTime: string;
  modifiedBy: string;
  month: string;
  nextSyncTime: string;
  repeatInterval: number;
  repeatTimes: number;
  rowId: string;
  syncEnable: number;
  time: string | Date;
  week: string;
  flowId: string;
};

//= ==========模型===============

// 数据源
export type DataSources = {
  rowId: string;
  sourceName: string;
  sourceType: string;
};
//
export type InputFields = {
  dimension: string;
  desc: string;
  isVariable: boolean;
};
//
export type Modifications = {
  dimension: string;
  modification: string;
};

// 输入
type Detailinputs = {
  nodes: {
    dataSources: {
      nodes: DataSources[];
    };
    inputFields: {
      nodes: InputFields[];
    };
    modifications: {
      nodes: Modifications[];
    };
  }[];
};

// 公式 或者图片
export type Detailprocess = {
  processType: number;
  value: string;
};
// 输出
export type DetailoutputFields = {
  aliasName: string;
  name: string;
  paramType: string;
};

// 权限
export type Detailrights = {
  dept: string;
  effectiveRule: string;
  rightRule: string;
  role: string;
};

// 模型
export type Detail = {
  inputs: Detailinputs;
  outputFields: {
    nodes: DetailoutputFields[];
  };
  process: {
    nodes: Detailprocess[];
  };
  rights: {
    nodes: Detailrights[];
  };
};

//
export type Nodes = {
  nodeId: string;
  nodeName: string;
  noteType: number;
};
export type Relations = {
  fromId: string;
  fromType: number;
  toId: string;
  toType: number;
};

export type Blood = {
  nodes: Nodes[];
  relations: Relations[];
};
export type Rule = {
  code: string;
  codeType: number;
  description: string;
  serialNum: string;
};

export type DomainNode = {
  domain: string;
  rowId: string;
  total: number;
  totalComplex: number;
  totalExtend: number;
  totalOnline: number;
  totalOrigin: number;
};
export type DomainRelation = {
  fromId: string;
  toId: string;
  weightVal: number;
};
export type Domain = {
  nodes: DomainNode[];
  relations: DomainRelation[];
};

export type getIicindflowPageQuery = {
  domainCode?: string;
  flowType?: string;
  name?: string;
  code?: string;
  flowAttr?: string;
  parentId?: string;
};
export type EditSolidify = {
  flowId: string; // 指标id
  syncEnable: number; // 启用状态
  repeatTimes: 1; // 重复次数
  repeatInterval: 60; // 重复间隔时间
  cycleType: number; // 执行type 1.每年 2.每月 3.每周 4.每天 5.自定义"
  month?: string; // 月
  day?: string; // 天
  week?: string; // 周
  time?: string; // 小时分钟秒
};

export type GetIndexCardInfo = {
  cardContent: string;
  createBy: string;
  flowids: string;
  gmtCreate: string;
  gmtModified: string;
  id: number;
  isDeleted: number;
  modifiedBy: string;
  name: string;
  rowId: string;
  status: 1;
};
export type CardItem = {
  cardContent: string;
  createBy: string;
  description: string;
  flowIds: string;
  gmtCreate: string;
  gmtModified: string;
  id: number;
  isDeleted: number;
  modifiedBy: string;
  name: string;
  rowId: string;
  status: number;
  options: any;
};
// export type GetCardDetail = {
//   ;
// };

class Service {
  static ElMessage = ElMessage;

  /**
   * 统计类型:1.领域 2.流程
   * 指标总览（领域）
   * @returns
   */
  static getDomainList(type: 1 | 2) {
    return request<Domain>({
      url: "/ddm-iic/flowManager/iicindflowdverview/domain/list",
      method: "get",
      params: {
        type,
      },
      json: true,
    });
  }

  // /**
  //  * 指标总览（分流程）
  //  * @returns
  //  */
  // static getDimensionList() {
  //   return request<Domain>({
  //     url: "/ddm-iic/flowManager/iicindflowdverview/dimension/list",
  //     method: "get",
  //     json: true,
  //   });
  // }

  // 1.原子指标，2.衍生指标，3.复合指标，4.修饰词
  static getRule(codeType: number) {
    return request<Rule[]>({
      url: "/ddm-iic/indFlow/iicindCode/list",
      method: "get",
      params: {
        codeType,
      },
      json: true,
    });
  }

  /**
   * 台账分页
   * /ddm-iic/indFlow/iicindflow/page
   * @param data
   * @returns
   */
  static getIicindflowPage(
    data: {
      limit: number;
      page: number;
    } & getIicindflowPageQuery
  ) {
    return request<ResultList>({
      url: "/ddm-iic/indFlow/iicindflow/page",
      method: "get",
      params: data,
      json: true,
    });
  }

  /**
   *  获取指标定义
   * @param id
   * @returns
   */
  static getDefinition(id: number | string) {
    return request<Definition>({
      url: `/ddm-iic/indFlow/iicindflowdetail/definition/${id}`,
      method: "get",
      json: true,
    });
  }

  /**
   *  获取指标模型
   * @param id
   * @returns
   */
  static getDetail(id: number | string) {
    return request<Detail>({
      url: `/ddm-iic/flowManage/iicindflowmodel/detail/${id}`,
      method: "get",
      json: true,
    });
  }

  /**
   * 获取指标固化
   * @param id
   * @returns
   */
  static getSolidify(id: number | string) {
    return request<Solidify>({
      url: `/ddm-iic/indFlow/iicindflowsync/solidify/${id}`,
      method: "get",
      json: true,
    });
  }

  /**
   * 编辑固化
   *
   *
   */
  static editSolidify(data: EditSolidify) {
    return request<any>({
      url: `/ddm-iic/indFlow/iicindflowsync/edit`,
      method: "post",
      data,
      json: true,
    });
  }

  /**
   * 获取指标血缘
   * @param id
   * @returns
   */
  static getBlood(id: number | string) {
    return request<Blood>({
      url: `/ddm-iic/flowManage/detail/blood/${id}`,
      method: "get",
      json: true,
    });
  }

  /**
   * 获取指标血缘
   * @param id
   * @returns
   */
  static useGetBlood = axiosApiHooks((id: number | string) =>
    request<Blood>({
      url: `/ddm-iic/flowManage/detail/blood/${id}`,
      method: "get",
      json: true,
    })
  );

  /**
   *
   *获取领域
   * @static
   * @memberof Service
   */
  static getDomain = sysdict.getDomain;

  /**
   *
   *字典表-指标类型
   * @static
   * @memberof Service
   */
  static getFlowType = sysdict.getFlowType;

  /**
   * 得到卡片的详情信息(含指标列表、输入输出参数)
   * @param id
   * @returns
   */
  static getCardDetail(id: string | number) {
    return request<CardItem[]>({
      url: `/ddm-iic/indicatorCard/iicindindicatorcardpublish/getCardDataByIndId/${id}`,
      method: "get",
      json: true,
    });
  }

  /**
   * /ddm-iic/indicatorCard/iicindindicatorcardpublish/publish/
   * 发布
   * @param flowId
   * @returns
   */

  static IndexCardPublish(data: any) {
    return request<any>({
      url: `/ddm-iic/indicatorCard/iicindindicatorcardpublish/publish`,
      method: "post",
      data,
      json: true,
    });
  }

  /**
   * 归档
   * @returns
   */
  static closeAndBackUp(rowId: string) {
    return request<any>(
      {
        url: `/ddm-iic/indFlow/iicindflow/closeAndBackUp`,
        method: "post",
        data: {
          rowId,
        },
        json: true,
      },
      { success: true, error: true }
    );
  }

  /**
   *发布api
   * @param rowId
   * @returns
   */
  static releaseApi(rowId: string) {
    return request<any>({
      url: `/ddm-iic/indFlow/iicindflow/releaseApi`,
      method: "post",
      data: {
        rowId,
      },
      json: true,
    });
  }

  static recommend(data: RecommendRquest) {
    return request<any>(
      {
        url: `/ddm-iic/flowManage/detail/recommend`,
        method: "post",
        data,
        json: true,
      },
      { success: true, error: true }
    );
  }

  // 指标计算
  static execute(id: string) {
    return request<ExecuteResone>(
      {
        url: `/ddm-iic/flow/ddmflow/execute/${id}`,
        method: "get",
        json: true,
      },
      { success: false, error: true }
    );
  }

  //   领域分布统计
  static getDomainTotal() {
    return request<GetDomainTotal>(
      {
        url: `/ddm-iic/summary/getDomainTotal`,
        method: "get",
        json: true,
      },
      { error: true }
    );
  }

  // API调用
  static apiRquest(rowId: string) {
    return request<any>(
      {
        url: `/ddm-iic/flow/manage/api/info/${rowId}`,
        method: "get",
        json: true,
      },
      { error: true }
    );
  }

  // API详情
  static ApiInfo(rowId: string) {
    return request<ApiRsponse>({
      url: `/ddm-iic/flow/manage/api/info/${rowId}`,
      method: "get",
      json: true,
    });
  }

  // API列表
  static ApiList() {
    return request<any>({
      url: `/ddm-iic/flow/manage/api/list`,
      method: "get",
      json: true,
    });
  }

  //下载指标模板下载
  static attachmentDownload() {
    return $request({
      url: "/ddm-iic/flow/ddmflow/demandTemplateDownload",
      method: "get",
      responseType: "blob",
      json: true,
    });
  }
  static export(params: any) {
    return $request({
      url: "/ddm-iic/indFlow/iicindflow/export",
      method: "get",
      responseType: "blob",
      params: params,
      json: true,
    });
  }
}

export default Service;
