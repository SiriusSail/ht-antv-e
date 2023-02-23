// 字典表API

import request from "@/utils/request";

// 类型
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

class Service {
  /**
   * 获取领域
   * @returns
   */
  static getDomain() {
    return request<selectType[]>({
      url: `/ddm-iic/sys/sysdict/domain`,
      method: "get",
      json: true,
    });
  }

  /**
   * 字典表-指标类型
   * @returns
   */
  static getFlowType() {
    return request<selectType[]>({
      url: `/ddm-iic/sys/sysdict/flowType`,
      method: "get",
      json: true,
    });
  }
}

export default Service;
