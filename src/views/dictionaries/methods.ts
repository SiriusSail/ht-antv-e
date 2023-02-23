import Service from './api/index'

class Methods {
  // 获取弹出层类型数据
  getList (comState: any, tableData: any = [], delField: any) {
    comState.isLoading = true
    const res: any = Service.getList(delField(comState))
    tableData = res.result.records
    comState.total = res.result.total
    setTimeout(() => {
      comState.isLoading = false
    }, 300)
  }
}

let methods: Methods
methods = new Methods()

export default methods