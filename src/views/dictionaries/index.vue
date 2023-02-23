<template>
  <div class="MarketingMetrics">

    <div class="col_table">
      <div class="search">
        <MyForm ref="refSearch"
                :form="querySearchData"
                status-icon
                :list="fromSearchData"
                label-position="right"
                label-width="auto">
          <template #submit>
            <el-button type="primary"
                       @click='handleSerach()'>查询</el-button>
            <el-button type="primary"
                       @click='handleReset()'>重置</el-button>
          </template>
        </MyForm>
      </div>
      <div class="col_btn">
        <el-button type="primary"
                   icon="el-icon-plus"
                   size="small"
                   @click="onCreate">新增</el-button>
        <el-button type="success"
                   icon="el-icon-refresh"
                   size="small"
                   :loading='isBtnLoading'
                   @click="onRefresh">刷新</el-button>
      </div>
      <!-- 表格 -->
      <MyTable border
               :data="tableData"
               :column="tableColumn"
               is-pagination
               :isLoading="isLoading"
               empty-text='暂无数据'
               :pagination="pagination"
               @paginationChange="handleCurrentChange"
               @paginationSizeChange='handleSizeChange'>
        <template #operation='{data}'>
          <div class="operation">
            <el-button type="primary"
                       size="mini"
                       @click="handleEdit(data.row)">编辑</el-button>
            <el-button type="info"
                       size="mini"
                       @click="handleDel(data.row)">删除</el-button>
          </div>
        </template>
      </MyTable>
    </div>

    <el-dialog v-model="add_visible"
               :title="editType==='save'?'新增':'编辑' "
               @closed="handleClose">
      <MyForm ref="formRef"
              :form="queryData"
              status-icon
              :list="fromData"
              label-position="right"
              label-width="auto">
        <template #submit>
          <div class="operation">
            <el-button type="primary"
                       size="small"
                       @click='handleSubmit'>保存</el-button>
          </div>
        </template>
      </MyForm>
    </el-dialog>
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, toRefs, onMounted, provide } from 'vue'
  import hwTableMixins from '@/mixins/hwTableMixins'
  import MyTable from '@/components/table/index.vue'
  import Service from './api/index'
  import MyForm from '@/components/Form/index.vue'
  import { useConfirmDelete } from '@/utils/func'
  import { ElMessage } from 'element-plus/lib/components/message'
  import initData from './initData'
  import methods from './methods'
  export default defineComponent({
    components: {
      MyTable,
      MyForm,
    },

    setup () {
      /****************************************** 初始化数据 **************************************************/
      let { formRef, refSearch, selectList, state, } = initData()

      /****************************************** vue生命周期 **************************************************/
      onMounted(() => {
        getSysdictList()
        getList()
      })

      /****************************************** 自定义click事件 **************************************************/
      // tabble刷新
      const onRefresh = async () => {
        state.isBtnLoading = true
        await getList()
        setTimeout(() => {
          state.isBtnLoading = false
        }, 500)
      }

      // tabble查询
      const handleSerach = () => {
        let bData: any = JSON.parse(JSON.stringify(state.querySearchData))
        bData.description = state.querySearchData.dictType.split('@&@')[0]
        bData.dictType = state.querySearchData.dictType.split('@&@')[1]
        comState.pagination = { ...comState.pagination, ...bData }
        getList()
      }

      // 重置
      const handleReset = () => {
        refSearch.value?.resetForm()
      }
      // 编辑
      const handleEdit = (item: any) => {
        state.editType = 'edit'
        const objItem = JSON.parse(JSON.stringify(item))
        const { orderNum, dictLabel, dictType, dictValue, remark, rowId, description } = objItem
        state.queryData.orderNum = orderNum
        state.queryData.dictLabel = dictLabel
        state.queryData.dictType = dictType
        state.queryData.dictValue = dictValue
        state.queryData.remark = remark
        state.queryData.description = description
        state.sId = rowId
        state.add_visible = true
      }

      // 删除
      const handleDel = async (item: any) => {
        const resul = await useConfirmDelete('是否删除?')
        if (resul) {
          const res = await Service.multifunction('delete', [item.rowId])
          if (res.success) {
            ElMessage.success({
              message: '成功',
              type: 'success',
            })
          }
          getSysdictList()
          getList()
        }
      }
      // 新增弹出
      const onCreate = () => {
        state.editType = 'save'
        state.add_visible = true
      }

      // 关闭弹出层时清空表单数据
      const handleClose = () => {
        state.queryData = {
          orderNum: '',
          dictLabel: '',
          dictType: '',
          dictValue: '',
          remark: '',
          description: '',
        }
        formRef.value?.resetForm(state.queryData)
      }

      //保存数据
      const handleSubmit = () => {
        formRef.value?.validate(async (valid: any) => {
          if (valid) {
            let meothod = 'post'
            let sData: any = state.queryData
            if (state.editType === 'edit') {
              meothod = 'put'
              sData.rowId = state.sId
            } else {
              let num: any = state.queryData.orderNum
              sData.orderNum = parseInt(num);
            }
            const res = await Service.multifunction(meothod, sData)
            if (res.success)
              ElMessage.success({
                message: '操作成功',
                type: 'success',
              })
            state.add_visible = false
            getList()
            getSysdictList()
          }
        })
      }

      /****************************************** 自定义方法 **************************************************/

      // 获取弹出层类型数据
      const getSysdictList = async () => {
        const res = await Service.getSysdictList()
        selectList = []
        res.result.map((item: any) => {
          let obj: any = { label: '', value: '' }
          obj.label = `${item.label},${item.value}`
          obj.value = `${item.label}@&@${item.value}`
          selectList.push(obj)
        })

        state.fromSearchData[1].select = selectList
      }



      // 获取弹出层类型数据
      const getList = async () => {
        comState.isLoading = true
        const res = await Service.getList(delField(comState.pagination))
        state.tableData = res.result.records
        comState.pagination.total = res.result.total
        setTimeout(() => {
          comState.isLoading = false
        }, 300)
      }

      const { comState, handleSizeChange, handleCurrentChange, delField } = hwTableMixins(getList)
      // const { comState, handleSizeChange, handleCurrentChange, delField } = hwTableMixins(methods.getList)
      // methods.getList(comState, state.tableData, delField(comState.pagination))

      return {
        handleCurrentChange,
        handleSizeChange,
        handleEdit,
        handleDel,
        handleSerach,
        handleReset,
        onCreate,
        onRefresh,
        formRef,
        refSearch,
        handleSubmit,
        handleClose,
        ...toRefs(state),
        ...toRefs(comState)
      }
    },
  })
</script>
<style lang="scss" scoped>
  .search {
    margin-top: 20px;
  }
  .col_table {
    padding: 0 20px;
    .col_btn {
      margin-bottom: 20px;
    }
  }
  .operation {
    width: 100%;
    text-align: center;
  }
</style>
