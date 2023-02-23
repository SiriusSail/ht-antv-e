import request, { $request } from "@/utils/request";
import * as Element from "element-plus";
import sysdict from "@/publicApi/sysdict";
import type { IicindflowPage, IicindflowPageRespone } from "./index.d";
const { ElMessage } = Element;

// 列表类型
type ResultList = {
  current: number;
  hitCount: boolean;
  optimizeCountSql: boolean;
  orders: any[];
  pages: number;
  records: {
    createBy: string;
    forHelpBy: string;
    forHelpById: string;
    forHelpDomain: string;
    forHelpType: string;
    gmtCreate: string;
    gmtModified: string;
    helpBy: string;
    helpById: string;
    id: number;
    isDeleted: number;
    modifiedBy: string;
    rowId: string;
    status: "1";
    title: string;
  }[];
  searchCount: boolean;
  size: number;
  total: number;
};

export type GetmyForHelpTypeResponse = {
  [key in string]: number;
};

//添加帮助类型
export type HelpRequest = {
  id: number; //帮助人id
  helpBy: string; // 帮助人
  helpById: string | number; // 帮助人
  title: string; // 标题
  forHelpDomain: string; //求助领域
  forHelpType: string; // 求助类型(0=组件求助，1=指标开发求助，2=普通求助，3=需求任务求助)
  helpDetailDTO: {
    //求助明细
    attachmentPath: string; //附件路径
    messageContent: string;
  };
  status: string; //状态(0=暂存，1=发起求助，2=沟通中，3=未解决，4=已解决，5=拒绝);
};

type updateHelpRequest = HelpRequest & { rowId: string };

type HelpListResponse = {};

//列表 类型
type listRequest = {
  limit: number;
  page: number;
  title: string;
  order?: string;
  orderField?: string;
};
type selectType = {
  createBy: string;
  description: string;
  dictLabel: string;
  dictType: string;
  dictValue: string;
  gmtCreate: string;
  gmtModified: string;
  id: number;
  isDeleted: number;
  modifiedBy: string;
  orderNum: number;
  remark: string;
  rowId: string;
};
export type Recommendation = {
  departmentId: string;
  gender: number;
  gmtCreate: string;
  gmtModified: string;
  id: number;
  isDeleted: number;
  loginId: string;
  loginName: string;
  rowId: string;
  userCode: string;
  userLabels: string;
};

//详情
export type GetMessageInfo = {
  helpInfo: {
    createBy: string;
    forHelpBy: string;
    forHelpById: string;
    forHelpDomain: string;
    forHelpType: string;
    gmtCreate: string;
    gmtModified: string;
    helpBy: string;
    id: number;
    isDeleted: string;
    modifiedBy: string;
    rowId: string;
    status: string;
    title: string;
  };
  detailList: {
    attachmentPath: string;
    replier: string;
    createBy: string;
    gmtCreate: string;
    gmtModified: string;
    helpId: string;
    id: number;
    isDeleted: number;
    messageContent: string;
    modifiedBy: string;
    rowId: string;
  }[];
};
type UpdateStatusRquest = {
  rowId: string;
  status: string;
};

class Service {
  /**
   * 首次添加帮助
   * @param data
   * @returns
   */
  static ElMessage = ElMessage;
  static addHelp(data: HelpRequest) {
    return request<any>({
      url: "/ddm-iic/help/iichelp",
      method: "post",
      data: data,
      json: true,
    });
  }

  /**
   *修改求助
   * @param data
   * @returns
   */
  static updateHelp(data: updateHelpRequest) {
    return request<any>({
      url: "/ddm-iic/help/iichelp",
      method: "put",
      data: data,
      json: true,
    });
  }

  /**
   *  获取我的求助列表
   * @param data
   * @returns
   */
  static getForHelpList(data: listRequest) {
    return request<ResultList>({
      url: "/ddm-iic/help/iichelp/forhelp/page",
      method: "get",
      params: data,
      json: true,
    });
  }

  /**
   * 获取我的帮助列表
   * @param data
   * @returns
   */
  static getHelpList(data: listRequest) {
    return request<ResultList>({
      url: `/ddm-iic/help/iichelp/help/page`,
      method: "get",
      params: data,
      json: true,
    });
  }

  //附件上传
  static attachmentUpload(data: FormData) {
    return request<string>({
      url: `/ddm-iic/help/iichelp/attachmentUpload`,
      method: "post",
      contentType: "multipart/form-data",
      data: data,
      json: false,
    });
  }
  //下载文件
  static attachmentDownload(path: string) {
    return $request({
      url: "/ddm-iic/help/iichelp/attachmentDownload",
      method: "get",
      params: {
        path,
      },
      responseType: "blob",
      json: true,
    });
  }

  /**
   * 根据求助类型和领域推荐用户列表（限制10个）
   * @param data
   * @returns
   */
  static recommendationList(data: { area: string; type: string }) {
    return request<Recommendation[]>({
      url: `/ddm-iic/sys/sysuser/recommendation/list`,
      method: "get",
      params: data,
      json: true,
    });
  }

  /**
   * 查询列表
   *
   * @param id
   * @returns
   */
  static getQueryList() {
    return request<HelpListResponse>({
      url: `/ddm-iic/help/iichelp/list`,
      method: "get",
      json: true,
    });
  }

  // =========================== 统计====================================

  /**
   * 我的求助统计，分类展示：指标求助、组件求助、其他。
   * @returns
   */

  static getMyForHelpType() {
    return request<GetmyForHelpTypeResponse>({
      url: `/ddm-iic/help/iichelp/myForHelpType`,
      method: "get",
      json: true,
    });
  }

  /**
   * 
    我的帮助统计，分类展示：指标求助、组件求助、其他。
   * @returns 
   */
  static getMyHelpType() {
    return request<GetmyForHelpTypeResponse>({
      url: `/ddm-iic/help/iichelp/myHelpType`,
      method: "get",
      json: true,
    });
  }

  /**
   * 完成情况统计
   * /ddm-iic/help/iichelp/filished
   * @returns
   */
  static getFilished() {
    return request<GetmyForHelpTypeResponse>({
      url: "/ddm-iic/help/iichelp/finished",
      method: "get",
      json: true,
    });
  }

  /**
   * 未完成统计
   * @returns
   */
  static getUnFilished() {
    return request<GetmyForHelpTypeResponse>({
      url: "/ddm-iic/help/iichelp/unFinished",
      method: "get",
      json: true,
    });
  }

  // ===================================详情========================================

  /**
   * 详情回复
   * @param data
   * @returns
   */
  static iichelpdetail(data: {
    componentIds: string;
    componentNames: string;
    helpId: string;
    messageContent: string;
    indicatorsIds: string;
    indicatorsNames: string;
  }) {
    return request<any>({
      url: "/ddm-iic/help/iichelpdetail",
      method: "post",
      data: data,
      json: true,
    });
  }

  /**
   *  求助详情信息，展示某个求助的所有详情
   * @param id
   * @returns
   */
  static getMessageInfo(id: number | string) {
    return request<GetMessageInfo>({
      url: `/ddm-iic/help/iichelp/${id}`,
      method: "get",
      json: true,
    });
  }

  //===================获取类型=============

  /**
   * 获取领域
   * @returns
   */
  static getDomain = sysdict.getDomain;

  /**
   *获取求助类型
   * @returns
   */
  static getForHelpType() {
    return request<selectType[]>({
      url: `/ddm-iic/help/iichelp/forHelpType`,
      method: "get",
      json: true,
    });
  }

  // 修改状态
  static updateStatus(data: UpdateStatusRquest) {
    return request<any>({
      url: `/ddm-iic/help/iichelp/updateStatus`,
      method: "post",
      json: true,
      data,
    });
  }

  //指标推荐使用
  static iicindflowPage(params: IicindflowPage) {
    return request<IicindflowPageRespone>(
      {
        url: `/ddm-iic/indFlow/iicindflow/page`,
        method: "get",
        json: true,
        params,
      },
      { error: true }
    );
  }
}

export default Service;
