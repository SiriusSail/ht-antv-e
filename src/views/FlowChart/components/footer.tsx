import { defineComponent, ref, inject, watch } from 'vue'
import * as Element from 'element-plus'
import styles from './components.module.scss'
import { FlowDdmflowType } from '../apis'
import './components.deep.scss'

type ColumnsItem =  {
  label?: string;
  prop: string;
}
const { ElRadioGroup,
  ElRadioButton,
  ElTabs,
  ElTabPane,
  ElTable,
  ElTableColumn,
  ElDescriptions,
  ElDescriptionsItem,
} = Element;
export default defineComponent({
  setup() {
    const pageStore = inject<{
      viewDdmflowData: {
        value: FlowDdmflowType
      },
    }>('pageStore')

    const colmun = ref<ColumnsItem[]>([]);
    const activeName = ref('0')
    watch([pageStore.viewDdmflowData], ([viewDdmflowData]) => {
      colmun.value = Array
        .from(new Set(viewDdmflowData.value?.resultStr
          ?.map(((item) => Object.keys(item)))
          .flat() || []))
        ?.map((item) => ({
          label: item,
          prop: item,
        })) || []
    })
    // const
    return () => <div className='flex-column'>
      <ElRadioGroup v-model={activeName.value}>
        <ElRadioButton label='0'>脚本</ElRadioButton>
        <ElRadioButton label='1'>日志</ElRadioButton>
        <ElRadioButton label='2'>结果</ElRadioButton>
      </ElRadioGroup>
      <div className={styles.border}>
        <ElTabs
          v-model={activeName}
        >
          <ElTabPane
            sv-slots={{
              label: (): undefined => undefined
            }}
            name='0'
          >
            <div>{pageStore.viewDdmflowData.value.scriptStr}</div>
          </ElTabPane>
          <ElTabPane
            sv-slots={{
              label: (): undefined => undefined
            }}
            name='1'
          >
            <ElDescriptions column={1}>
              {
                pageStore
                  .viewDdmflowData
                  .value
                  .logStr
                  ?.map((item) => <ElDescriptionsItem label={item.level}>
                    {`${item.time} ${item.module} ${item.msg}`}
                  </ElDescriptionsItem>)
              }

            </ElDescriptions>
          </ElTabPane>
          <ElTabPane
            sv-slots={{
              label: (): undefined => undefined
            }}
            name='2'
          >
            <ElTable
              data={pageStore.viewDdmflowData.value.resultStr}
              stripe
              style={{
                width: '100%',
                height: '100%',
              }}
            >
              {

                colmun.value.map((item) => <ElTableColumn key={item.prop} {...item} />)}
            </ElTable>
          </ElTabPane>
        </ElTabs>
      </div>
    </div>
  }
})
