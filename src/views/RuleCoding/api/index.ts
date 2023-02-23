import request from "@/utils/request";
import * as Element from "element-plus";
import {
  AddIicindCodeRequest,
  GetIicindCodeRequest,
  GetIicindCodeResponse,
  GetIicindCodeInfo,
} from "./index.d";

const { ElMessage } = Element;

class Service {
  static ElMessage = ElMessage;
  /**
   * 获取下拉列表
   * @param params
   * @returns
   */
  static getIicindCodeList(params: GetIicindCodeRequest) {
    return request<GetIicindCodeResponse>({
      url: "/ddm-iic/indFlow/iicindCode/page",
      method: "get",
      params,
      json: true,
    });
  }
  /**
   * 获取列表
   * @param params
   * @returns
   */
  static getIicindCodeListAll(params: GetIicindCodeRequest) {
    return request<GetIicindCodeResponse>({
      url: "/ddm-iic/indFlow/iicindCode/selectExpandPage",
      method: "get",
      params,
      json: true,
    });
  }
  /**
   * 删除
   * @param ids
   * @returns
   */
  static deleteIicindCode(id: string) {
    return request<GetIicindCodeResponse>({
      url: "/ddm-iic/indFlow/iicindCode",
      method: "delete",
      params: { id },
      json: true,
    });
  }
  /**
   * 修改
   * @param data
   * @returns
   */
  static updateIicindCode(data: AddIicindCodeRequest) {
    return request<GetIicindCodeResponse>({
      url: "/ddm-iic/indFlow/iicindCode",
      method: "put",
      data,
      json: true,
    });
  }
  /**
   * 添加
   * @param data
   * @returns
   */
  static addIicindCode(data: AddIicindCodeRequest) {
    return request<GetIicindCodeResponse>({
      url: "/ddm-iic/indFlow/iicindCode",
      method: "post",
      data,
      json: true,
    });
  }

  /**
   * 详情
   * @param rowId
   * @returns
   */
  static getIicindCodeInfo(rowId: string) {
    return request<GetIicindCodeInfo>(
      {
        url: `/ddm-iic/indFlow/iicindCode/${rowId}`,
        method: "get",
        json: true,
      },
      { error: true }
    );
  }
}

export default Service;
