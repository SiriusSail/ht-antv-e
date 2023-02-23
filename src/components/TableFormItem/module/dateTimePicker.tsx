
import { defineComponent, ref, PropType, watchEffect } from 'vue'
import * as Element from 'element-plus'
import { PickerType } from '../index.d'
import "../index.deep.scss"

const { ElFormItem, ElDatePicker } = Element;

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
    placeholder: {
      type: String,
      required: true,
      default: ''
    },
    className: {
      type: String,
      required: true,
      default: ''
    },
    type: {
      type: String as PropType<PickerType>,
      required: false,
      default: "datetime",
    },

    onChange: {
      type: Function as PropType<(value: string) => void>,
      required: false,
      default: ():undefined => undefined
    },
  },
  emits: {
    'update:value': (val: string) => val
  },
  // eslint-disable-next-line vue/no-setup-props-destructure
  setup({value, label, className, ...props}, { emit }) {
    const newvalue = ref(value);
    watchEffect(() => {
      emit('update:value', newvalue.value)
    })
    return () => {
      if (label) {
        return <ElFormItem label={label} key={label} className='form-item-label-justify'>
          <ElDatePicker
            {...props}
            className={className}
            v-model={newvalue.value}
          >
          </ElDatePicker>
        </ElFormItem>
      }
      return  <ElDatePicker
        {...props}
        className={className}
        v-model={newvalue.value}
      >
      </ElDatePicker>
    }
  }})

