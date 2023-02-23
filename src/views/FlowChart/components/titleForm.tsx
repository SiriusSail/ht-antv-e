import { defineComponent, ref, PropType, inject, watchEffect } from 'vue'
import * as Element from 'element-plus'
import apis,{getDictType} from '../apis'
import { debounce } from './../../../utils/func';



export type FormData = {
  code: string;
  name: string;
  flowDefContent: string;
  flowType: string;
  gradation:any[]; //指标层次
  dimension:string; // 分流程
  flowLevel:string; //指标层级
}


const {
  ElButton,
  ElDialog,
  ElForm,
  ElMessage,
  ElSelect,
  ElOption,
  ElInput,
  ElFormItem,
  ElCheckbox,
  ElCheckboxGroup,
} = Element;

export default defineComponent({
  props: {
    isShowForm: {
      type: Boolean,
      default: false,
    },
    intValue: {
      type: Object as PropType<FormData>,
      required: true,
    },
    onSubmit: {
      type: Function as PropType<(value: FormData) =>void>,
      required: true,
    },
    onClose: {
      type: Function as PropType<() =>void>,
      required: true,
    },
  },
  setup(props) {
    
    const flowType = apis.获取指标类型({
      needInit: true,
      initValue: []
    })

    const codeList = apis.获取名称列表({
      needInit: false,
      initValue: []
    })

    const  indexHierarchyList = ref<any[]>([])
    const  indexSystemLevel = ref<any[]>([])
    const  subProcessList = ref<any[]>([])

    const form = ref<FormData>(props.intValue);
  
    const formRef = ref<any>({});
    watchEffect(() => {
      form.value = props.intValue;
      // console.log(form.value);
    })
    // 指标层次
    const getIndexHierarchy = ()=>{
      getDictType("IND_GRADATION").then((res)=>{
        indexHierarchyList.value = res.result;
      })
    }
    // 指标体系层级
    const getIndexSystemLevel = ()=>{
      getDictType("FLOW_LEVEL_TYPE").then((res)=>{
        indexSystemLevel.value = res.result;
      })
    }
    // 分流程
    const getSubProcess = ()=>{
      getDictType("ind_flow_dimension").then((res)=>{
        subProcessList.value = res.result;
      })
    }
    const init = ()=>{
      getIndexHierarchy()
      getIndexSystemLevel()
      getSubProcess()
    }
    init()

    return () => <div>
      <ElDialog
        modelValue={props.isShowForm}
        title='编辑指标信息'
        onClose={props.onClose}
        v-slots={{
          footer: () => <span class='dialog-footer'>
            <ElButton
              onClick={() => {
                props.onClose?.()
              }}
            >
              取消
            </ElButton>
            <ElButton
              type='primary'
              onClick={() => {
                console.log(formRef.value);
                formRef.value.validate((valid: boolean) => {
                  if (valid) {
                    props.onSubmit?.(form.value)
                    props.onClose?.()
                    console.log('submit')
                  } else {
                    console.log('error submit!!')
                  }
                })
              }}
            >
              确定
            </ElButton>
          </span>,
        }}
      >
        <ElForm
          model={form.value}
          ref={(e: any) => {
            formRef.value = e
          }}
          label-width={120}>

          <ElFormItem
            label='指标名称'
            prop="name"
            rules={{
              required: true,
              message: '请输入指标名称',
              trigger: 'change',
            }}
          >
            <ElInput
              type='input'
              v-model={form.value.name}
              placeholder='请输入指标名称'
              autocomplete='off'
            />
          </ElFormItem>
          <ElFormItem
            label='指标类型'
            required
            prop="flowType"
            rules={{
              required: true,
              message: '请选择指标类型',
              trigger: 'change',
            }}
          >
            <ElSelect
              onChange={(e) => codeList.request(e).finally(() => {
                form.value.code = '';
              })}
              v-model={form.value.flowType}
              placeholder='请选择指标类型'
            >
              {flowType.data.map((item) =><ElOption
                key={item.dictValue}
                value={item.dictValue}
                label={item.dictLabel} />)}
            </ElSelect>
            
          </ElFormItem>
          <ElFormItem label='指标领域'
            prop="flowType"
            rules={{
              required: true,
              message: '请选择指标领域',
              trigger: 'change',
            }}>
            <ElSelect
              filterable
              remote
              reserve-keyword
              disabled={!form.value.flowType}
              loading={codeList.loading}
              v-model={form.value.code}
              placeholder='请选择指标领域'
            
            >
              {codeList.data.map((item) =><ElOption
                key={item.value}
                value={item.value}
                label={item.label} />)}
            </ElSelect>
          </ElFormItem>
          <ElFormItem label='指标层次' 
          prop="gradation"
             rules={{
              required: true,
              message: '请选择指标层次',
              trigger: 'change',
            }}>
            <ElCheckboxGroup v-model={form.value.gradation}>
              {indexHierarchyList.value.map((item)=>{
                return<ElCheckbox label={item.dictValue}>{item.dictLabel}</ElCheckbox>
              })}
            </ElCheckboxGroup>
          </ElFormItem>
          <ElFormItem label='指标层级'  
          prop="flowLevel"
          rules={{
              required: true,
              message: '请选择指标层级',
              trigger: 'change',
            }}>
            <ElSelect
              filterable
              v-model={form.value.flowLevel}
              placeholder='请选择指标层级'
            >
              {indexSystemLevel.value.map((item) =><ElOption
                key={item.value}
                value={item.dictValue}
                label={item.dictLabel} />)}
            </ElSelect>
          </ElFormItem>
          <ElFormItem label='分流程'  
          prop="dimension"
          rules={{
              required: true,
              message: '请选择分流程',
              trigger: 'change',
            }}>
            <ElSelect
              filterable
              v-model={form.value.dimension}
              placeholder='请选择分流程'
            >
              {subProcessList.value.map((item) =><ElOption
                key={item.value}
                value={item.dictValue}
                label={item.dictLabel} />)}
            </ElSelect>
          </ElFormItem>
          <ElFormItem
          prop="flowDefContent"
            label='指标定义'
            required
            rules={{
              required: true,
              message: '请输入指标定义',
              trigger: 'change',
            }}
          >
            <ElInput
              type='input'
              v-model={form.value.flowDefContent}
              placeholder='请输入指标定义'
              autocomplete='off'
            />
          </ElFormItem>
        </ElForm>
      </ElDialog>
    </div>
  }
})
