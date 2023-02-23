import { reactive } from 'vue'
export default function (fun?: any) {
  const comState = reactive<any>({
    pagination: {
      pageSizes: [10, 20, 30, 40, 50, 100],
      page: 1,
      limit: 10,
      total: 0,
      hideOnSinglePage: false,
      layout: 'total, sizes, prev, pager, next, jumper',
    },
    isLoading: false,
  })

  const handleSizeChange = (val: any) => {
    comState.pagination.limit = val;
    fun()
  }
  const handleCurrentChange = (val: any) => {
    comState.pagination.page = val
    fun()
  }


  // 优化查询字段
  const delField = (obj?: any) => {
    let objItem = JSON.parse(JSON.stringify(obj))
    Object.keys(objItem).map((item) => {
      if (objItem[item] === '' || objItem[item] === null || objItem[item] === undefined) delete objItem[item]
      if (item === 'pageSizes') delete objItem[item]
      if (item === 'total') delete objItem[item]
      if (item === 'hideOnSinglePage') delete objItem[item]
      if (item === 'layout') delete objItem[item]
    })
    return objItem
  }
  return {
    comState,
    handleSizeChange,
    delField,
    handleCurrentChange
  }
}
