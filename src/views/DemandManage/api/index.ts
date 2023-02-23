import request, { $request } from "@/utils/request";

export type DeliveryStateProps = {
  xy: { [key: string]: string };
  delay: string;
  dueSoon: string;
};

const api = {
  getList: "/ddm-iic/dem/demand/page", // 需求看板列表
  exportExcel: "/ddm-iic/dem/demand/exportExcel", // 导出需求单
  importExcel: "/ddm-iic/dem/demand/importExcel", // 导入需求单
  sysdictSave: "/ddm-iic/dem/demandschedule", //保存字典分类
  schedule: "/ddm-iic/dem/demandschedule/page", //排期列表
  demandTemplate: "/ddm-iic/dem/demand/demandTemplate", //需求模板数据
  addDemand: "/ddm-iic/dem/demand", //创建需求
  detail: "/ddm-iic/dem/demand/queryDemandItemList", //需求详情
  editStates: "/ddm-iic/dem/demand/updateDemandState", //修改状态
  getUserList: "/ddm-iic/sys/sysuser/list", //获取所有用户列表
  getDemandList: "/ddm-iic/dem/demand/list", //需求信息集合
  demandaccountList: "/ddm-iic/dem/demandaccount/page", //需求信息集合
  demandReviewState: "/ddm-iic/dem/demand/demandReviewState", //过审状态
};

class Service {
  /**
   * @description get 排期列表
   */
  static getscheduleList(params: any) {
    return request({
      url: `${api.schedule}`,
      method: "get",
      json: true,
      params,
    }).then((res: any) => {
      try {
        if (res.success === true) {
          return Promise.resolve(res);
        }
        return Promise.reject(res);
      } catch (err) {
        console.error(err);
      }
    });
  }
  /**
   * @description get 台账列表
   */
  static demandaccountList(params: any) {
    return request({
      url: `${api.demandaccountList}`,
      method: "get",
      json: true,
      params,
    }).then((res: any) => {
      try {
        if (res.success === true) {
          return Promise.resolve(res);
        }
        return Promise.reject(res);
      } catch (err) {
        console.error(err);
      }
    });
  }

  /**
   * @description get 需求看板列表
   */
  static getList(params: any) {
    return request({
      url: `${api.getList}`,
      method: "get",
      json: true,
      params,
    }).then((res: any) => {
      try {
        if (res.success === true) {
          return Promise.resolve(res);
        }
        return Promise.reject(res);
      } catch (err) {
        console.error(err);
      }
    });
  }
  /**
   * @description post 导出
   */
  static exportExcel(data?: any) {
    return request({
      url: `${api.exportExcel}`,
      method: "get",
      json: false,
      params: data,
      contentType: "application/msexcel",
      responseType: "blob",
    }).then((res: any) => {
      try {
        if (res.success === true) {
          return Promise.resolve(res);
        }
        return Promise.reject(res);
      } catch (err) {
        console.error(err);
      }
    });
  }
  /**
   * @description post 导入
   */
  static importExcel(data?: any) {
    return request({
      url: `${api.importExcel}`,
      method: "post",
      json: true,
      data,
    }).then((res: any) => {
      try {
        if (res.success === true) {
          return Promise.resolve(res);
        }
        return Promise.reject(res);
      } catch (err) {
        console.error(err);
      }
    });
  }

  /**
   * @description 保存增删改字典分类
   */
  static multifunction(methods: any, data?: any) {
    return request({
      url: `${api.sysdictSave}`,
      method: methods,
      json: true,
      data,
    }).then((res: any) => {
      try {
        if (res.success === true) {
          return Promise.resolve(res);
        }
        return Promise.reject(res);
      } catch (err) {
        console.error(err);
      }
    });
  }
  /**
   * @description 需求模板数据
   */
  static getDemandTemplate() {
    return request({
      url: `${api.demandTemplate}`,
      method: "post",
      json: true,
    }).then((res: any) => {
      try {
        if (res.success === true) {
          return Promise.resolve(res);
        }
        return Promise.reject(res);
      } catch (err) {
        console.error(err);
      }
    });
  }
  /**
   * @description 需求模板数据
   */
  static detail(data: any) {
    return request({
      url: `${api.detail}`,
      method: "get",
      json: true,
      params: data,
    }).then((res: any) => {
      try {
        if (res.success === true) {
          return Promise.resolve(res);
        }
        return Promise.reject(res);
      } catch (err) {
        console.error(err);
      }
    });
  }

  /**
   * @description 需求模板数据
   */
  static addDemand(method: any, data: any) {
    return request({
      url: `${api.addDemand}`,
      method: method,
      json: true,
      data,
    }).then((res: any) => {
      try {
        if (res.success === true) {
          return Promise.resolve(res);
        }
        return Promise.reject(res);
      } catch (err) {
        console.error(err);
      }
    });
  }
  /**
   * @description 需求模板数据
   */
  static editStates(data: any) {
    return request({
      url: `${api.editStates}`,
      method: "get",
      json: true,
      params: data,
    }).then((res: any) => {
      try {
        if (res.success === true) {
          return Promise.resolve(res);
        }
        return Promise.reject(res);
      } catch (err) {
        console.error(err);
      }
    });
  }
  /**
   * @description 获取用户列表
   */
  static getUserList(data?: any) {
    return request({
      url: `${api.getUserList}`,
      method: "get",
      json: true,
      params: data,
    }).then((res: any) => {
      try {
        if (res.success === true) {
          return Promise.resolve(res);
        }
        return Promise.reject(res);
      } catch (err) {
        console.error(err);
      }
    });
  }

  /**
   * @description 需求信息集合
   */
  static getDemandList(data?: any) {
    return request({
      url: `${api.getDemandList}`,
      method: "get",
      json: true,
      params: data,
    }).then((res: any) => {
      try {
        if (res.success === true) {
          return Promise.resolve(res);
        }
        return Promise.reject(res);
      } catch (err) {
        console.error(err);
      }
    });
  }
  /**
   * @description 需求信息集合
   */
  static getReviewState(data?: any) {
    return request({
      url: `${api.demandReviewState}`,
      method: "get",
      json: true,
      params: data,
    }).then((res: any) => {
      try {
        if (res.success === true) {
          return Promise.resolve(res);
        }
        return Promise.reject(res);
      } catch (err) {
        console.error(err);
      }
    });
  }

  /**
   * @description get 设置基本信息
   */
  static postSetBasicInfo(id?: any) {
    return request({
      url: `/ddm-iic/sys/sysuser/detail`,
      method: "get",
      json: true,
    }).then((res: any) => {
      try {
        if (res.success === true) {
          return Promise.resolve(res);
        }
        return Promise.reject(res);
      } catch (err) {
        console.error(err);
      }
    });
  }
  /**
   * @description POST 合并排期
   */
  static merge(data?: any) {
    return request({
      url: `/ddm-iic/dem/demandschedule/merge`,
      method: "post",
      json: true,
      data,
    }).then((res: any) => {
      try {
        if (res.success === true) {
          return Promise.resolve(res);
        }
        return Promise.reject(res);
      } catch (err) {
        console.error(err);
      }
    });
  }

  // 需求单
  static deliveryState() {
    return request<DeliveryStateProps>(
      {
        url: `/ddm-iic/dem/demand/deliveryState`,
        method: "get",
        json: true,
      },
      { error: true }
    );
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
}

export default Service;
