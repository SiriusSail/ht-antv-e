import { defineComponent, inject, ref, watchEffect } from 'vue'
import { Node } from '@antv/x6';
import * as echarts from 'echarts'
import CodeJson from '@/components/Editor/codeJson.vue'
import Input from './input'

export default defineComponent({
  setup() {
    const pageStore = inject<{
      selectNode: {
        value: Node
      },
    }>('pageStore')
    const option = ref<string>();
    // eslint-disable-next-line no-underscore-dangle
    const _title = ref<string>();
    const codeJsonValue = ref<echarts.EChartsOption | null>()
    const initOption = () => {
      if (codeJsonValue.value) {
        const oldTitle = codeJsonValue.value.title;
        if (oldTitle) {
          if (oldTitle instanceof Array) {
            _title.value = oldTitle[0]?.text || '';
          } else {
            _title.value = oldTitle?.text || '';
          }
        }
        option.value = _title.value;
      } else {
        option.value = '';
        _title.value = '';
      }
    }
    watchEffect(() => {
      if (codeJsonValue.value && pageStore?.selectNode.value?.attrs?.option) return;
      if (pageStore?.selectNode.value?.attrs?.option) {
        codeJsonValue.value = pageStore?.selectNode.value?.attrs?.option;
      } else {
        codeJsonValue.value = null;
      }
      initOption();
    })

    // watchEffect(() => {
    //   console.log(11112222);
    //   if (codeJsonValue.value) {
    //     pageStore?.selectNode.value?.attr('option', codeJsonValue.value as any);
    //   }
    // })

    watchEffect(() => {
      if (codeJsonValue.value) {
        if (option.value === _title.value) {
          pageStore?.selectNode.value?.attr('option', codeJsonValue.value as any);
          initOption();
          return;
        }
        _title.value = option.value;
        if (codeJsonValue.value.title instanceof Array) {
          codeJsonValue.value = {
            ...codeJsonValue.value,
            title: [
              {
                ...codeJsonValue.value.title[0],
                text: option.value,
              },
              ...codeJsonValue.value.title.slice(1, codeJsonValue.value.title.length - 1)
            ]
          }
        } else {
          codeJsonValue.value = {
            ...codeJsonValue.value,
            title: {
              ...(codeJsonValue.value.title || {}),
              text: option.value,
            }
          }
        }
        pageStore?.selectNode.value?.attr('option', codeJsonValue.value as any);
      }
    })

    const onChange = (e: string) => {
      try {
        const jsone = JSON.parse(e)
        codeJsonValue.value = jsone;
      } catch (error) {
        console.log('json格式错误')
      }
    }

    return () => <div className='flex-column'>
      {codeJsonValue.value && <Input
        label='图表名称'
        name='echatTitle'
        v-models={[
          [option.value, 'value']
        ]}
        placeholder='请输入表格名称'
      />}
      {codeJsonValue.value && <CodeJson
        v-models={[
          [codeJsonValue.value, 'modelValue']
        ]}
        theme='solarized'
        onChanged={onChange}
      />}
    </div>
  }
})
