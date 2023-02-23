import request from '@/utils/request';

const api = {
  sysdict: '/ddm-iic/sys/sysdict/list/types',//查询字典分类列表
  getList: '/ddm-iic/sys/sysdict/page',//查询字典列表
  sysdictSave: '/ddm-iic/sys/sysdict',//保存字典分类
}

class Service {
  /**
   * @description get 查询字典分类列表
  */
  static getSysdictList () {
    return request({
      url: `${api.sysdict}`,
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


