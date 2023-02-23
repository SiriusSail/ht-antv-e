import request from '@/utils/request';

const api = {
  getList: '/ddm-iic/sys/sysuser/page',//查询列表
  getRoleList: '/ddm-iic/sys/sysrole/list',//查询列表
  sysdictSave: '/ddm-iic/sys/sysuser',//保存修改删除
  detailUser: '/ddm-iic/sys/sysuser/',//用户详情
}

class Service {

  /**
  * @description get 查询字典列表
 */
  static getList (params: any) {
    return request({
      url: `${api.getList}`,
      method: 'get',
      json: true,
      params
    }).then((res: any) => {
      try {
        if (res.success === true) {
          return Promise.resolve(res)
        }
        return Promise.reject(res)
      } catch (err) {
        console.error(err)
      }
    })
  }/**
  * @description get 查询字典列表
 */
  static detailUser (rowId?: any) {
    return request({
      url: `${api.detailUser}${rowId}`,
      method: 'get',
      json: true,
    }).then((res: any) => {
      try {
        if (res.success === true) {
          return Promise.resolve(res)
        }
        return Promise.reject(res)
      } catch (err) {
        console.error(err)
      }
    })
  }

  /**
   * @description get 查询字典列表
  */
  static getRoleList (params?: any) {
    return request({
      url: `${api.getRoleList}`,
      method: 'get',
      json: true,
      params
    }).then((res: any) => {
      try {
        if (res.success === true) {
          return Promise.resolve(res)
        }
        return Promise.reject(res)
      } catch (err) {
        console.error(err)
      }
    })
  }
  /**
  * @description 保存增删改字典分类
 */
  static multifunction (methods: any, data?: any) {
    return request({
      url: `${api.sysdictSave}`,
      method: methods,
      json: true,
      data
    }).then((res: any) => {
      try {
        if (res.success === true) {
          return Promise.resolve(res)
        }
        return Promise.reject(res)
      } catch (err) {
        console.error(err)
      }
    })
  }

}
export default Service


