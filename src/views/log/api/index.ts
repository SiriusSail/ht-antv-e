import request from '@/utils/request';

class Service {

  /**
  * @description get列表
 */
  static getList (params: any) {
    return request({
      url: `/ddm-iic/sys/iicsyslog/page`,
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
}
export default Service


