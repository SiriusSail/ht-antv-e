
import { defineComponent, ref, watchEffect, PropType } from 'vue'
import * as Element from 'element-plus'

const { ElFormItem, ElInput } = Element;

export default defineComponent({
  props: {
    label: {
      type: String,
      required: false,
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
    placeholder: {
      type: String,
      required: true,
      default: ''
    },
    disabled: {
      type: Boolean,
      required: true,
      default: false
    },
    onInput: {
      type: Function as PropType<(value: string) => void>,
      required: false,
      default: () => undefined
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
      newvalue.value = props.value
    })
    watchEffect(() => {
      emit('update:value', newvalue.value)
    })
    return () => {
      if(props.label) {
        return <ElFormItem label={props.label} className='form-item-label-justify'>
          <ElInput
            v-model={newvalue.value}
            onInput={props.onInput}
            onChange={props.onChange}
            placeholder={props.placeholder}
            disabled={props.disabled}
          />
        </ElFormItem>
      }
      return <ElInput
        v-model={newvalue.value}
        onInput={props.onInput}
        placeholder={props.placeholder}
        disabled={props.disabled}
      />
    }
  }})

// export default (props: PublicPropsType) => <ElFormItem label={props.label}>
// 	<ElInput v-model={props.value}></ElInput>
// </ElFormItem>
