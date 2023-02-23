
import { defineComponent, ref, watchEffect } from 'vue'
import * as Element from 'element-plus'

const {
  ElFormItem,
  ElRate,
} = Element

export default  defineComponent({
  props: {
    label: {
      type: String,
      required: true,
      default: ''
    },
    name: {
      type: String,
      required: true,
      default: ''
    },
    value: {
      type: String,
      required: true,
      default: ''
    },
    onChange: {
      type: Function as PropType<(value: string) => void>,
      required: false,
      default: () => undefined
    },
  },
  emits: {
    'update:value': (val: string) => val
  },
  // eslint-disable-next-line vue/no-setup-props-destructure
  setup(props, { emit }) {
    const newvalue = ref(props.value);

    watchEffect(() => {
      emit('update:value', newvalue.value)
      props.onChange(newvalue.value)
    })
    return () => <ElFormItem label={props.label} label-width={props.label ? undefined : 0} className='form-item-label-justify'>
      <ElRate v-model={newvalue.value} allow-half style={{lineHeight: '50px'}} />
    </ElFormItem>
  }})

// export default (props: PublicPropsType) => <ElFormItem label={props.label}>
// 	<ElInput v-model={props.value}></ElInput>
// </ElFormItem>
