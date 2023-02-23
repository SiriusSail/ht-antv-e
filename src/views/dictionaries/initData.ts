import {
  ref,
  reactive
} from "vue";
import { Colum } from '@/components/table/types'
import { positiveInteger } from '@/utils/validate'
interface StateType {
  sId: any
  queryData: {
    orderNum: string | number
    dictLabel: string | number
    dictType: string | number
    dictValue: string | number
    remark: string | number
    description: string | number
  }
  querySearchData: {
    dictLabel: string
    dictType: string
  }
  fromSearchData: any[]
  fromData: any[]
  add_visible: Boolean
  isBtnLoading: Boolean
  editType: string
  tableData: any[]
  tableColumn: Colum[]
}

const initData = () => {
  let formRef = ref<any>(null) //表单dom
  let refSearch = ref<any>(null) //搜索dom
  let selectList: any[] = [] //类型选择数组
  let state = reactive<StateType>({
    sId: '',
    querySearchData: { dictLabel: '', dictType: '' },
    fromSearchData: [
      { type: 'text', label: '标签：', name: 'dictLabel', placeholder: '请输入标签', col: { span: 6 } },
      {
        type: 'select', label: '类型', name: 'dictType', placeholder: '请选择类型', select: selectList, labelWidth: '60px', col: { span: 6 },
      },
      { name: 'submit', type: 'slot', labelWidth: '10px', col: { span: 1 } },
    ],

    queryData: { orderNum: '', dictLabel: '', dictType: '', dictValue: '', remark: '', description: '', },

    fromData: [
      {
        type: 'number', label: '排序', name: 'orderNum', placeholder: '请输入数字',
        col: { span: 11 },
        rules: [{ trigger: 'blur', validator: positiveInteger }],
      },
      {
        type: 'text', label: '标签', name: 'dictLabel', placeholder: '请输入标签', labelWidth: '60px',
        col: { span: 13 },
        rules: { required: true, message: '请输入标签', trigger: 'blur', },
      },
      {
        type: 'text', label: '键值', name: 'dictValue', placeholder: '请输入键值',
        col: { span: 11, },
        rules: { required: true, message: '请输入键值', trigger: 'blur' },
      },
      {
        type: 'text', label: '类型', name: 'dictType', placeholder: '请输入编码', labelWidth: '60px',
        col: { span: 13 },
        rules: { required: true, message: '请输入编码', trigger: 'blur' },
      },
      {
        type: 'text', label: '类型描述', name: 'description', placeholder: '请输入类型描述',
        rules: { required: true, message: '请输入类型描述', trigger: 'blur' },
      },
      { type: 'textarea', label: '备注', name: 'remark', placeholder: '写个备注记录下呗' },
      { name: 'submit', type: 'slot', labelWidth: '0px' },
    ],
    tableColumn: [
      { label: '排序', prop: 'orderNum', minWidth: '60px', showOverflowTooltip: true },
      { label: '标签', prop: 'dictLabel', minWidth: '150px', showOverflowTooltip: true },
      { label: '类型', prop: 'dictType', minWidth: '100px', showOverflowTooltip: true },
      { label: '键值', prop: 'dictValue', minWidth: '130px', showOverflowTooltip: true },
      { label: '更新时间', prop: 'gmtModified', minWidth: '150px', showOverflowTooltip: true, sortable: true },
      { label: '创建时间', prop: 'gmtCreate', minWidth: '150px', showOverflowTooltip: true, sortable: true },
      { label: '类型描述', prop: 'description', minWidth: '200px', showOverflowTooltip: true },
      { label: '备注', prop: 'remark', minWidth: '200px', },
      { label: '操作', prop: 'operation', width: '210px', slot: true, fixed: 'right', }
    ],
    tableData: [],
    add_visible: false,
    isBtnLoading: false,
    editType: 'save',
  })
  return {
    formRef,
    refSearch,
    selectList,
    state,
  }
}
export default initData