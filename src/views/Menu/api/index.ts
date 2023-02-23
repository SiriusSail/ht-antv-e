import request from '@/utils/request';

const api = {
  getList: '/ddm-iic/sys/sysmenu/page',//查询列表
  sysdictSave: '/ddm-iic/sys/sysmenu',//保存修改删除
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

  /**
 * @description 获取菜单树
*/
  static getTree () {
    return request({
      url: `/ddm-iic/sys/sysmenu/tree`,
      method: 'get',
      json: true
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


